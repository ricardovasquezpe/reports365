var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name         : { type: String, required: true },
  created_at : { type: Date, default: Date.now },
  updated_at : { type: Date, default: Date.now }
});

var Category = mongoose.model('Category', categorySchema);
module.exports = Category;