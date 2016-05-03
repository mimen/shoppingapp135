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
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/signup/submit/', function(req, res, next){
  db.addUser(req.query.username, req.query.type, req.query.age, req.query.state, function(success){
    if (success)
      res.render('success');
    else
      res.render('failure');
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
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
  console.log(req.session.user);
  var isOwner = req.session.user.type == "owner";
  res.render('home', {isOwner:isOwner});
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
  console.log(req.session.user);
  var isOwner = req.session.user.type == "owner";
  res.render('products', {isOwner:isOwner});
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

router.get('/logout/', function(req, res, next){
  req.session.destroy(function(err){
    console.log(err);
  })
  // Redirect to the home page.
  res.redirect('/');

});

module.exports = router;
