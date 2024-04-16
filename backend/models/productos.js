const { default: mongoose } = require('mongoose');
require('../config/conectionMongoose');

const SchemaProductos = new mongoose.Schema({

  referencia: {
    type: String
  },
  nombre: {
    type: String
  },
  descripcion: {
    type: String
  },
  stock: {
    type: String
  },
  precio: {
    type: Number
  },
  habilitado: {
    type: Boolean,
    default: 'no habilitado'
  }

});

const productos = mongoose.model('productos', SchemaProductos);
module.exports = productos;
