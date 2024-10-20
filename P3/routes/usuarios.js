import express from "express";
import Productos from "../model/usuarios.js";
const router = express.Router();

// Para mostrar formulario de login
router.get('/login', (req, res)=>{
    res.render("login.html")
  })
  
  // Para recoger datos del formulario de login 
  router.post('/login', async (req, res)=> {
    res.render("bienvenida.html", {usuario})
  })
  
  router.get('/logout', (req, res) => {
  })