var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home/');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home');
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
    req.db.any("select * from users")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
       console.log(error);
    });

  res.render('categories');
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('products');
});

/* GET products_browsing page. */
router.get('/productsbrowsing', function(req, res, next) {
  res.render('productsbrowsing');
});

/* GET product_order page. */
router.get('/productorder', function(req, res, next) {
  res.render('productorder');
});

/* GET buy_shopping_cart page. */
router.get('/buyshoppingcart', function(req, res, next) {
  res.render('buyshoppingcart');
});

/* GET confirmation page. */
router.get('/confirmation', function(req, res, next) {
  res.render('confirmation');
});

module.exports = router;
