module.exports = function(app, jwt){

  app.get('/app/dashboard', function(req, res, next) {
    res.render('app/dashboard/dashboard', { title: 'Express' });
  });

}