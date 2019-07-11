module.exports = function(app, jwt){

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