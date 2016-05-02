
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

initializeTables = function(){
	var query = "CREATE TABLE Users(" + 
		"username char(50) PRIMARY KEY," +
		"type char(8) NOT NULL," +
		"age int NOT NULL," +
		"state char(2) NOT NULL" +
		");";

	db.any(query)
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
       console.log(error);
    });
}

/*

  var query = "CREATE TABLE Product(" + 
    "productID char(50) PRIMARY KEY," +
    "categoryID char(50) NOT NULL," +
    "SKU int NOT NULL," +
    "price int NOT NULL" +
    ");";

  var query = "CREATE TABLE Category(" + 
    "categoryID char(50) PRIMARY KEY," +
    "description  char(50) NOT NULL," +
    ");";

  var query = "CREATE TABLE Order(" + 
    "orderID int PRIMARY KEY," +
    "date char(50) NOT NULL," +
    "userID char[50] NOT NULL," +
    "orderNumber int NOT NULL" +
    ");";

  var query = "CREATE TABLE OrderItem(" + 
    "itemID char(50) PRIMARY KEY," +
    "productID char(50) NOT NULL," +
    "orderID int NOT NULL," +
    "quantity int NOT NULL," +
    "price int NOT NULL" +
    ");";

*/



addUser = function(name, type, age, state, done){
	var query = "INSERT INTO Users" +
				"(username, type, age, state) " + 
				 "VALUES ('"
				 	+ name + "', '"
				 	+ type + "', '" 
				 	+ age + "', '"
				 	+ state + "');";
	db.any(query)
    .then(function (data) {
    	console.log(data);
        done(true);
    })
    .catch(function (error) {
    	console.log(error);
    	done(false);
    });
}

getUser = function(name, done){
    var query = "SELECT * FROM Users" +
        "WHERE username = '"+ name +"';";

  db.any(query)
    .then(function (data) {
      console.log(data);
        done(true);
    })
    .catch(function (error) {
      console.log(error);
      done(false);
    });

}

addCategory = function(name, description, owner){

}

updateCategory = function(name, description, owner){

}

deleteCategory = function(category_id){

}

module.exports = {
	instance: db,
	initialize: initializeTables,
	addUser: addUser
}