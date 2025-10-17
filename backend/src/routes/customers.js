import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  gstin: z.string().min(5),
});

router.post('/', requireAuth, async (req, res) => {
  const parse = customerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid data', issues: parse.error.issues });
  const { name, email, gstin } = parse.data;
  const result = await pool.query(
    'INSERT INTO customers (broker_id, name, email, gstin) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.user.id, name, email, gstin]
  );
  res.status(201).json({ customer: result.rows[0] });
});

router.get('/', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM customers WHERE broker_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json({ customers: result.rows });
});

export default router;


