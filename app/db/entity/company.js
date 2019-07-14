var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  name       : { type: String, required: true },
  ruc        : { type: Number, required: true },
  address    : { type: String, required: true },
  telephone  : { type: String, required: true },
  created_at : { type: Date, default: Date.now },
  updated_at : { type: Date, default: Date.now }
});

var Company = mongoose.model('Company', companySchema);
module.exports = Company;