const { default: mongoose } = require('mongoose');
require('../config/conectionMongoose');

const SchemaVendedor = new mongoose.Schema({
  _id: {
    type: Number
    // required:true,
  },
  correo: {
    default: 'sin nombre',
    type: String
    // required:true,

  },
  nombre: {
    default: 'sin nombre',
    type: String
    // required:true,

  },
  apellido: {
    type: String,
    default: 'nn'
    // required:true,

  },

  contraseña: {
    default: 'nn',
    type: String
    // required:false,
  },
  role: {
    default: 'rolVendedor',
    type: String
  }

});

const vendedor = mongoose.model('vendedor', SchemaVendedor);

module.exports = vendedor;
