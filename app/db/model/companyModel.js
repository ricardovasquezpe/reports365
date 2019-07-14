module.exports = function(app, jwt){
  var Company = require('../entity/company.js');
  var mongoose = require('mongoose');

  app.post('/api/createcompany', function(req, res){
    req.check('name', 'Invalid name').notEmpty();
    req.check('ruc', 'Invalid ruc').notEmpty();
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

    var newCompany = Company(req.body);
    newCompany.save(function(err) {
      if (err){
        if(err.code == 11000){
            res.json(
              {"status" : false,
               "data"   : "Company already created"}
            );
        }else{
          res.json(
              {"status" : false,
               "data"   : "Weird error"}
            );
        }
        return;
      }

      res.json(
        {"status" : true,
         "data"   : 'Company created!'}
      );
      return;

    });

  });

  app.put('/api/updatemycompany', function(req, res){
    req.check('name', 'Invalid name').notEmpty();
    req.check('ruc', 'Invalid ruc').notEmpty();
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

    Company.findByIdAndUpdate(
        req.decoded._doc.company_id,
        req.body,
        {new: true},
        (err, company) => {
          if (!company){
                res.json(
                  {"status" : false,
                   "data"   : "Company not found"}
                );
              return;
            }

            res.json(
              {"status" : true,
               "data"   : "Company updated"}
            );
          return;
        }
    )
  });

  app.get('/api/mycompanydetails', function(req, res){
    console.log(req.decoded._doc);
    Company.find().exec(function(err, company) { 

        if (!company){
            res.json(
              {"status" : false,
               "data"   : "Company not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : company}
        );
      return;
     });
  });

}