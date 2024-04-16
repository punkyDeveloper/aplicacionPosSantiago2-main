const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
// dotenv para las variables de entorno
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
dotenv.config();

// PUERTO
const PORT = process.env.PORT;

// ruta
const router = require('./backend/router/*');


// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views'));

app.use(morgan('dev'));
app.use(express.json());
// es como que esta bien la peticion y hace no se envie basio lo de la base de datos
app.use(express.urlencoded({ extended: false }));
// cookies
// app.use(cookieParser());
// archivos estaticos
app.use('/static', express.static('static'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
// cookie
app.use(cookieParser())
// rutas
app.use('/', router);


// puesto
app.listen(PORT, () => {
  console.log('estoy en linea desde el puerto: ' + PORT);
});
