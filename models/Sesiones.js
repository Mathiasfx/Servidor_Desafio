const mongoose = require("mongoose");

const SesionesSchema = mongoose.Schema({
  data: [Number],
});

module.exports = mongoose.model("Sesiones", SesionesSchema);
