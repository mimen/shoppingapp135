var express = require('express');
var router = express.Router();

var verifyCustomer = require('./middleware/verifyCustomer.js');
var verifyOwner = require('./middleware/verifyOwner.js');
var verifyLoggedIn = require('./middleware/verifyLoggedIn.js');
var verifyLoggedOut = require('./middleware/verifyLoggedOut.js');

var db = require('../client/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home/');
});

/* GET signup page. */
router.get('/signup', verifyLoggedOut, function(req, res, next) {
  res.render('signup');
});

router.get('/signup/submit/', verifyLoggedOut, function(req, res, next){
  db.addUser(req.query.name, req.query.role, req.query.age, req.query.state, function(data, success){
    if (success){
      var user = {
        name: req.query.name,
        role: req.query.role,
        age: req.query.age,
        state: req.query.state,
        id: data[0].id
      }
      req.session.user = user;
      res.render('success', {username:req.query.name});
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
      res.render('login', {error:true, username:req.query.name});
    else
    {
      console.log(user);
      req.session.user = user;
      res.redirect('/home');
    }
  });
});

/* GET home page. */
router.get('/home', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('home', {isOwner:isOwner, username:username});
});

/* GET categories page. */
router.get('/categories', verifyLoggedIn, function(req, res, next) {
    var username = req.session.user.name;
    var isOwner = req.session.user.role.trim() == "owner";
    res.render('categories', {isOwner:isOwner, username:username});
});

router.get('/categories/submit/', verifyLoggedIn, function(req, res, next){
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  db.addCategory(req.query.name, req.query.description, function(success){
    if (!success){
      res.render('categories', {error:true, isOwner:isOwner, username:username});
    }
    else
      res.render('categories', {isOwner:isOwner, username:username});
  });
});

/* GET products page. */
router.get('/products', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('products', {isOwner:isOwner, username:username});
});

/* GET products_browsing page. */
router.get('/productsbrowsing', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('productsbrowsing', {username:username, isOwner:isOwner});
});

/* GET product_order page. */
router.get('/productorder/:pid', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.name;
  db.getProduct(req.params.pid, function(product, success){
    if (success){
      console.log(product);
      res.render('productorder', {username:username, product:product});
    }
    else 
      res.render('failure');
  })
});

/* GET buy_shopping_cart page. */
router.get('/buyshoppingcart', verifyLoggedIn, function(req, res, next) {
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('buyshoppingcart', {username:username, isOwner:isOwner});
});

/* GET confirmation page. */
router.get('/confirmation', verifyLoggedIn, function(req, res, next) {
  var order = req.session.cart;
  req.session.cart = [];
  var username = req.session.user.name;
  res.render('confirmation', {order: order, total: req.session.total});
});

router.get('/logout/', function(req, res, next){
  req.session.destroy(function(err){
    console.log(err);
  })
  // Redirect to the home page.
  res.redirect('/');

});

module.exports = router;
