import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import authRouter from './routes/auth.js';
import customersRouter from './routes/customers.js';
import adminRouter from './routes/admin.js';
import { init } from './utils/init.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB not reachable' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/customers', customersRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT || 4000;
init().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
  });
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to init:', err);
  process.exit(1);
});


