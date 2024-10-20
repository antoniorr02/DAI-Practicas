import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Usamos 'distinct' para obtener las categorías únicas de los productos
    const categorias = await Productos.distinct('category');
    // Renderizamos la vista 'home.html' pasando las categorías como contexto
    res.render('home.html', { categorias, usuario: req.username });
  } catch (err) {                                
    res.status(500).send({ err });
  }
});

// Ruta para manejar la búsqueda
router.get('/buscar', async (req, res) => {
  try {
    const query = req.query.query; // Obtiene el término de búsqueda
    // Buscar productos que coincidan con el título o la descripción
    const productos = await Productos.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  // Búsqueda en el título (insensible a mayúsculas)
        { description: { $regex: query, $options: 'i' } }  // Búsqueda en la descripción
      ]
    });
    
    // Obtener categorías únicas
    const categorias = await Productos.distinct('category');
    
    // Renderizar resultados de búsqueda
    res.render('resultado_busqueda.html', { productos, query, categorias, usuario: req.username }); // Renderiza la vista con los resultados
  } catch (err) {
    res.status(500).send({ err }); // Manejo de errores
  }
});


router.get('/categoria/:categoria', async (req, res) => {
  try {
    const categoria = req.params.categoria; // Obtiene el parámetro de la URL
    const productos = await Productos.find({ category: categoria }); // Filtra los productos por categoría
    // Usamos 'distinct' para obtener las categorías únicas de los productos
    const categorias = await Productos.distinct('category');
    res.render('categoria.html', { productos, categorias, usuario: req.username }); // Renderiza la vista 'categoria.html' con los productos
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

      // Usamos 'distinct' para obtener las categorías únicas de los productos
      const categorias = await Productos.distinct('category');

      res.render('detalles.html', { producto, categorias, usuario: req.username }); // Renderiza la vista 'producto.html' con el producto encontrado
  } catch (err) {
      res.status(500).send({ err }); // Manejo de errores
  }
});

// Ruta para agregar productos al carrito
router.post('/carrito/agregar', async (req, res) => {
  try {
    const productoId = req.body.producto_id;   // Obtenemos el ID del producto del formulario
    const producto = await Productos.findById(productoId);   // Buscamos el producto en la base de datos

    if (!req.session.cart) {
      req.session.cart = [];  // Si no existe carrito, lo creamos
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = req.session.cart.find(item => item.id === producto.id);

    if (productoExistente) {
      // Si ya está en el carrito, incrementamos la cantidad
      productoExistente.quantity += 1;
    } else {
      // Si no está en el carrito, lo agregamos con cantidad 1
      req.session.cart.push({ ...producto.toObject(), quantity: 1 });
    }

    //req.session.cart.push(producto);  // Agregamos el producto al carrito

    // const productos = req.session.cart;  // Agregamos el producto al carrito
    // const categorias = await Productos.distinct('category');
    res.redirect('/carrito'); // Pasamos el carrito a la vista
  } catch (err) {
    res.status(500).send({ err });  // Manejo de errores
  }
});

// Ruta para quitar productos al carrito
router.post('/carrito/reducir', async (req, res) => {
  try {
    const productoId = req.body.producto_id;   // Obtenemos el ID del producto del formulario
    const producto = await Productos.findById(productoId);   // Buscamos el producto en la base de datos

    if (!req.session.cart) {
      req.session.cart = [];  // Si no existe carrito, lo creamos
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = req.session.cart.find(item => item.id === producto.id);

    if (productoExistente) {
      // Si ya está en el carrito, reducimos la cantidad
      productoExistente.quantity -= 1;

      // Si la cantidad llega a 0, eliminamos el producto del carrito
      if (productoExistente.quantity <= 0) {
        req.session.cart = req.session.cart.filter(item => item.id !== productoExistente.id);
      }
    }

    res.redirect('/carrito'); // Pasamos el carrito a la vista
  } catch (err) {
    res.status(500).send({ err });  // Manejo de errores
  }
});


// Ruta para mostrar el carrito
router.get('/carrito', async (req, res) => {
  const productos = req.session.cart;  // Agregamos el producto al carrito
  const categorias = await Productos.distinct('category');
  res.render('carrito.html', { productos, categorias, usuario: req.username }); // Pasamos el carrito a la vista
});

export default router