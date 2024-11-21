import express from "express";
import Productos from "../model/productos.js";

const router = express.Router();

// GET /api/ratings - Obtener todos los ratings
router.get('/', async (req, res) => {
  try {
    const desde = parseInt(req.query.desde) || 0;
    const hasta = parseInt(req.query.hasta) || 5;

    // Obtener solo los ratings de los productos
    const ratings = await Productos.find({}, { rating: 1, title: 1 })
                                   .skip(desde)
                                   .limit(hasta - desde);

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ratings" });
  }
});

// GET /api/ratings/:id - Obtener rating de un producto específico
router.get('/:id', async (req, res) => {
  try {
    const producto = await Productos.findById(req.params.id, { rating: 1, title: 1 });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener rating del producto" });
  }
});

// PUT /api/ratings/:id - Modificar rating de un producto específico
router.put('/:id', async (req, res) => {
  try {
    const { rate, count } = req.body;

    // Validación simple
    if (rate < 0 || rate > 5 || count < 0) {
      return res.status(400).json({ error: "Rating o count inválidos" });
    }

    const producto = await Productos.findByIdAndUpdate(
      req.params.id,
      { "rating.rate": rate, "rating.count": count },
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: "Error al modificar rating del producto" });
  }
});

export default router;
