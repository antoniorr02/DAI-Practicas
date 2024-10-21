import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Para el hash de contraseñas
import Usuarios from '../model/usuarios.js'; // Modelo de usuarios

const router = express.Router();

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login.html');
});

// Recoger datos del formulario de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body; 

  try {
    // Buscar el usuario en la base de datos
    const user = await Usuarios.findOne({ username });

    // Comprobar si el usuario no fue encontrado
    if (!user) {
      return res.status(401).send('Usuario no encontrado');
    }

    // Comparar la contraseña ingresada con la almacenada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Generar el token JWT
    const token = jwt.sign({ usuario: user.username }, process.env.SECRET_KEY);

    // Establecer la cookie con el token
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.IN === 'production',
    }).redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Logout del usuario
router.get('/logout', (req, res) => {
  // No necesitas usar req.username si no lo has almacenado antes
  res.clearCookie('access_token').redirect('/');
});

export default router;
