const db = require('../config/db');

const columns = {
  link_portal: "VARCHAR(500) NULL",
  observacoes_boleto: "TEXT NULL",
  status_boleto: "VARCHAR(30) NOT NULL DEFAULT 'Pendente'"
};

db.query('SHOW COLUMNS FROM clients', (columnsErr, rows) => {
  if (columnsErr) {
    console.error(columnsErr.message);
    db.end();
    process.exit(1);
  }

  const existingColumns = new Set(rows.map((row) => row.Field));
  const missingColumns = Object.entries(columns).filter(([name]) => !existingColumns.has(name));

  if (missingColumns.length === 0) {
    console.log('As colunas ja existem:', Object.keys(columns).join(', '));
    db.end();
    return;
  }

  const alterSql = `ALTER TABLE clients ${missingColumns
    .map(([name, type]) => `ADD COLUMN ${name} ${type}`)
    .join(', ')}`;

  db.query(alterSql, (alterErr) => {
    if (alterErr) {
      console.error(alterErr.message);
      db.end();
      process.exit(1);
    }

    console.log('Colunas criadas:', missingColumns.map(([name]) => name).join(', '));
    db.end();
  });
});
