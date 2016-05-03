
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

	var query1 = "CREATE TABLE Users(" + 
		"username char(50) PRIMARY KEY," +
		"type char(8) NOT NULL," +
		"age int NOT NULL," +
		"state char(2) NOT NULL" +
		");";

	var query2 = "CREATE TABLE Categories(" + 
    "categoryname char(50) PRIMARY KEY," +
    "description char(50) NOT NULL," +
    "username char(50) REFERENCES Users(username)" +
    ");";

	var query3 = "CREATE TABLE Products(" + 
    "productname char(50) PRIMARY KEY," +
    "categoryname char(50) REFERENCES Categories(categoryname)," +
    "SKU int NOT NULL UNIQUE," +
    "price int NOT NULL" +
    ");";

	var query4 = "CREATE TABLE Orders(" +
		"ordername char(50) PRIMARY KEY," +
		"date char(50) NOT NULL," +
		"username char(50) REFERENCES Users(username)," +
		");";

	var query5 = "CREATE TABLE OrderItems(" + 
		"itemID char(50) PRIMARY KEY," +
		"productname char(50) REFERENCES Products(productname)," +
		"ordername char(50) REFERENCES Orders(ordername)," +
		"quantity int NOT NULL," +
		"price int NOT NULL" +
		");";

	db.any(query1)
	    .then(function (data) {
	        console.log(data);
	    })
	    .catch(function (error) {
	       console.log(error);
	    });

  	db.any(query2)
	    .then(function (data) {
	        console.log(data);
	    })
	    .catch(function (error) {
	       console.log(error);
	    });

  	db.any(query3)
	    .then(function (data) {
	        console.log(data);
	    })
	    .catch(function (error) {
	       console.log(error);
	    });

  	db.any(query4)
	    .then(function (data) {
	        console.log(data);
	    })
	    .catch(function (error) {
	       console.log(error);
	    });
  
  	db.any(query5)
	    .then(function (data) {
	        console.log(data);
	    })
	    .catch(function (error) {
	       console.log(error);
	    });

}




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
  var query = "SELECT * FROM Users " +
              "WHERE username = '"+ name +"';";

  db.any(query)
    .then(function (data) {
      console.log(data);
      if (data.length > 0)
        done(data[0], true);
      else
        done(null, false);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
    });

}

addProduct = function(productname, categoryname, SKU, price, done){
  var query = "INSERT INTO Products" +
        "(productname, categoryname, SKU, price) " + 
         "VALUES ('"
          + productname + "', '"
          + categoryname + "', '" 
          + SKU + "', '" 
          + price + "');";
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

getProductsInCategory = function(categoryname, done){

  var query = "SELECT * FROM Categories" +
    "WHERE categoryname = '" + categoryname +"';" ;

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

selectProductsWithSearch = function(search_string, done){

  var query = "SELECT * FROM Products" +
    "WHERE productname LIKE '%" + search_string +"%';" ;

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

getCategoriesFromUser = function(username, done){

  var query = "SELECT * FROM Categories" +
    "WHERE username = '" + username +"';" ;

  db.any(query)
    .then(function (data) {
      console.log(data);
        done(data, true);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
  });
}

addCategory = function(name, description, owner, done){
  var query = "INSERT INTO Categories" +
        "(categoryname, description, username) " + 
         "VALUES ('"
          + name + "', '"
          + description + "', '" 
          + owner + "');";
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

//TODO: only update respective descriptions needed
updateCategory = function(cur_name, new_name, new_description, owner, done){
  var query = "UPDATE Categories " +
        "SET categoryname = '"+ new_name + "', description = '" + new_description + "' "+
        "WHERE categoryname = '" + cur_name +"';";

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

deleteCategory = function(category_name, done){
  var query = "DELETE FROM Categories " +
        "WHERE categoryname = '" + category_name + "';";

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

module.exports = {
	instance: db,
	initialize: initializeTables,
	addUser: addUser,
  getUser: getUser,
  addProduct: addProduct,
  getCategoriesFromUser: getCategoriesFromUser,
  getProductsInCategory: getProductsInCategory,
  selectProductsWithSearch: selectProductsWithSearch,
  addCategory: addCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
}