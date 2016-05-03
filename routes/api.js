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
	// Get the categories from the database and render the json.
	db.getProducts(function(products, success){
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
	var categoryname = req.query.cname;
	// Get the categories from the database and render the json.
	db.getProducts(categoryname, function(products, success){
		if (success){
			res.json(products);
		}
		else{
			res.json({"error":"error"});
		}
	});
})

module.exports = router;
