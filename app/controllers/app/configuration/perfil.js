module.exports = function(app, jwt){

  app.get('/app/config/perfil', function(req, res, next) {
    res.render('app/configuration/perfil', { title: 'Express' });
  });

}