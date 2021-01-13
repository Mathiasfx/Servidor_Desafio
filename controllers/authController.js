const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  //revisar si hay error
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extrar email y password
  const { email, password } = req.body;

  try {
    //verificar usuario registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El Usuario no existe" });
    }
    //revisar password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }

    //si todo es correcto creando el token
    //firmar el token
    //crear y firmar JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
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
  } catch (error) {
    console.log(error);
  }
};
//optine el usuario que inicia session
exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
