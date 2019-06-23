module.exports = function(app, jwt){
  var User = require('../entity/user.js');

  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

}