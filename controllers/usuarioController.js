const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //revisar si hay error
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer email y password
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //crea el nuevo usuario
    usuario = new Usuario(req.body);

    //hashear usuario
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar
    await usuario.save();
    //crear y firmar JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //firmar el token
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 2500,
      },
      (error, token) => {
        if (error) throw error;
        //mensaje de confirmacion
        res.json({ token });
      }
    );
    //mensaje de confirmacion
    //res.json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error");
  }
};

//Obtiene la lista de Usuarios en JSON
exports.ListarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({ usuarios });
  } catch (error) {
    console.log(error);
    req.status(500).send("Hubo un Error");
  }
};

//Actualiza un usuario
exports.ActualizaUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, password } = req.body;

  const nuevoUsuario = {};
  if (nombre || email || password) {
    const salto = await bcryptjs.genSalt(10);
    nuevoUsuario.nombre = nombre;
    nuevoUsuario.email = email;
    nuevoUsuario.password = await bcryptjs.hash(password, salto);
  }
  try {
    //revisar id
    let usuario = await Usuario.findById(req.params.id);
    //actualizar
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario No encontrado" });
    }
    //hashear usuario

    usuario = await Usuario.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoUsuario },
      { new: true }
    );
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el Servidor");
  }
};
//Elimina un usuario

exports.eliminarUsuario = async (req, res) => {
  try {
    //revisar el id
    let usuario = await Usuario.findById(req.params.id);

    //si existe
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await Usuario.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Usuario Eliminado Correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el Servidor");
  }

  //ver
};
