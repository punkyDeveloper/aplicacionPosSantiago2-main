const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DATOS_USER}:${process.env.DATOS_CONTRA}@adsiprueva.treym02.mongodb.net/${process.env.DATOS_DATA}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true });
