import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { setAuthCookie, clearAuthCookie, requireAuth } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  const role = 'admin';
  if (!parse.success) return res.status(400).json({ error: 'Invalid data', issues: parse.error.issues });
  const { name, email, password } = parse.data;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    );
    const user = result.rows[0];
    setAuthCookie(res, { id: user.id, email: user.email, name: user.name, role: user.role });
    return res.status(201).json({ user });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    return res.status(500).json({ error: e.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid data' });
  const { email, password } = parse.data;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  setAuthCookie(res, { id: user.id, email: user.email, name: user.name, role: user.role });
  return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE id=$1', [req.user.id]);
  const me = result.rows[0];
  res.json({ user: me });
});

export default router;


