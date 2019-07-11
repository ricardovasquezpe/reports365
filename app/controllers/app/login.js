module.exports = function(app, jwt){

  app.get('/app/login', function(req, res, next) {
    res.render('app/login', { title: 'Express' });
  });

}