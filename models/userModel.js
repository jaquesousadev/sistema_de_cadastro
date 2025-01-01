const db = require('../config/db');


class User {
  static create(user, callback) {
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [user.username, user.password, user.email], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
    });
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
    });
  }

  static findAll(callback) {
    const query = 'SELECT * FROM users';
    db.query(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
    });
  }
}

module.exports = User;

