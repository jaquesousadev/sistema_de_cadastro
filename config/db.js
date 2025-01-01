require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const mysql = require('mysql');

console.log('port', process.env.DB_PORT);
console.log('host', process.env.DB_HOST);
console.log('user', process.env.DB_USER);
console.log('pass', process.env.BD_PASS);
console.log('name', process.env.DB_NAME);


const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10 // Limite de conexões no pool
});

const testConnection = () => {
  connection.getConnection((err, connection) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
      console.log('Conexão bem-sucedida!');
      connection.release(); // Libera a conexão
    }
  });
};

testConnection();


// connection.connect((err) => {
//   if (err) {
//     console.error('Erro ao conectar ao banco de dados:', err);
//     return;
//   }
//   console.log('Conectado ao banco de dados MySQL');
//   connection.end();
// });

module.exports = connection;
