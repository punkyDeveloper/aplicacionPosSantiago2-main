const vistas = require('../controller/use-cases/vistas');
const express = require('express');
const router = express.Router();

router('/registrar',vistas.registrar)

module.exports = router;
