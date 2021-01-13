//rutas para crear usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

//crea un usuario

//api/usuarios
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo de 6 Caracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.crearUsuario
);

router.put(
  "/:id",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo de 6 Caracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.ActualizaUsuario
);
router.get("/listar", auth, usuarioController.ListarUsuarios);

//Eliminar
router.delete("/:id", auth, usuarioController.eliminarUsuario);

module.exports = router;
