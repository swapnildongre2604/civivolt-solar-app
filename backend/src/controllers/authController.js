import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../config/db.js';

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await query('SELECT id, name, email, password_hash, role FROM users WHERE email=$1', [email]);
  const user = result.rows[0];

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });

  return res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
}
