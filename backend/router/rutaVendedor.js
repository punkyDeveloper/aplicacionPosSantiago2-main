const vendedores = require('../controller/vendedor');
const express = require('express');
const router = express.Router();

router.get('/', vendedores.perfilVendedor);

module.exports = router;
