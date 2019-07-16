var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boletaSchema = new Schema({
  serie             : { type: String, required: true },
  correlativo       : { type: String, required: true },
  tipoMoneda        : { type: String, required: true },
  mtoOperGravadas   : { type: Number, required: true },
  mtoOperExoneradas : { type: Number, required: true },
  mtoOperInafectas  : { type: Number, required: true },
  mtoIgv            : { type: Number, required: true },
  mtoImpVenta       : { type: Number, required: true },
  cliente           : [Schema.Types.Mixed],
  company           : [Schema.Types.Mixed],
  created_at        : { type: Date, default: Date.now },
  updated_at        : { type: Date, default: Date.now }
});

var Boleta = mongoose.model('Boleta', boletaSchema);
module.exports = Boleta;