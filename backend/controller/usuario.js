
const Usuario = require('../models/usuariosMongo');
const Administador = require('../models/administradorMongo');
const Catalogos = require('../models/productos');


const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// pagina principal
exports.inicio = async (req, res) => {
  try {
    // Asegúrate de definir 'token' antes de asignarlo a 'req.session.token'
    
    console.log(req.cookies);
    const rol = req.cookies.rol;

    if (rol === undefined) {
      // En la siguiente línea, 'NULL' debería ser 'null'
      res.render('index', { rol: null, token: null });
    } else {
      // Asegúrate de definir 'datosUsuario' antes de utilizarlo
      const datosUsuario = req.session.datosUsuario;
      res.render('index', { rol, usuario: datosUsuario });
    }
  } catch (error) {
    res.render('404');
    console.log(error);
  }
};
// pagina para inicar sesion
exports.ingresar = (req, res) => {
  res.render('ingresar');
};

// validar inicio de sesion

exports.validacionesn = async (req, res) => {
  // jwt para generar token
  const claveSecreta = process.env.CLAVE_SECRETA;
  const claveAdmin = process.env.CLAVE_ADMIN;
  // const claveVendedor = process.env.CLAVE_VENDEDOR;
  const id = req.body._id;
  const contraseña = req.body.contraseña;

  const usuarios = await Usuario.findOne({ _id: id });
  const administrador = await Administador.findOne({ _id: id });
  // const vendedores = await vendedorresB.findOne({ _id: id });
  try {
    if (!usuarios && !administrador) {
      return res.send('<script>alert("No está registrado"); window.location="/registrar";</script>');
    }

    let rolUsuario, contraseñaUsuario, datosUsuario, token, refreshToken, permisosUsuario;

    if (usuarios) {
      rolUsuario = usuarios.role;
      contraseñaUsuario = usuarios.contraseña;

      if (contraseñaUsuario !== contraseña) {
        return res.send('<script>alert("Contraseña incorrecta"); window.location="/ingresar";</script>');
      }
      permisosUsuario = ['/actualizar/:id', '/perfil/:id', '/micarro', '/producto'];
      datosUsuario = {
        id: usuarios._id,
        nombre: usuarios.nombre,
        apellido: usuarios.apellido,
        contraseña: usuarios.contraseña,
        correo: usuarios.correo,
        direccion: usuarios.direccion,
        ciudad: usuarios.ciudad,
        permisos: permisosUsuario
      };
      token = jwt.sign({ id: usuarios._id, role: rolUsuario, permisos: permisosUsuario }, claveSecreta, { expiresIn: process.env.JWT_EXPIRE });
      res.cookie('miToken', token, { httpOnly: true, maxAge: 100000, role: rolUsuario });
      res.cookie('rol', "rolCliente");
      // Cookie
      // nota:
      // cookie cuando esta en httpOnly: true, no se puede acceder desde el cliente
      // con el document.cookie, solo funcionen en el servidor y se envia al cliente
      // por seguridad de la informacion del usuario y administrador
      // refreshToken = jwt.sign({ id: usuarios._id, role: rolUsuario, permisos: permisosUsuario }, claveSecreta, { expiresIn: '1m' }); // Refresh Token
    }
    let rolAdmin, contraseñaAdmin, datosAdmin, token1, refreshToken1, permisosAdmin;

    if (administrador) {
      rolAdmin = administrador.role;
      contraseñaAdmin = administrador.contraseña;

      if (contraseñaAdmin !== contraseña) {
        return res.send('<script>alert("Contraseña incorrecta"); window.location="/ingresar";</script>');
      }
      // Ejemplo: aquí definimos los permisos para actualizar el perfil del usuario
      // const permisosAdmin=[ '/perfilA/:id','/tablavendedor','/agregar','/borrar/:id','/editar/:id','/usuario','/productos','/productos1','/actualizarProducto/:id','/eliminarPorducto/:id','/administrador','/verAdmin','/registrarAdmin','/editarAdmin/:id','/administrador/:id','/descargar','/grafico'];

      datosAdmin = {
        id: administrador._id,
        nombre: administrador.nombre,
        apellido: administrador.apellido,
        correo: administrador.correo,
        permisos: permisosAdmin // Agregar los permisos al objeto de datos del usuario

      };

      token1 = jwt.sign({ id: administrador._id, role: rolAdmin, permisos: permisosAdmin }, claveAdmin);
      res.cookie('admin', token, { httpOnly: true, maxAge: 100000, role: rolAdmin });
    }
    // cliente
    req.session.userRole = rolUsuario;
    req.session.token = token;
    req.session.refreshToken = refreshToken;
    req.session.datosUsuario = datosUsuario;
    req.session.id = id;
    // admin
    req.session.adminRole = rolAdmin;
    req.session.token = token1;
    req.session.refreshToken = refreshToken1;
    req.session.datosAdmin = datosAdmin;
    req.session.id = id;
    console.log('mi rol ' + req.session.userRole);
    if (token) {
      res.redirect(`/?token=${encodeURIComponent(token)}`);
      console.log(usuarios);
      console.log('verificacion ' + token);
    } else if (token1) {
      res.redirect(`/admin/perfilA/${id}`);
      console.log(administrador);
      console.log(token1);
    }
  } catch (error) {
    console.error(error);
  }
};

exports.perfil = async (req, res) => {
  // Claves secretas
  const claveSecreta = process.env.CLAVE_SECRETA;
  const userRole = req.session.userRole;
  const token = req.session.token;
  const datosUsuario = req.session.datosUsuario;

  console.log('mi rol 2 ' + req.session.userRole);
  // Datos del usuario o administrador
  // Verifica el token JWT para autenticar al usuario y administrador
  let decoded;
  res.render(userRole === 'rolCliente' ? 'index' : 'index', { usuario: datosUsuario, rol: userRole });
  try {
    if (claveSecreta) {
      decoded = jwt.verify(token, claveSecreta);

      // Verificar permisos para acceder a la ruta de actualización
      if (decoded.permisos.includes('/actualizar/:id')) {
        res.render('index', { usuario: datosUsuario });
      } else {
        res.status(403).send('No tienes permiso para acceder a esta página');
      }
    } else {
      // Manejar el caso cuando ninguna clave secreta está configurada
      res.status(500).send('Error interno del servidor perfil');
    }
  } catch (error) {
    // Si el token no es válido para claveSecreta, llegará aquí
    // Puedes manejar el error o devolver un mensaje de acceso no autorizado
    console.log(error)
  }
};

// eliminar usuario
exports.elimiminarU = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.redirect('/');
};

// actualiza usuario
exports.actualizarU = async (req, res) => {
  const id = req.params.id;

  // const token1=res.authorization==true;
  // console.log("mi update "+ token1)
  const token = req.cookies.miToken;

  const refreshToken = req.query.refreshToken;
  console.log('id ' + id);
  console.log('token ' + token);
  if (!token) {
    return res.status(401).send('update Acceso no autorizado update');
  }

  try {
    const claveSecreta = process.env.CLAVE_SECRETA;
    const decoded = jwt.verify(token, claveSecreta);
    const usuarioId = decoded.id;
    console.log('usuario ' + usuarioId);
    if (usuarioId === id) {
      return res.status(403).send('Permiso insuficiente para actualizar los datos');
    }

    await Usuario.findByIdAndUpdate(id, {
      nombre: req.body.nombreU,
      apellido: req.body.apellidoU,
      contraseña: req.body.contraseñaU,
      correo: req.body.correoU,
      direccion: req.body.direccionU,
      ciudad: req.body.ciudadU
    });

    const updatedToken = jwt.sign({ id: usuarioId, role: decoded.role, permisos: decoded.permisos }, claveSecreta);

    // Redirige al perfil con los parámetros de URL
    const redirectUrl = `/perfil/${id}?token=${encodeURIComponent(updatedToken)}&refreshToken=${encodeURIComponent(refreshToken)}&datos=${encodeURIComponent(JSON.stringify(decoded))}`;

    res.setHeader('refresh', `2;url=${redirectUrl}`); // Redirige en 2 segundos
    res.status(200).send('Actualización exitosa. Redirigiendo...');
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error en el servidor update' });
  }
};

// recuperar contraseña
exports.fromularioRecuperar = (req, res) => {
  res.render('recuperarContraseña');
};

exports.enviaCorreo = async (req, res) => {
  const correo1 = req.body.correoCon;

  const cliente = await Usuario.findOne({ correo: correo1 });

  if (!cliente) {
    return res.status(500).send('no conside');
  } else {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shernandez998@misena.edu.co',
        pass: 'zxxlaarsgxqfkqvu'
      }
    });

    const mailOptions = {
    // quien lo envia
      from: 'shernandez998@misena.edu.co',
      // quien lo recibe
      to: cliente.correo,
      subject: 'puedes cambiar tu contraseña',
      text: `cambia tu contraseña  http://localhost:6600/api/neuvaContrasena/${cliente.id} `
    };

    // Enviar el correo electrónico

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        res.send('Error al enviar el correo de recuperación.');
      } else {
        console.log('Correo de recuperación enviado: ' + info.response);
        res.send('Se ha enviado un correo de recuperación de contraseña. ' + cliente.correo);
      }
    });
  }
};

// envia el id y del cliente y hace una busqueda en la base de datos
exports.datosRecuperar = async (req, res) => {
  const _id = req.params.id; // id

  try {
    const n = await Usuario.findById(_id);

    res.render('nuevaContraseña', {
      usuarios: n
    });
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).send('Error al buscar el usuario');
  }
};
exports.nuevaContra = async (req, res) => {
  const id = req.params.id; // Utilizamos const o let para declarar 'id'

  try {
    const n = await Usuario.findByIdAndUpdate(
      id,
      {
        contraseña: req.body.contrasenaNa // Corregimos el nombre de la propiedad
      }
    );

    console.log('mi id ' + id);
    console.log('mi id ' + req.params);
    console.log(n);

    res.redirect('/');
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).send('Error al actualizar la contraseña');
  }
};

// // ver productos
// exports.productos = async (req, res) => {
//   try {
//     const rol = req.cookies;
//     const productos = await Catalogos.find();
//     console.log("hola "+req.cookies);
//     if (rol === undefined || rol === null) {
//       console.log("hola")
//       res.render('productos', { productos });
//     } else {
//       const datosUsuario = req.session.datosUsuario;
//       res.render('productos', { rol, usuario: datosUsuario, productos });
//     }
    
//   } catch (error) {
//     console.log('Error al ver los productos: ', error);
//   }
// };




// recuperar contraseña

// registrar cliente

exports.registrar1 = (req, res) => {
  try {
    const clientes = new Usuario({
      cedula: req.body.cedula,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      contraseña: req.body.contraseña,
      correo: req.body.correo,
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      terminos: req.body.terminos
    });

    clientes.save();
    console.log(clientes);
    res.redirect('/ingresar');
  } catch (errors) {
    console.log(errors);
  }
};

// enviar correo de contacto
exports.contacto = (req, res) => {
  const usuario = req.body.usuario;
  const correo = req.body.correo;
  const contenido = req.body.contenido;
  console.log();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shernandez998@misena.edu.co',
      pass: 'zxxlaarsgxqfkqvu'
    }
  });

  const mailOptions = {
  // quien lo envia
    from: correo,
    // quien lo recibe
    to: 'shernandez998@misena.edu.co',
    subject: usuario,
    text: contenido
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// ver productos de usuario
exports.productos = async (req, res) => {
  try{
    console.log(req.cookies);
    const rol = req.cookies.rol;
    if (rol === undefined) {
      
      const page = parseInt(req.query.page) || 1; // Página actual, si no se proporciona, será la página 1
      const perPage = 15; // Productos por página

      const totalProducts = await Catalogos.countDocuments();// Total de productos en la base de datos
      const totalPages = Math.ceil(totalProducts / perPage); // Total de páginas que habrá en la paginación

      const skip = (page - 1) * perPage; // Número de productos que se saltará para mostrar la siguiente página
      const productos = await Catalogos.find().skip(skip).limit(perPage); // Productos de la página actual

      res.render('productos', {
        productos,
        currentPage: page,
        totalPages,
        rol: null
      });
    } else {
      const page = parseInt(req.query.page) || 1; // Página actual, si no se proporciona, será la página 1
      const perPage = 15; // Productos por página

      const totalProducts = await Catalogos.countDocuments();// Total de productos en la base de datos
      const totalPages = Math.ceil(totalProducts / perPage); // Total de páginas que habrá en la paginación

      const skip = (page - 1) * perPage; // Número de productos que se saltará para mostrar la siguiente página
      const productos = await Catalogos.find().skip(skip).limit(perPage); // Productos de la página actual

      res.render('productos', {
        productos,
        currentPage: page,
        totalPages,
        rol
      });
    }
} catch(error){
  res.render('404');
  console.log(error)

}
};

// carro de compras

exports.carro = async (req, res) => {
  const productos1 = await Catalogos.find();
  res.render('carroDeCompras', {
    carro: productos1
  });
  res.render('carroDeCompras');
};

exports.error = (req, res) => {
  res.render('404');
};
