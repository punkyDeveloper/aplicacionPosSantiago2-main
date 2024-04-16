const vendedor = require('../models/vendedorMongo');
const jwt = require('jsonwebtoken');
const vendedroMongo = require('../models/vendedorMongo');

exports.perfilVendedor = async (req, res) => {
  // claves secretas

  const claveVendedor = process.env.CLAVE_VENDEDOR;
  // token
  const token = req.query.token;
  console.log(token);
  // datos del usuario o administrador

  const datosVendedor = JSON.parse(req.query.datos || '{}');
  // Verifica el token JWT para autenticar al usuario y administrador
  let decoded;
  try {
    if (claveVendedor) {
      decoded = jwt.verify(token, claveVendedor);
      res.render('perfilVendedor', { administrador: datosVendedor });
    } else {
      // Manejar el caso cuando ninguna clave secreta está configurada
      res.status(500).send('Error interno del servidor perfil');
    }
  } catch (error) {
    // Si el token no es válido para claveSecreta o claveAdmin, llegará aquí
    // Puedes manejar el error o devolver un mensaje de acceso no autorizado
    res.status(401).send('admin Acceso no autorizado');
  }
};
// hacer un fromulario par el registrar sus ventas
