import streamlit as st
import pandas as pd
import requests
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import matplotlib.pyplot as plt

# ==========================
# 🔐 LOGIN SYSTEM
# ==========================

def login():
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False

    if not st.session_state.logged_in:
        st.title("🔐 CIVIVOLT Login")

        username = st.text_input("Username")
        password = st.text_input("Password", type="password")

        if st.button("Login"):
            if username == "admin" and password == "civivolt123":
                st.session_state.logged_in = True
                st.rerun()
            else:
                st.error("Invalid Credentials")

        st.stop()

login()

# ==========================
# 🌍 SUPABASE CONFIG (REST)
# ==========================

SUPABASE_URL = "https://rtkzwqojsnmltckpfhfd.supabase.co"
SUPABASE_KEY = "sb_publishable_5ZG4W1qipzXnprXgaaJHGQ_TknkAiAr"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def save_to_db(customer, capacity, total_cost, gst, subsidy, final_amount):
    data = {
        "customer": customer,
        "capacity": capacity,
        "total_cost": total_cost,
        "gst": gst,
        "subsidy": subsidy,
        "final_amount": final_amount
    }

    requests.post(
        f"{SUPABASE_URL}/rest/v1/quotations",
        json=data,
        headers=headers
    )

def fetch_data():
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/quotations?select=*",
        headers=headers
    )
    return pd.DataFrame(response.json())

# ==========================
# PAGE SETTINGS
# ==========================

st.set_page_config(page_title="CIVIVOLT Solar ERP", layout="wide")
st.title("☀️ CIVIVOLT Solar ERP Dashboard")

# ==========================
# PREMIUM PDF FUNCTION
# ==========================

def generate_pdf(customer, capacity, total_cost, gst, subsidy, final_amount):

    file_name = "CIVIVOLT_Proposal.pdf"
    doc = SimpleDocTemplate(file_name)
    elements = []
    styles = getSampleStyleSheet()

    # Cover Page
    elements.append(Paragraph("CIVIVOLT INFRASTRUCTURE PRIVATE LIMITED", styles['Title']))
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph("Premium Solar Rooftop Proposal", styles['Heading1']))
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph(f"Customer: {customer}", styles['Normal']))
    elements.append(Paragraph(f"System Capacity: {capacity} kW", styles['Normal']))
    elements.append(PageBreak())

    # Financial Page
    elements.append(Paragraph("Financial Summary", styles['Heading1']))
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(f"Total Cost: ₹ {int(total_cost)}", styles['Normal']))
    elements.append(Paragraph(f"GST (13.8%): ₹ {int(gst)}", styles['Normal']))
    elements.append(Paragraph(f"Subsidy: ₹ {int(subsidy)}", styles['Normal']))
    elements.append(Paragraph(f"Final Investment: ₹ {int(final_amount)}", styles['Normal']))
    elements.append(PageBreak())

    # ROI Graph
    annual_savings = capacity * 4.5 * 30 * 8
    years = [1,2,3,4,5]
    savings = [annual_savings * y for y in years]

    plt.figure()
    plt.plot(years, savings)
    plt.title("5-Year Savings Projection")
    plt.xlabel("Years")
    plt.ylabel("Savings ₹")
    plt.savefig("roi_graph.png")
    plt.close()

    elements.append(Paragraph("Return on Investment Analysis", styles['Heading1']))
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Image("roi_graph.png", width=4*inch, height=3*inch))

    doc.build(elements)

    return file_name

# ==========================
# QUOTATION MODULE
# ==========================

st.subheader("Create New Solar Quotation")

customer = st.text_input("Customer Name")
capacity = st.number_input("System Capacity (kW)", min_value=1.0)
cost_per_kw = st.number_input("Cost per kW", min_value=10000.0)

if st.button("Generate Quotation"):

    total_cost = capacity * cost_per_kw
    gst = total_cost * 0.138
    subsidy = 78000 if capacity >= 3 else capacity * 30000
    final_amount = total_cost + gst - subsidy

    st.success("Quotation Generated Successfully!")

    st.write("### Calculation Summary")
    st.write("Total Cost: ₹", int(total_cost))
    st.write("GST: ₹", int(gst))
    st.write("Subsidy: ₹", int(subsidy))
    st.write("Final Payable Amount: ₹", int(final_amount))

    save_to_db(customer, capacity, total_cost, gst, subsidy, final_amount)

    file = generate_pdf(customer, capacity, total_cost, gst, subsidy, final_amount)

    with open(file, "rb") as f:
        st.download_button("Download Corporate Proposal PDF", f, file_name=file)

# ==========================
# DASHBOARD
# ==========================

st.subheader("Business Dashboard")

df = fetch_data()

col1, col2, col3 = st.columns(3)

col1.metric("Total Quotations", len(df))
col2.metric("Total Revenue ₹", int(df["final_amount"].sum()) if len(df)>0 else 0)
col3.metric("Installed kW", int(df["capacity"].sum()) if len(df)>0 else 0)

if len(df) > 0:
    st.bar_chart(df.set_index("customer")["final_amount"])