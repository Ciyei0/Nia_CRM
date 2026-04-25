// test.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'whaticket_user',
  host: 'localhost',
  database: 'whaticketsaas',
  password: 'mysql123456',
  port: 5432,
});

async function run() {
  try {
    const res = await pool.query('SELECT id, body, "fromMe", "mediaType", "ticketId", "createdAt" FROM "Messages" ORDER BY "createdAt" DESC LIMIT 10;');
    console.log("=== LAST 10 MESSAGES ===");
    res.rows.forEach(r => console.log(r));
  } catch(e) {
    console.error("DB Query error", e);
  } finally {
    pool.end();
  }
}
run();
