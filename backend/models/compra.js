const { default: mongoose } = require('mongoose');
require('../config/conectionMongoose');

const SchemaProductos = new mongoose.Schema({

  productos: {

    type: String
  }

});

const compras = mongoose.model('compras', SchemaProductos);

module.exports = compras;
