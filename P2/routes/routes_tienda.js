import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();
      
router.get('/', async (req, res) => {
  try {
    // Usamos 'distinct' para obtener las categorías únicas de los productos
    const categorias = await Productos.distinct('category');
    
    // Renderizamos la vista 'home.html' pasando las categorías como contexto
    res.render('home.html', { categorias });
  } catch (err) {                                
    res.status(500).send({ err });
  }
});

// Ruta para manejar la búsqueda
router.get('/buscar', async (req, res) => {
  try {
    const query = req.query.query; // Obtiene el término de búsqueda
    const productos = await Productos.find({ title: { $regex: query, $options: 'i' } }); // Filtra por título

    res.render('resultado_busqueda.html', { productos, query }); // Renderiza la vista con los resultados
  } catch (err) {
    res.status(500).send({ err }); // Manejo de errores
  }
});


router.get('/categoria/:categoria', async (req, res) => {
  try {
    const categoria = req.params.categoria; // Obtiene el parámetro de la URL
    const productos = await Productos.find({ category: categoria }); // Filtra los productos por categoría
    res.render('categoria.html', { productos }); // Renderiza la vista 'categoria.html' con los productos
  } catch (err) {
    res.status(500).send({ err }); // Manejo de errores
  }
});

router.get('/detalles/:id', async (req, res) => {
  try {
      const id = req.params.id; // Obtiene el ID del producto de la URL
      const producto = await Productos.findById(id); // Encuentra el producto por su ID

      if (!producto) {
          return res.status(404).send({ error: 'Producto no encontrado' });
      }

      res.render('detalles.html', { producto }); // Renderiza la vista 'producto.html' con el producto encontrado
  } catch (err) {
      res.status(500).send({ err }); // Manejo de errores
  }
});

export default router