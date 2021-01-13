const Sesiones = require("../models/Sesiones");
//Obtiene la lista de Usuarios en JSON
exports.ListarDatos = async (req, res) => {
  try {
    const sesiones = await Sesiones.find();
    res.json({ sesiones });
  } catch (error) {
    console.log(error);
    req.status(500).send("Hubo un Error");
  }
};
