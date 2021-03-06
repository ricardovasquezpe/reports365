module.exports = function(app, jwt){
  var User = require('../entity/user.js');

  app.post('/api/authenticate', function(req, res){
    req.check('username', 'Invalid username').notEmpty();
    req.check('password', 'Invalid password').notEmpty();
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    User.findOne({ 'username' : req.body.username, 'password': req.body.password}, { '_id': 1, 'company_id': 1}, function(err, user) {
      if(!user){
        res.json(
          {"status" : false,
           "data"   : 'User not found'}
        );
        return;
      }

      var token = jwt.sign(user, app.get('superSecret')/*, {
        expiresIn : '24h'
      }*/);
      res.json(
        {"status" : true,
         "data"   : user,
         "token"  : token}
      );
      return;
    });

  });

  app.post('/api/register', function(req, res){
    req.check('name', 'Invalid name').notEmpty();
    req.check('lastname', 'Invalid last name').notEmpty();
    req.check('email', 'Invalid email').notEmpty();
    req.check('email', 'Invalid email format email').isEmail();
    //req.check('username', 'Invalid username').notEmpty();
    req.check('password', 'Invalid password').notEmpty();
    req.check('password', 'Invalid length for password').len(6, 20);
    /*req.check('confirmpassword', 'Invalid confirm password').notEmpty();
    req.check('confirmpassword', 'Confirm password should be equals').equals(req.body.password)
    req.check('birthdate', 'Invalid birthdate').notEmpty();
    req.check('birthdate', 'Invalid dateformat birthdate').isDate();*/

    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }
    var rand = Math.floor(Math.random() * 1000)
    req.body.username = req.body.name + "." + req.body.lastname + "" + rand;
    var newUser = User(req.body);
    newUser.save(function(err) {
      if (err){
        if(err.code == 11000){
            res.json(
              {"status" : false,
               "data"   : "user already created"}
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
         "data"   : 'User created!'}
      );
      return;

    });
  });

  app.post('/api/resetpassword', function(req, res){
    req.check('email', 'Invalid email').notEmpty();
    req.check('email', 'Invalid email format email').isEmail();
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    User.findOne({ email : req.body.email}, { '_id': 0, 'name' : 1, 'password': 1}, function(err, user) {
      if(!user){
        res.json(
          {"status" : false,
           "data"   : 'User not found'}
        );
        return;
      }
      res.json(
          {"status" : true,
           "data"   : "Email sent"}
      );
      return;
    });
    
  });

  app.post('/api/profiledetails', function(req, res){
    req.check('id_user', 'Invalid id_user').notEmpty();
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    User.findById(req.body.id_user, { '__v': 0 }, function (err, user) { 
      if(!user){
        res.json(
          {"status" : false,
           "data"   : 'User not found'}
        );
        return;
      }
      res.json(
          {"status" : true,
           "data"   : user}
      );
      return;
    });
    
  });

}