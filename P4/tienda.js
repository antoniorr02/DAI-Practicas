import express   from "express"
import nunjucks  from "nunjucks"
import session from "express-session"
import connectDB from "./model/db.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import logger from "./logger.js"


connectDB()

const app = express()

app.use(express.json()); // Middleware para decodificar JSON

// Configuración de las sesiones
app.use(session({
	secret: 'my-secret',      // a secret string used to sign the session ID cookie
	resave: false,            // don't save session if unmodified
	saveUninitialized: false  // don't create session until something stored
}))

app.use(cookieParser())

// middleware
const autentificación = (req, res, next) => {
	const token = req.cookies.access_token;
	if (token) {
		const data = jwt.verify(token, process.env.SECRET_KEY);
		req.username = data.usuario  // username en el request
		req.admin = data.admin
	}
	next()
}
app.use(autentificación)

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


app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url} - ${new Date().toISOString()}`);
	next();
});

// Las demas rutas con código en el directorio routes
import TiendaRouter from "./routes/routes_tienda.js"
import rutasUsuarios from './routes/usuarios.js'
import ratingsRouter from "./routes/routes_ratings.js";
app.use("/", TiendaRouter);
app.use("/usuarios", rutasUsuarios);
app.use("/api/ratings", ratingsRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})
