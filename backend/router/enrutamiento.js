const crudUsuario = require('../controller/usuario');
const express = require('express');
const router = express.Router();

// pagina principal
router.get('/', crudUsuario.inicio);
// perfil
router.get('/perfil', crudUsuario.perfil);// perfil unico del usuario
// ingresar
router.get('/ingresar', crudUsuario.ingresar);// fromulario de inici de secion del usuario
router.post('/validar', crudUsuario.validacionesn);// validar y genera un token
// actualizar cliente
router.post('/actualizar/:id', crudUsuario.actualizarU);// fromulario de actualizacion de usuario
// recuperar contraseña
router.get('/recuperar', crudUsuario.fromularioRecuperar);// recupera contraseña del cliente fromulario
// olvide contraseña
router.post('/olvideContrasena', crudUsuario.enviaCorreo);// encia el correo de recuperacion cliente
router.get('/neuvaContrasena/:id', crudUsuario.datosRecuperar);// busca el id del cliente
router.post('/actualizarContra/:id', crudUsuario.nuevaContra);// actualiza la contraseña del cliente
// cerrar sesion
// agregaClientes
// router.get('/registrar', crudUsuario.registrar);// fromulario de registro de usuario
router.post('/registrar1', crudUsuario.registrar1);// registro de usuario
// ver productos
router.get('/producto', crudUsuario.productos);// ver productos
// carro
router.get('/micarro', crudUsuario.carro);// ver carro
// router.post('/carro', crudUsuario.finalizarCompra);// guardar carro
// fromulario de contacto
router.post('/contacto', crudUsuario.contacto);// contacto
// error
router.get('/error', crudUsuario.error);

module.exports = router;
