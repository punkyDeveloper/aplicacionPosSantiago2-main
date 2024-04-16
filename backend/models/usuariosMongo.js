const { default: mongoose } = require('mongoose');
require('../config/conectionMongoose');

const SchemaUsuario = new mongoose.Schema({
  // id se elimina
  // di
  cedula: {
    type: Number
    // required:true,
    // unique:true
  },

  nombre: {
    default: 'sin nombre',
    type: String
    // required:true,

  },
  apellido: {
    type: String
    // default:"nn",
    // required:true,

  },

  contraseña: {
    default: 'nn',
    type: String
    // required:false,
  },
  correo: {
    default: 'nn',
    type: String,
    required: true,
    unique: true
  },
  direccion: {
    default: 'nn',
    type: String
  },
  ciudad: {
    default: 'nn',
    type: String
  },
  terminos: {
    type: Boolean
    // required:true,
  },
  role: {
    default: 'rolCliente',
    type: String
  }

});

const clientes = mongoose.model('clientes', SchemaUsuario);

module.exports = clientes;
