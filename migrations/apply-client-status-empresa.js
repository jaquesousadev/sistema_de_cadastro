const db = require('../config/db');

db.query('SHOW COLUMNS FROM clients', (columnsErr, rows) => {
  if (columnsErr) {
    console.error(columnsErr.message);
    db.end();
    process.exit(1);
  }

  const exists = rows.some((row) => row.Field === 'status_empresa');

  if (exists) {
    console.log('A coluna status_empresa ja existe.');
    db.end();
    return;
  }

  db.query("ALTER TABLE clients ADD COLUMN status_empresa VARCHAR(30) NOT NULL DEFAULT 'Ativa'", (alterErr) => {
    if (alterErr) {
      console.error(alterErr.message);
      db.end();
      process.exit(1);
    }

    console.log('Coluna criada: status_empresa');
    db.end();
  });
});
