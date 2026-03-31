INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@civivolt.com', '$2a$10$hA5YI9dO8MTxEm2fXa7B8e0vDKf8T4w8A2jMg7QnF3N2/uJTR7B6O', 'Admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO customers (name, gstin, email, phone, billing_address) VALUES
('Shree Builders', '27ABCDE1234F1Z5', 'accounts@shreebuilders.in', '9876543210', 'Pune, Maharashtra'),
('GreenGrid Industries', '29AAFCG1100C1Z2', 'finance@greengrid.in', '9988776655', 'Bengaluru, Karnataka')
ON CONFLICT DO NOTHING;

INSERT INTO leads (company_name, contact_name, phone, status, source, score, follow_up_date) VALUES
('New Horizon Infra', 'Rahul Patil', '9990011122', 'qualified', 'website', 84, CURRENT_DATE + 2),
('SolarVista Homes', 'Neha Sharma', '9992211122', 'proposal', 'referral', 76, CURRENT_DATE + 1)
ON CONFLICT DO NOTHING;
