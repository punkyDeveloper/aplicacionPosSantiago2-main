'use strict';
const Adminstrador = require('../models/administradorMongo');
const Vendedor = require('../models/vendedorMongo');
const ProductosInventario = require('../models/productos');
const Usuario = require('../models/usuariosMongo');
const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// pefil admin

// pefil Admin
exports.perfilAdmin = async (req, res) => {
// claves secretas
  const claveAdmin = process.env.CLAVE_ADMIN;
  const adminRole = req.session.adminRole;
  const token = req.session.token;

  const datosAdmin = req.session.datosAdmin;
  console.log(req.session.adminRole);
  // token

  console.log(token);
  // datos del usuario o administrador

  // Verifica el token JWT para autenticar al usuario y administrador

  try {
    if (claveAdmin) {
      jwt.verify(token, claveAdmin);

      res.render('perfilAdmin', { administrador: datosAdmin, rol: adminRole });
    } else {
      // Manejar el caso cuando ninguna clave secreta está configurada
      res.status(500).send('Error interno del servidor perfil');
    }
  } catch (error) {
    // Si el token no es válido para claveSecreta o claveAdmin, llegará aquí
    // Puedes manejar el error o devolver un mensaje de acceso no autorizado
    res.status(401).send('admin Acceso no autorizado');
  }
};

// tablas

exports.tablaA = async (req, res) => {
  const producto = await Vendedor.find();
  res.render('vendedorTabla', {
    productos: producto
  });
};
// registrar vendedor

exports.registrarVendedor = (req, res) => {
  const vendedor1 = new Vendedor({
    _id: req.body.id,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    contraseña: req.body.contraseña,
    correo: req.body.correo

  });

  vendedor1.save();

  res.redirect('/admin/tablavendedor');
};
// crud vendedores
// editar vendedor
exports.editar = async (req, res) => {
  const id = req.params.id;
  await Vendedor.findByIdAndUpdate(
    id,
    {
      correo: req.body.cVendedor,
      nombre: req.body.nVendedor,
      apellido: req.body.aVendedor,
      contraseña: req.body.contraseña
    }
  );

  res.redirect('/admin/tablavendedor');
};

// eliminar venderdor

exports.borrar = async (req, res) => {
  await Vendedor.findByIdAndDelete(id = req.params.id);

  res.redirect('/admin/tablavendedor');
};
// ver usuarios

// ver tabla clinetes
exports.usuariosResgistrado = async (req, res) => {
  const datos = await Usuario.find();
  res.render('verUsuarios', {
    usuarios: datos
  });
};
// crud clinetes
exports.editarUsuario = async (req, res) => {
  const id = req.params.id;
  await Usuario.findByIdAndUpdate(
    id,
    {
      correo: req.body.coCliente,
      nombre: req.body.nCliente,
      apellido: req.body.aCliente,
      contraseña: req.body.contraseñaC,
      direccion: req.body.dCliente,
      ciudad: req.body.ciudadCliente
    });

  res.redirect('/admin/usuario');
};

exports.eliminarUsuario = async (req, res) => {
  await Usuario.findByIdAndDelete(id = req.params.id);

  res.redirect('/admin/usuario');
};

// producto
exports.verProductos = async (req, res) => {
  const pro = await ProductosInventario.find();
  res.render('productosn', {
    productos: pro
  });
};

// agregar productos
exports.registrarProducto = (req, res) => {
  const agrgarProductos = new ProductosInventario({

    referencia: req.body.referencia,
    nombre: req.body.nompreProcuto,
    descripcion: req.body.descripcion,
    stock: req.body.stock,
    precio: req.body.precio,
    // img:req.body,
    habilitado: req.body.activo

  });

  agrgarProductos.save();

  res.redirect('/admin/productos');
};
// crud productos

// editar productos
exports.actualizarProducto = async (req, res) => {
  const id = req.params.id;
  await ProductosInventario.findByIdAndUpdate(
    id,
    {
      referencia: req.body.rProductos,
      nombre: req.body.nProductos,
      descripcion: req.body.descripcionP,
      stock: req.body.sProductos,
      precio: req.body.precioP,
      habilitado: req.body.habilitadoP

    }
  );

  res.redirect('/admin/productos');
};
// eliminar productos
exports.eliminarPorducto = async (req, res) => {
  await ProductosInventario.findByIdAndDelete(id = req.params.id);

  res.redirect('/admin/productos');
};

// grafica productos la cantidad de stok que hay en cada producto
exports.graficaProductos = async (req, res) => {
  // map() crea una nueva matriz con los resultados de llamar a una función para cada elemento de la matriz

  const nombres = (await ProductosInventario.find({}, { nombre: 1, _id: 0 })).map(item => item.nombre);
  const stocks = (await ProductosInventario.find({}, { stock: 1, _id: 0 })).map(item => item.stock);

  // res.render('grafica');

  res.render('grafica', {
    nombres,
    stocks
  });
};

// registra admin
exports.registrarAdmin = (req, res) => {
  const adminstrador1 = new Adminstrador({
    _id: req.body.idAdmin,
    nombre: req.body.nombreAdmin,
    apellido: req.body.apellidoAdmin,
    contraseña: req.body.ContraceñaAdmin,
    correo: req.body.correoAdmin

  });

  adminstrador1.save();

  res.redirect('verAdmin');
};
// ver administradores
exports.verVendedores = async (req, res) => {
  const vende = await Adminstrador.find();
  res.render('registrarAdmin', {
    adminstrador: vende
  });
};
// eliminar admin
exports.eliminarAdmin = async (req, res) => {
  await Adminstrador.findByIdAndDelete(id = req.params.id);
  res.redirect('/admin/verAdmin');
};
// actualizar admin
exports.editarAdmin = async (req, res) => {
  const id = req.params.id;
  await Adminstrador.findByIdAndUpdate(
    id,
    {
      correo: req.body.cAdmin,
      nombre: req.body.nAdmin,
      apellido: req.body.aAdmin,
      contraseña: req.body.contraseñaA
    }
  );

  res.redirect('/admin/verAdmin');
};

// ventas

// descargar excel con los datos de los vendedores

exports.descargarExcel = async (req, res) => {
  // configuramos el excel4node

  // creamos un nuevo documento
  const wb = new xl.Workbook();
  // definimos el nombre con el cual se descargara el archivo
  const nombreArchivo = 'TablaProductos';
  // se define el nombre
  const ws = wb.addWorksheet(nombreArchivo);

  // definimos estilos
  const columnaEstilo = wb.createStyle({
    font: {
      name: 'Arial',
      color: '#000000',
      size: 12,
      bold: true
    }
  });

  const contenidoEstilo = wb.createStyle({
    font: {
      name: 'Arial',
      color: '#565656',
      size: 11
    }
  });

  // definimos el nombre de las columnas
  ws.cell(1, 1).string('correo').style(columnaEstilo);
  ws.cell(1, 2).string('nombre').style(columnaEstilo);
  ws.cell(1, 3).string('apellido').style(columnaEstilo);
  ws.cell(1, 4).string('contraseña').style(columnaEstilo);

  // llamamos a la base de datos
  const listaVendedor = await Vendedor.find();

  // definimos un contador que empiece en 2
  let fila = 2;

  // agregamos el contenido de la base de datos con un for o un forEach para llamar todos los datos

  listaVendedor.forEach(datoVendedor => {
    ws.cell(fila, 1).string(datoVendedor._id).style(contenidoEstilo);
    ws.cell(fila, 2).string(datoVendedor.nombre).style(contenidoEstilo);
    ws.cell(fila, 3).string(datoVendedor.apellido).style(contenidoEstilo);
    ws.cell(fila, 4).string(datoVendedor.contraseña).style(contenidoEstilo);

    fila = fila + 1;
  });

  const rutaExcel = path.join(__dirname, 'excel' + nombreArchivo + '.xlsx');

  // escribir y guardar en el documento
  // se le inclulle la ruta y una funcion
  wb.write(rutaExcel, function (err, stars) {
    // capturamos y mostramos en caso de un error
    if (err)console.log(err);
    // creamos una funcion que descargue el archibo y lo elimine
    else {
      // guardamos el documento en la carpeta para excel para poder descargarla en el pc
      res.download(rutaExcel);

      console.log('documento descargado correctamente');

      // Eliminamos el documento de la carpeta excel
      fs.rm(rutaExcel, function (err) {
        if (err)console.log(err);
        else console.log('Archivo descargado y borrado del servidor correctamente');
      });
    }
  });
};
