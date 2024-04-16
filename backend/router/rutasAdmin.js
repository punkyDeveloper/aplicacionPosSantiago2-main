const administrador = require('../controller/administrador');
const express = require('express');
const router = express.Router();

router.get('/perfilA/:id', administrador.perfilAdmin);// perfil admin
// crud vendedor
router.get('/tablavendedor', administrador.tablaA);// table vendedor
router.post('/agregar', administrador.registrarVendedor);// agregar vendedor
router.post('/borrar/:id', administrador.borrar);// borrar vendedor
router.post('/editar/:id', administrador.editar);// editar vendedor
// usuario
router.get('/usuario', administrador.usuariosResgistrado); // ver la tabla de los usuarios
router.post('/editarUsuario/:id', administrador.editarUsuario);// eliminar usuario
router.post('/eliminarUsuario/:id', administrador.eliminarUsuario);// eliminar usuario
// productos
router.get('/productos', administrador.verProductos);// ver productos
router.post('/productos1', administrador.registrarProducto);// registrar productos
router.post('/actualizarProducto/:id', administrador.actualizarProducto);// actualizar productaro
router.post('/eliminarPorducto/:id', administrador.eliminarPorducto);// eliminar productaro
// crud admin
router.get('/administrador', administrador.perfilAdmin);// admin
router.get('/verAdmin', administrador.verVendedores);// ver administradores
router.post('/registrarAdmin', administrador.registrarAdmin);// registrar admin
router.post('/editarAdmin/:id', administrador.editarAdmin);// editar admin
router.post('/administrador/:id', administrador.eliminarAdmin);// eliminar admin

// descargar excel
router.get('/descargar', administrador.descargarExcel); // descargar el excel con los datos de la tabla
// graficas
router.get('/grafico', administrador.graficaProductos);// graficas

module.exports = router;
