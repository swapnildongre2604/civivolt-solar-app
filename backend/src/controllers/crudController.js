import { query } from '../config/db.js';

const TABLES = {
  leads: 'leads',
  customers: 'customers',
  projects: 'projects',
  tasks: 'tasks',
  inventory: 'inventory_items',
  vendors: 'vendors',
  expenses: 'expenses',
  payments: 'payments'
};

export function makeCrudController(entity) {
  const table = TABLES[entity];

  return {
    list: async (req, res) => {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const offset = (page - 1) * limit;
      const search = req.query.search;

      let sql = `SELECT * FROM ${table}`;
      const values = [];
      if (search) {
        sql += ' WHERE CAST(row_to_json(' + table + ') AS text) ILIKE $1';
        values.push(`%${search}%`);
      }
      sql += ` ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const result = await query(sql, values);
      res.json(result.rows);
    },

    create: async (req, res) => {
      const payload = req.body;
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const params = keys.map((_, i) => `$${i + 1}`).join(', ');

      const insert = await query(
        `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${params}) RETURNING *`,
        values
      );
      res.status(201).json(insert.rows[0]);
    },

    update: async (req, res) => {
      const id = Number(req.params.id);
      const payload = req.body;
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const sets = keys.map((key, i) => `${key}=$${i + 1}`).join(', ');

      const updated = await query(
        `UPDATE ${table} SET ${sets}, updated_at=NOW() WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, id]
      );

      if (!updated.rows[0]) return res.status(404).json({ message: 'Not found' });
      return res.json(updated.rows[0]);
    },

    remove: async (req, res) => {
      const id = Number(req.params.id);
      await query(`DELETE FROM ${table} WHERE id=$1`, [id]);
      res.status(204).send();
    }
  };
}
