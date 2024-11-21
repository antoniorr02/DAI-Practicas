import mongoose from "mongoose";

const ProductosSchema = new mongoose.Schema({
  id: {
    "type": "Number",
    "unique": true,
  },
  "title": {
    "type": "String",
    "unique": true,
  },
  "price": {
    "type": "Number",
    "required": true
  },
  "description": {
    "type": "String",
    "required": true
  },
  "category": {
    "type": "String",
    "required": true
  },
  "image": {
    "type": "String",
    "required": true
  },
  "rating": {
      "rate": {
        "type": "Number",
        "required": true
      },
      "count": {
        "type": "Number",
        "required": true
      }
    }
});

const Productos = mongoose.model("productos", ProductosSchema);
export default Productos;