module.exports = function(app, jwt){

  app.get('/app/config/empresa', function(req, res, next) {
    res.render('app/configuration/empresa', { title: 'Express' });
  });

}