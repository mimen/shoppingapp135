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

router.get('/analytics', verifyLoggedIn, function(req, res, next){
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('analytics', {isOwner:isOwner, username:username});
})

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
  var isOwner = req.session.user.role.trim() == "owner";
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
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('buyshoppingcart', {username:username, isOwner:isOwner});
});

/* GET confirmation page. */
router.get('/confirmation', verifyLoggedIn, function(req, res, next) {
  var order = req.session.cart;
  req.session.cart = [];
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  res.render('confirmation', {username:username, isOwner:isOwner, order: order, total: req.query.total});
});

router.get('/logout/', function(req, res, next){
  req.session.destroy(function(err){
    console.log(err);
  })
  // Redirect to the home page.
  res.redirect('/');

});



router.get('/similarproducts/', verifyLoggedIn, function(req, res, next){
  var username = req.session.user.name;
  var isOwner = req.session.user.role.trim() == "owner";
  db.getVectors(function(data, numUsers, success){
    if (success){
      var vectors = createGroupedArray(data, numUsers);
      computeCosineSimilarities(vectors, numUsers, function(similarities){
        res.render('similarproducts', {username:username, isOwner:isOwner, similarities: similarities});
      })
    }
    else {
      res.json({"error":"error"});
    }
  });
})

var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

var computeCosineSimilarities = function(vectors, count, done){

  var similarities = [];

  for (var i = 0; i < count; i++){
    for (var j = i; j < count; j++){
      if (i !== j){
        var sim = cosineSimilarity(vectors[i], vectors[j]);
        var obj = {
          a: vectors[i][0].productname,
          b: vectors[j][0].productname,
          similarity: sim
        }
        similarities.push(obj);
      }
    }
  }

  var sorted = similarities.sort(compare).slice(0, 100);

  done(sorted);

}

var dotProduct = function(vecA, vecB) {
  var product = 0;
  for (var i = 0; i < vecA.length; i++) {
    product += vecA[i].spent * vecB[i].spent;
  }
  return product;
}

var magnitude = function(vec) {

  var sum = 0;
  for (var i = 0; i < vec.length; i++) {
    sum += vec[i].spent * vec[i].spent;
  }
  return Math.sqrt(sum);
}

var cosineSimilarity = function(vecA, vecB) {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}

var compare = function(a,b) {
  if (a.similarity > b.similarity)
    return -1;
  else if (a.similarity < b.similarity)
    return 1;
  else 
    return 0;
}


module.exports = router;
