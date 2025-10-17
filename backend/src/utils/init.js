import { runMigrations } from '../config/db.js';

export async function init() {
  await runMigrations();
}


