var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name		   : { type: String, required: true },
  lastname	 : { type: String, required: true },
  username	 : { type: String, required: true, unique: true },
  password	 : String,
  email		   : { type: String, required: true, unique: true },
  type		   : String,
  birthdate	 : Date,
  company_id : { type: String, required: true},
  created_at : { type: Date, default: Date.now },
  updated_at : { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);
module.exports = User;