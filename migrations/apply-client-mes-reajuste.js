const db = require('../config/db');

db.query('SHOW COLUMNS FROM clients', (columnsErr, rows) => {
  if (columnsErr) {
    console.error(columnsErr.message);
    db.end();
    process.exit(1);
  }

  const exists = rows.some((row) => row.Field === 'mes_reajuste');

  if (exists) {
    console.log('A coluna mes_reajuste ja existe.');
    db.end();
    return;
  }

  db.query('ALTER TABLE clients ADD COLUMN mes_reajuste TINYINT NULL', (alterErr) => {
    if (alterErr) {
      console.error(alterErr.message);
      db.end();
      process.exit(1);
    }

    console.log('Coluna criada: mes_reajuste');
    db.end();
  });
});
