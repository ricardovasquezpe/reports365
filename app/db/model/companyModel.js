module.exports = function(app, jwt){
  var Company = require('../entity/company.js');

  app.post('/api/updateCompany', function(req, res){
    req.check('name', 'Invalid name').notEmpty();
    req.check('ruc', 'Invalid ruc').notEmpty();
    //req.check('category', 'Invalid category').notEmpty();
    req.check('address', 'Invalid address').notEmpty();
    req.check('telephone', 'Invalid telephone').notEmpty();
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    Company.findOneAndUpdate({_id: req.decoded._doc.company_id}
      , {$set: req.body}
      , function (err, doc) {
          if (err) {
              res.json(
                {"status" : false,
                 "data"   : "Company not found"}
              );
          } else {
              res.json(
                {"status" : true,
                 "data"   : "Company updated"}
              );
          }
          return;
      });

  });

}