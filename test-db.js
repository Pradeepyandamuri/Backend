const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err);
  } else {
    console.log('✅ Connected to DB:', res.rows);
  }
  pool.end();
});
