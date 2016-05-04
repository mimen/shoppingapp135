var express = require('express');
var router = express.Router();

var verifyCustomer = require('./middleware/verifyCustomer.js');
var verifyOwner = require('./middleware/verifyOwner.js');
var verifyLoggedIn = require('./middleware/verifyLoggedIn.js');
var verifyLoggedOut = require('./middleware/verifyLoggedOut.js');

var db = require('../client/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  db.initialize();
  res.redirect('/home/');
});

/* GET signup page. */
router.get('/signup', verifyLoggedOut, function(req, res, next) {
  res.render('signup');
});

router.get('/signup/submit/', verifyLoggedOut, function(req, res, next){
  db.addUser(req.query.username, req.query.type, req.query.age, req.query.state, function(success){
    if (success){
      var user = {
        username: req.query.username,
        type: req.query.type,
        age: req.query.age,
        state: req.query.state
      }
      req.session.user = user;
      res.render('success', {username:req.query.username});
    }
    else
      res.render('failure');
  });
});

/* GET login page. */
router.get('/login', verifyLoggedOut, function(req, res, next) {
  res.render('login', {error:false});
});

router.get('/login/submit/', function(req, res, next){
  db.getUser(req.query.username, function(user, success){
    if (!success)
      res.render('login', {error:true, username:req.query.username});
    else
    {
      req.session.user = user;
      res.redirect('/home');
    }
  });
});

/* GET home page. */
router.get('/home', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  res.render('home', {isOwner:isOwner, username:username});
});

/* GET categories page. */
router.get('/categories', verifyLoggedIn, function(req, res, next) {
    var username = req.session.user.username;
    var isOwner = req.session.user.type.trim() == "owner";
    res.render('categories', {isOwner:isOwner, username:username});
});

router.get('/categories/submit/', verifyLoggedIn, function(req, res, next){
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  db.addCategory(req.query.name, req.query.description, req.session.user.username, function(success){
    if (!success){
      res.render('categories', {error:true, isOwner:isOwner, username:username});
    }
    else
      res.render('categories', {isOwner:isOwner, username:username});
  });
});

/* GET products page. */
router.get('/products', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  res.render('products', {isOwner:isOwner, username:username});
});

/* GET products_browsing page. */
router.get('/productsbrowsing', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  res.render('productsbrowsing', {username:username, isOwner:isOwner});
});

/* GET product_order page. */
router.get('/productorder/:pid', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  db.getProduct(req.params.pid, function(product, success){
    if (success){
      console.log(product);
      res.render('productorder', {username:username, isOwner:isOwner, product:product});
    }
    else 
      res.render('failure');
  })
});

/* GET buy_shopping_cart page. */
router.get('/buyshoppingcart', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  res.render('buyshoppingcart', {username:username, isOwner:isOwner});
});

/* GET confirmation page. */
router.get('/confirmation', verifyLoggedIn, function(req, res, next) {
  var order = req.session.cart;
  req.session.cart = [];
  var username = req.session.user.username;
  var isOwner = req.session.user.type.trim() == "owner";
  res.render('confirmation', {username:username, isOwner:isOwner, order: order, total: req.session.total});
});

router.get('/logout/', function(req, res, next){
  req.session.destroy(function(err){
    console.log(err);
  })
  // Redirect to the home page.
  res.redirect('/');

});

module.exports = router;
