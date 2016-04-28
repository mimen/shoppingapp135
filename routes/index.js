var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/home/');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home');
});

/* GET categories page. */
router.get('/categories', function(req, res, next) {
  res.render('categories');
});


module.exports = router;
