const express = require("express");
const router = express.Router();
const sesionesController = require("../controllers/sesionesController");

//Obtiene Valores
router.get("/", sesionesController.ListarDatos);

module.exports = router;
