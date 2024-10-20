import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏁 seed.js ----------------->');

// del archivo .env
const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';

// función asíncrona
async function Inserta_datos_en_colección(colección, url) {
    await client.connect();  // Asegura la conexión

    try {
        const datos = await fetch(url).then(res => res.json());
        const database = client.db(dbName);
        const collect = database.collection(colección);
        await collect.deleteMany({});  // Elimina todos los documentos
        const options = { ordered: true };
        const result = await collect.insertMany(datos, options); // TO DO: Encriptar las contraseñas al insertar.
        console.log(`${result.insertedCount} documents were inserted`);

        return `${datos.length} datos traidos para ${colección}`;
    } catch (err) {
        console.error(`Error en fetch de ${colección}:`, err.message);
        throw new Error(`Error en fetch de ${colección}: ${err.message}`);
    }
}

async function Consultas() {
    try {
        const database = client.db(dbName);
        const productos = database.collection("productos");
        const usuarios = database.collection("usuarios");

        // 1. Productos de más de 100 $
        const productosMasDe100 = await productos.find({ price: { $gt: 100 } }).toArray();
        console.log('Productos de más de 100 $:', productosMasDe100);

        // 2. Productos que contengan 'winter' en la descripción, ordenados por precio
        const productosWinter = await productos.find({ description: /winter/i }).sort({ price: 1 }).toArray();
        console.log('Productos con "winter" en la descripción, ordenados por precio:', productosWinter);

        // 3. Productos de joyería ordenados por rating
        const joyeriaOrdenadaPorRating = await productos.find({ category: "jewelery" }).sort({ "rating.rate": -1 }).toArray();
        console.log('Productos de joyería ordenados por rating:', joyeriaOrdenadaPorRating);

        // 4. Reseñas totales (count en rating)
        const totalReseñas = await productos.aggregate([
            { $group: { _id: null, totalReseñas: { $sum: "$rating.count" } } }
        ]).toArray();
        console.log('Total de reseñas:', totalReseñas[0]?.totalReseñas || 0);

        // 5. Puntuación media por categoría de producto
        const puntuacionMediaPorCategoria = await productos.aggregate([
            { $group: { _id: "$category", promedio: { $avg: "$rating.rate" } } }
        ]).toArray();
        console.log('Puntuación media por categoría:', puntuacionMediaPorCategoria);

        // 6. Usuarios sin dígitos en el password
        const usuariosSinDigitos = await usuarios.find({ password: { $not: /\d/ } }).toArray();
        console.log('Usuarios sin dígitos en el password:', usuariosSinDigitos);

    } catch (err) {
        console.error('Error en las consultas:', err.message);
        throw err;
    }
}

async function DescargarImagenes() {
    await client.connect();
    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }
    try {
        const datos = await fetch('https://fakestoreapi.com/products').then(res => res.json());
        await Promise.all(datos.map(async (producto) => {
            const imageUrl = producto.image; // Ensure this is the correct property
            const imageResponse = await fetch(imageUrl);
            const arrayBuffer = await imageResponse.arrayBuffer(); // Use arrayBuffer instead of buffer
            const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
            const imageName = path.basename(imageUrl); // Extract image name from URL
            fs.writeFileSync(path.join(imagesDir, imageName), buffer); // Save image in folder
        }));
    } catch (err) {
        console.error('Error en la descarga de imágenes:', err.message);
        throw err;
    }

}

// Inserción consecutiva
Inserta_datos_en_colección('productos', 'https://fakestoreapi.com/products')
    .then((r) => console.log(`Todo bien: ${r}`))  // OK
    .then(() => Inserta_datos_en_colección('usuarios', 'https://fakestoreapi.com/users'))
    .then((r) => console.log(`Todo bien: ${r}`))  // OK
    .then(() => Consultas())
    .then(() => DescargarImagenes())
    .catch((err) => console.error('Algo mal: ', err.message));
