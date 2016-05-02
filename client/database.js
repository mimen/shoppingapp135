
// Configuration file
var config = require('../config.js');

// Initialize the postgres database
var options = {};
var pgp = require('pg-promise')(options);
var db = pgp(config.postgres_url);

/* EXAMPLE DB QUERY
  req.db.any("select * from users")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
       console.log(error);
    });
*/

module.exports = {
	instance: db
}