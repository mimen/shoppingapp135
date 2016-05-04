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
router.get('/products/:cname', function(req, res, next) {
	var search = req.query.search;
	var categoryname = req.params.cname;
	// Get the categories from the database and render the json.
	db.getProductsInCategory(categoryname, search, function(products, success){
		if (success){
			res.json(products);
		}
		else{
			res.json({"error":"error"});
		}
	});
})


/* UPDATE product information using product ID. */
router.post('/products/', function(req, res, next) {
	var pname = req.body.productname;
	var sku = req.body.sku;
	var price = req.body.price;
	var cname = req.body.categoryname;
	// Get the categories from the database and render the json.
	db.addProduct(pname, cname, sku, price, function(success){
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
	var cname = req.body.categoryname;
	// Get the categories from the database and render the json.
	db.updateProduct(pid, pname, price, sku, cname, function(success){
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

	if (!req.session.cart)
		res.json([]);
	else
		res.json(req.session.cart);

})

router.post('/cart/add/', function(req, res, next) {

	if (!req.session.cart)
		req.session.cart = [];

	var line_item = {
		productname: req.body.productname,
		categoryname: req.body.categoryname,
		quantity: req.body.quantity,
		price: req.body.price,
		SKU: req.body.SKU
	}

	req.session.cart.push(line_item);

	res.json({"success":"success"});

})

module.exports = router;
