const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//crear servidor
const app = express();
//Conectar a la Base de datos
conectarDB();
//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({ extended: true }));

// puerto app
const PORT = process.env.PORT || 4000;
//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sesiones", require("./routes/sesiones"));

//arrancar serv
app.listen(PORT, () => {
  console.log(`el servidor esta funcionando en el puerto ${PORT}`);
});
