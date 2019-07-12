module.exports = function(app, jwt){
  var Category = require('../entity/category.js');

  app.post('/api/createcategory', function(req, res){
    req.check('name', 'Invalid name').notEmpty();
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    var newCategory = Category(req.body);
    newCategory.save(function(err) {
      if (err){
        if(err.code == 11000){
            res.json(
              {"status" : false,
               "data"   : "Category already created"}
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
         "data"   : 'Category created!'}
      );
      return;

    });

  });

  app.get('/api/allcategories', function(req, res){
    Category.find({}, { '_id' : 1, 'name' : 1 }).sort({name: -1}).exec(function(err, categories) { 

        if (!categories){
            res.json(
              {"status" : false,
               "data"   : "Category not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : categories}
        );
      return;
     });
  });

}