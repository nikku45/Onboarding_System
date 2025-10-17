import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/users', requireAuth, requireAdmin, async (_req, res) => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json({ users: result.rows });
});

router.get('/customers', requireAuth, requireAdmin, async (_req, res) => {
  const result = await pool.query(`
    SELECT c.*, u.email as broker_email, u.name as broker_name
    FROM customers c
    JOIN users u ON u.id = c.broker_id
    ORDER BY c.created_at DESC
  `);
  res.json({ customers: result.rows });
});

export default router;


