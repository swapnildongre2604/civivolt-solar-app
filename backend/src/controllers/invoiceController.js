import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { query } from '../config/db.js';
import { calculateGST, nextInvoiceNumber } from '../utils/invoice.js';

dotenv.config();

export async function createInvoice(req, res) {
  const { customer_id, place_of_supply, items, invoice_type } = req.body;

  const last = await query('SELECT invoice_number FROM invoices ORDER BY id DESC LIMIT 1');
  const invoice_number = nextInvoiceNumber(last.rows[0]?.invoice_number);
  const intraState = place_of_supply === 'INTRA';
  const totals = calculateGST(items, intraState);

  const inserted = await query(
    `INSERT INTO invoices (invoice_number, customer_id, invoice_type, place_of_supply, taxable_amount, cgst, sgst, igst, total_amount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [
      invoice_number,
      customer_id,
      invoice_type,
      place_of_supply,
      totals.taxable,
      totals.cgst,
      totals.sgst,
      totals.igst,
      totals.total
    ]
  );

  const invoice = inserted.rows[0];
  for (const line of items) {
    await query(
      `INSERT INTO invoice_items (invoice_id, description, hsn_sac, qty, rate, amount)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [invoice.id, line.description, line.hsn_sac, line.qty, line.rate, line.qty * line.rate]
    );
  }

  res.status(201).json(invoice);
}

export async function downloadInvoicePdf(req, res) {
  const id = Number(req.params.id);
  const invoice = (await query('SELECT * FROM invoices WHERE id=$1', [id])).rows[0];
  const customer = (await query('SELECT * FROM customers WHERE id=$1', [invoice.customer_id])).rows[0];
  const items = (await query('SELECT * FROM invoice_items WHERE invoice_id=$1', [id])).rows;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoice_number}.pdf`);

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(res);
  doc.fontSize(16).text('CIVIVOLT Infrastructure Pvt Ltd');
  doc.fontSize(10).text(`Invoice: ${invoice.invoice_number}`);
  doc.text(`Customer: ${customer.name} (${customer.gstin || 'N/A'})`);
  doc.moveDown();

  items.forEach((item) => {
    doc.text(`${item.description} | HSN/SAC: ${item.hsn_sac} | Qty: ${item.qty} x ₹${item.rate} = ₹${item.amount}`);
  });

  doc.moveDown();
  doc.text(`Taxable: ₹${invoice.taxable_amount}`);
  doc.text(`CGST: ₹${invoice.cgst} | SGST: ₹${invoice.sgst} | IGST: ₹${invoice.igst}`);
  doc.fontSize(12).text(`Total: ₹${invoice.total_amount}`);
  doc.end();
}

export async function summaryReport(req, res) {
  const report = await query(
    `SELECT date_trunc('month', issue_date) as month,
      SUM(taxable_amount) taxable,
      SUM(cgst + sgst + igst) gst,
      SUM(total_amount) gross
     FROM invoices GROUP BY 1 ORDER BY 1 DESC`
  );
  res.json(report.rows);
}

export async function exportReportExcel(req, res) {
  const rows = (await query('SELECT * FROM invoices ORDER BY issue_date DESC')).rows;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('GSTR Summary');
  ws.columns = [
    { header: 'Invoice', key: 'invoice_number' },
    { header: 'Date', key: 'issue_date' },
    { header: 'Taxable', key: 'taxable_amount' },
    { header: 'GST', key: 'gst' },
    { header: 'Total', key: 'total_amount' }
  ];

  rows.forEach((r) => ws.addRow({ ...r, gst: Number(r.cgst) + Number(r.sgst) + Number(r.igst) }));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=gst-summary.xlsx');
  await wb.xlsx.write(res);
  res.end();
}

export async function emailInvoice(req, res) {
  const { to, invoiceId } = req.body;
  const invoice = (await query('SELECT invoice_number FROM invoices WHERE id=$1', [invoiceId])).rows[0];
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: 'billing@civivolt.com',
    to,
    subject: `Invoice ${invoice.invoice_number}`,
    text: 'Please find your GST invoice attached. (Attachment integration can be extended.)'
  });

  res.json({ message: 'Email queued' });
}
