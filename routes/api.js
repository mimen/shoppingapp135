var express = require('express');
var router = express.Router();

var db = require('../client/database.js');

/* GET api home */
router.get('/', function(req, res, next) {
  res.json({"hello":"world"});
});


/* GET logged in user's collection. */
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

module.exports = router;
