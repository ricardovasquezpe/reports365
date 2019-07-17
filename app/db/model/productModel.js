module.exports = function(app, jwt){
  var Product = require('../entity/product.js');

  app.post('/api/createproduct', function(req, res){
    req.check('code', 'Invalid code').notEmpty();
    req.check('name', 'Invalid name').notEmpty();
    //req.check('category_id', 'Invalid category').notEmpty();
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
    newProduct.save(function(err, product) {
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
         "data"   : product._id}
      );
      return;

    });created_at

  });

  app.get('/api/allproducts', function(req, res){
    Product.find({}, {__v: 0, updated_at: 0, created_at: 0}).sort({name: -1}).exec(function(err, products) { 

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

  app.get('/api/productdetail/:id', function(req, res){
    Product.findById(req.params.id, function (err, product) {

        if (!product){
            res.json(
              {"status" : false,
               "data"   : "Products not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : product}
        );
      return;
     });
  });

  app.put('/api/updateproduct', function(req, res){
    req.check('code', 'Invalid code').notEmpty();
    req.check('name', 'Invalid name').notEmpty();
    //req.check('category_id', 'Invalid category').notEmpty();
    req.check('price', 'Invalid price').notEmpty();
    req.check('quantity', 'Invalid quantity').notEmpty();
    req.check('_id', 'Invalid _id').notEmpty();
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }
    var _id = req.body._id;
    delete req.body['_id'];
    Product.findByIdAndUpdate(
        _id,
        req.body,
        {new: true},
        (err, product) => {
          if (!product){
                res.json(
                  {"status" : false,
                   "data"   : "product not found"}
                );
              return;
            }

            res.json(
              {"status" : true,
               "data"   : "product updated"}
            );
          return;
        }
    )
  });

}