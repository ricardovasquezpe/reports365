module.exports = function(app, jwt){

  app.get('/app/documentos/boletas', function(req, res, next) {
    res.render('app/documents/boletas', { title: 'Express' });
  });

}