import { Router } from 'express';
import { query } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

router.get('/', async (_req, res) => {
  const [sales, projects, revenue, expenses] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM leads WHERE status='won'"),
    query("SELECT status, COUNT(*)::int AS count FROM projects GROUP BY status"),
    query('SELECT COALESCE(SUM(total_amount),0)::numeric AS total FROM invoices'),
    query('SELECT COALESCE(SUM(amount),0)::numeric AS total FROM expenses')
  ]);

  res.json({
    wonDeals: sales.rows[0].count,
    projectStatus: projects.rows,
    revenue: revenue.rows[0].total,
    expenses: expenses.rows[0].total,
    profit: Number(revenue.rows[0].total) - Number(expenses.rows[0].total)
  });
});

export default router;
