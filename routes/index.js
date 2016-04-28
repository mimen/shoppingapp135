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
  res.render('categories');
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('products');
});

/* GET products_browsing page. */
router.get('/products_browsing', function(req, res, next) {
  res.render('products_browsing');
});

/* GET product_order page. */
router.get('/product_order', function(req, res, next) {
  res.render('product_order');
});

/* GET buy_shopping_cart page. */
router.get('/buy_shopping_cart', function(req, res, next) {
  res.render('buy_shopping_cart');
});

/* GET confirmation page. */
router.get('/confirmation', function(req, res, next) {
  res.render('confirmation');
});

module.exports = router;
