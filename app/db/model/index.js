module.exports = function(app, jwt){
  var User = require('../entity/user.js');

  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/en', function(req, res, next) {
    res.render('indexen', { title: 'Express' });
  });

  app.get('/es', function(req, res, next) {
    res.render('indexes', { title: 'Express' });
  });

}