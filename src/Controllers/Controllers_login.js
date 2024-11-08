const pool = require('../Config/database');
const jwt = require('jsonwebtoken');

const getLogin = (req, res) => {
  const query = `SELECT * FROM usuarios`;

  pool.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
};

const postLogin = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE usuario = ?';

  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error en la consulta de base de datos:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      if (password === user.contrasena) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        console.log('Inicio de sesión exitoso para usuario:', username);
        res.status(200).json({ message: 'Login successful!', token });
      } else {
        console.warn('Contraseña inválida para usuario:', username);
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      console.warn('Usuario no encontrado:', username);
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
};



const updateLogin = (req, res) => {
  const { id, username, password } = req.body;
  const query = `UPDATE usuarios SET usuario = ?, contrasena = ? WHERE id = ?`;

  pool.query(query, [username, password, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Login updated successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
};

const deleteLogin = (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM usuarios WHERE id = ?`;

  pool.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User deleted successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
};

module.exports = { getLogin, postLogin, updateLogin, deleteLogin };
