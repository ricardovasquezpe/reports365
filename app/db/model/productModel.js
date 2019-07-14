module.exports = function(app, jwt){
  var Product = require('../entity/product.js');

  app.post('/api/createproduct', function(req, res){
    req.check('code', 'Invalid code').notEmpty();
    req.check('name', 'Invalid name').notEmpty();
    //req.check('category', 'Invalid category').notEmpty();
    req.check('price', 'Invalid price').notEmpty();
    req.check('quantity', 'Invalid quantity').notEmpty();
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    var newProduct = Product(req.body);
    newProduct.save(function(err) {
      console.log(err);
      if (err){
        if(err.code == 11000){
            res.json(
              {"status" : false,
               "data"   : "Product already created"}
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
         "data"   : 'Product created!'}
      );
      return;

    });

  });

  app.get('/api/allproducts', function(req, res){
    Product.find().sort({name: -1}).exec(function(err, products) { 

        if (!products){
            res.json(
              {"status" : false,
               "data"   : "Products not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : products}
        );
      return;
     });
  });

}