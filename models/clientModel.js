const db = require('../config/db');

const CLIENT_COLUMNS = [
  'empresa',
  'operadora',
  'plano',
  'apolice',
  'valor',
  'responsavel',
  'status_empresa',
  'vencimento',
  'vidas',
  'phone',
  'email',
  'senha_email',
  'mes_reajuste',
  'login_portal',
  'senha_portal',
  'link_portal',
  'observacoes_boleto',
  'status_boleto',
  'cnpj_cliente',
  'plataforma'
];

class Client {
  static create(client, callback) {
    const placeholders = CLIENT_COLUMNS.map(() => '?').join(', ');
    const query = `INSERT INTO clients (${CLIENT_COLUMNS.join(', ')}) VALUES (${placeholders})`;
    const values = CLIENT_COLUMNS.map((column) => client[column]);

    db.query(query, values, (err,result) => {
      if (err) {
        console.error("Erro ao criar cliente:", err); // Log de erro
        callback(err, null);
      } else {
        console.log("Cliente criado com sucesso:", result); // Log de sucesso
        callback (null, result);
      }
    });
  }

  static findAll(callback) {
    const query = 'SELECT * FROM clients ORDER BY id DESC';
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
    const query = `UPDATE clients SET ${CLIENT_COLUMNS.map((column) => `${column} = ?`).join(', ')} WHERE id = ?`;
    const values = [...CLIENT_COLUMNS.map((column) => client[column]), id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar cliente", err); // Log de erro
        callback(err, null);
      } else {
        console.log("Cliente atualizado com sucesso:", result); // Log de sucesso
        callback (null, result);
      }
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
