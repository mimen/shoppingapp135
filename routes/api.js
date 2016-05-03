var express = require('express');
var router = express.Router();

var db = require('../client/database.js');

/* GET api home */
router.get('/', function(req, res, next) {
  res.json({"hello":"world"});
});

/* GET categories of logged in user. */
router.get('/categories/', function(req, res, next) {
	// Retrieve the user data from the session.
	var user = req.session.user;
	// Get the collection from the database and render the json.
	db.getCategoriesFromUser(user.username, function(categories, success){
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
	// Retrieve the user data from the session.
	console.log(req.body);
	var cid = req.body.cid;
	var name = req.body.name;
	var description = req.body.description;
	// Get the collection from the database and render the json.
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
	// Retrieve the user data from the session.
	var cid = req.params.cid;
	// Get the collection from the database and render the json.
	db.deleteCategory(cid, function(success){
		if (success){
			res.json({"success":"success"});
		}
		else{
			res.json({"error":"error"});
		}
	});
})


module.exports = router;
