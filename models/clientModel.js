const db = require('../config/db');

const OPTIONAL_CLIENT_COLUMNS = ['link_portal', 'observacoes_boleto', 'status_boleto'];
const BASE_CLIENT_COLUMNS = [
  'empresa',
  'operadora',
  'plano',
  'apolice',
  'valor',
  'responsavel',
  'vencimento',
  'vidas',
  'phone',
  'email',
  'senha_email',
  'mes_reajuste',
  'login_portal',
  'senha_portal',
  'cnpj_cliente',
  'plataforma'
];

let clientColumnsCache = null;

function getClientColumns(callback) {
  if (clientColumnsCache) {
    callback(null, clientColumnsCache);
    return;
  }

  db.query('SHOW COLUMNS FROM clients', (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }

    clientColumnsCache = rows.map((row) => row.Field);
    callback(null, clientColumnsCache);
  });
}

function getAvailableClientColumns(callback) {
  getClientColumns((err, columns) => {
    if (err) {
      callback(err, null);
      return;
    }

    const availableOptionalColumns = OPTIONAL_CLIENT_COLUMNS.filter((column) => columns.includes(column));
    callback(null, [...BASE_CLIENT_COLUMNS, ...availableOptionalColumns]);
  });
}

class Client {
  static create(client, callback) {
    getAvailableClientColumns((columnsErr, columns) => {
      if (columnsErr) {
        callback(columnsErr, null);
        return;
      }

      const placeholders = columns.map(() => '?').join(', ');
      const query = `INSERT INTO clients (${columns.join(', ')}) VALUES (${placeholders})`;
      const values = columns.map((column) => client[column]);

      db.query(query, values, (err,result) => {
        if (err) {
          console.error("Erro ao criar cliente:", err); // Log de erro
          callback(err, null);
        } else {
          console.log("Cliente criado com sucesso:", result); // Log de sucesso
          callback (null, result);
        }
      });
    });
  }

  static findAll(callback) {
    const query = 'SELECT * FROM clients';
    db.query(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result[0]);
      }
      });
  }

  static updateById(id, client, callback) {
    getAvailableClientColumns((columnsErr, columns) => {
      if (columnsErr) {
        callback(columnsErr, null);
        return;
      }

      const query = `UPDATE clients SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?`;
      const values = [...columns.map((column) => client[column]), id];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Erro ao atualizar cliente", err); // Log de erro
          callback(err, null);
        } else {
          console.log("Cliente atualizado com sucesso:", result); // Log de sucesso
          callback (null, result);
        }
      });
    });
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Erro ao excluir cliente", err); // Log de erro
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }
}

module.exports = Client;
