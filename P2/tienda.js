import express   from "express"
import nunjucks  from "nunjucks"
import session from "express-session"
import connectDB from "./model/db.js"

connectDB()

const app = express()

// Configuración de las sesiones
app.use(session({
	secret: 'my-secret',      // a secret string used to sign the session ID cookie
	resave: false,            // don't save session if unmodified
	saveUninitialized: false  // don't create session until something stored
}))

// Habilitar express.urlencoded para procesar datos de formularios URL encoded
app.use(express.urlencoded({ extended: true }));

const IN = process.env.IN || 'development'

nunjucks.configure('views', {         // directorio 'views' para las plantillas html
	autoescape: true,
	noCache:    IN == 'development',   // true para desarrollo, sin cache
	watch:      IN == 'development',   // reinicio con Ctrl-S
	express: app
})
app.set('view engine', 'html')

app.use(express.static('public'))     // directorio public para archivos



// Las demas rutas con código en el directorio routes
import TiendaRouter from "./routes/routes_tienda.js"
app.use("/", TiendaRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})