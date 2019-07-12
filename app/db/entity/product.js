var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  code         : { type: String, required: true, unique: true },
  name         : { type: String, required: true },
  category     : { type: String, required: true },
  price        : { type: Number, required: true },
  quantity : { type: Number, required: true },
  created_at : { type: Date, default: Date.now },
  updated_at : { type: Date, default: Date.now }
});

var Product = mongoose.model('Product', productSchema);
module.exports = Product;