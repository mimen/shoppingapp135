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

router.get('/cart/checkout/', function(req, res, next) {

	console.log("Checkout request");
	var uid = req.session.user.id;

	db.checkoutCart(uid, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else {
			res.json({"error":"error"});
		}
	});

})

router.get('/analytics/', function(req, res, next){
	console.log("start");
	db.analyze(req.query.category, function(data, numProducts, success){
		if (success){
			console.log(numProducts);
			console.log("done");
			res.json(createGroupedArray(data, numProducts));
		}
		else {
			res.json({"error":"error"});
		}
	});
})

router.get('/precompute/', function(req, res, next){
	db.precompute(function(success){
		if (success){
			res.json({"success":"success"});
		}
		else {
			res.json({"error":"error"});
		}
	});
})

router.get('/update/', function(req, res, next){
	db.update(function(success){
		if (success){
			res.json({"success":"success"});
		}
		else {
			res.json({"error":"error"});
		}
	});
})

router.post('/createOrders/', function(req, res, next){
	console.log("received req");
	db.createOrders(req.body.num_orders, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else {
			res.json({"error":"error"});
		}
	})
})

router.get('/headers/', function(req, res, next){
	db.getHeaders(req.query.category, function(product_headers, state_headers, success){
		if (success){
			console.log("got headers");
			var body = {
				products: product_headers,
				states: state_headers
			}

			var cells = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], 
						 [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], 
						 [], [], [], [], [], [], [], [], [], []];

			getCells(cells, 0, 0, body, function(cells){
				body.cells = cells;
				res.json(body);
			});

		}
		else {
			res.json({"error":"error"});
		}
	})
})

var getCells = function(cells, p, s, body, done){
	if (p == body.products.length && s == body.states.length) 
        done(cells);
    else {

        if (p == body.products.length) p = 0;
        if (s == body.states.length) s = 0;

        var state = body.states[s]; 
        var product = body.products[p]; 

        db.getCell(product.product_id, state.state_id, function(result, success){
        	if (success){
        		cells[s].push(result[0]);
        		p++;
                if (p == body.products.length) s++;
                getCells(cells, p, s, body, done);
        	}
        })
    }
}

router.get('/cell/', function(req, res, next){
	db.getCell(req.query.product, req.query.state, function(result, success){
		if (success)
			res.json(result[0]);
		else
			res.json({"error":"error"});
	})
})


var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}



module.exports = router;
