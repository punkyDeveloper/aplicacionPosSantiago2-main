const { default: mongoose } = require('mongoose');
require('../config/conectionMongoose');

const SchemaAdministrador = new mongoose.Schema({
  _id: {
    type: Number

  },

  nombre: {

    type: String
    // required:true,

  },
  apellido: {
    type: String

    // required:true,

  },

  contraseña: {

    type: String
    // required:false,
  },
  correo: {

    type: String
    // required:true,

  },
  role: {
    default: 'rolAdmin',
    type: String
  }

});

const administrador = mongoose.model('administrador', SchemaAdministrador);

module.exports = administrador;
