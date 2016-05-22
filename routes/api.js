var express = require('express');
var router = express.Router();

var db = require('../client/database.js');

/* GET api home */
router.get('/', function(req, res, next) {
  res.json({"hello":"world"});
});

/* GET all categories. */
router.get('/categories/', function(req, res, next) {
	// Get the categories from the database and render the json.
	db.getCategories(function(categories, success){
		if (success){
			res.json(categories);
		}
		else{
			res.json({"error":"error"});
		}
	});
})

/* UPDATE category name/description using category ID. */
router.put('/categories/', function(req, res, next) {
	var cid = req.body.cid;
	var name = req.body.name;
	var description = req.body.description;
	// Get the categories from the database and render the json.
	db.updateCategory(cid, name, description, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* DELETE category using category ID. */
router.delete('/categories/:cid', function(req, res, next) {
	var cid = req.params.cid;
	// Get the categories from the database and render the json.
	db.deleteCategory(cid, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* GET all products. */
router.get('/products/', function(req, res, next) {
	var search = req.query.search;
	// Get the categories from the database and render the json.
	db.getProducts(search, function(products, success){
		if (success){
			res.json(products);
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* GET all products that belong to a category. */
router.get('/products/:cid', function(req, res, next) {
	var search = req.query.search;
	var cid = req.params.cid;
	// Get the categories from the database and render the json.
	db.getProductsInCategory(cid, search, function(products, success){
		if (success){
			res.json(products);
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* POST product information using product ID. */
router.post('/products/', function(req, res, next) {
	var pname = req.body.productname;
	var sku = req.body.sku;
	var price = req.body.price;
	var cid = req.body.cid;
	// Get the categories from the database and render the json.
	db.addProduct(pname, cid, sku, price, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* UPDATE product information using product ID. */
router.put('/products/', function(req, res, next) {
	var pid = req.body.pid;
	var pname = req.body.productname;
	var sku = req.body.sku;
	var price = req.body.price;
	var cid = req.body.cid;
	// Get the categories from the database and render the json.
	db.updateProduct(pid, pname, price, sku, cid, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* DELETE category using category ID. */
router.delete('/products/:pid', function(req, res, next) {
	var pid = req.params.pid;
	// Get the categories from the database and render the json.
	db.deleteProduct(pid, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


router.get('/cart/', function(req, res, next) {

	var uid = req.session.user.id;
	
	db.getCart(uid, function(cart, success){
		if (success)
			res.json(cart);
		else
			res.json({"error":"error"});
	});

})

router.post('/cart/add/', function(req, res, next) {

	var uid = req.session.user.id;
	var pid = req.body.id;
	var quantity = req.body.quantity;
	var price = req.body.price;

	db.addToCart(uid, pid, quantity, price, function(success){
		if (success)
			res.json({"success":"success"});
		else
			res.json({"error":"error"});
	});

})

router.post('/cart/checkout/', function(req, res, next) {

	console.log("Checkout request");

	if (!req.session.cart)
		res.json({"error":"error"});

	console.log(req.body);

	var date = "1234";
	var username = req.body.username.trim();
	var total = req.body.total;
	var ccn = req.body.ccn;
	var cart = req.body.cart;

	req.session.total = req.body.total;

	db.addOrder(date, username, ccn, total, function(oid, success){
		if (success){
			console.log("Order added");
			db.addItemsToOrder(oid, cart, function(success){
				if (success){
					console.log("Added items");
					res.json({"success":"success"});
				}
				else{
					res.json({"error":"error"});
				}

			})
		}
		else {
			res.json({"error":"error"});
		}

	});

})



module.exports = router;
