import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createCrudRouter } from './routes/crudRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', createCrudRouter('leads'));
app.use('/api/customers', createCrudRouter('customers'));
app.use('/api/projects', createCrudRouter('projects'));
app.use('/api/tasks', createCrudRouter('tasks'));
app.use('/api/inventory', createCrudRouter('inventory'));
app.use('/api/vendors', createCrudRouter('vendors'));
app.use('/api/expenses', createCrudRouter('expenses'));
app.use('/api/payments', createCrudRouter('payments'));
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on ${port}`));
