module.exports = function(app, jwt){

  app.get('/app/admin/productos', function(req, res, next) {
    res.render('app/administration/productos', { title: 'Express' });
  });

}