
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
		"uid serial PRIMARY KEY," +
		"username char(50) NOT NULL UNIQUE," +
		"type char(8) NOT NULL," +
		"age int NOT NULL CHECK (age > 0)," +
		"state char(2) NOT NULL" +
		");";

	var query2 = "CREATE TABLE Categories(" + 
		"cid serial PRIMARY KEY," +
	    "categoryname char(50) NOT NULL UNIQUE," +
	    "description char(50) NOT NULL," +
	    "username char(50) REFERENCES Users(username)" +
	    ");";

	var query3 = "CREATE TABLE Products(" + 
		"pid serial PRIMARY KEY," +
	    "productname char(50) NOT NULL UNIQUE," +
	    "categoryname char(50) REFERENCES Categories(categoryname)," +
	    "SKU int NOT NULL UNIQUE CHECK (SKU > 0)," +
	    "price int NOT NULL CHECK (price > 0)" +
	    ");";

	var query4 = "CREATE TABLE Orders(" +
		"oid serial PRIMARY KEY," +
		"date char(50) NOT NULL," +
		"username char(50) REFERENCES Users(username)," +
    "total int NOT NULL CHECK (total > 0)," + 
    "ccn char(16) NOT NULL" + 
		");";

	var query5 = "CREATE TABLE LineItems(" + 
    "lid serial PRIMARY KEY," +
		"productname char(50) REFERENCES Products(productname)," +
		"oid serial REFERENCES Orders(oid)," +
		"quantity int NOT NULL CHECK (quantity > 0)," +
		"price int NOT NULL CHECK (price > 0)" +
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

getProduct = function(pid, done){
  var query = "SELECT * FROM Products " +
    "WHERE pid = '" + pid +"';";

  db.any(query)
    .then(function (data) {
      console.log(data);
        done(data[0], true);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
  });
}

getProducts = function(search_string, done){

  var query = "SELECT * FROM Products" ;

    if (search_string == "")
      query += "";
    else
      query += " WHERE productname LIKE '%" + search_string +"%'" ;

    query += " ORDER BY pid ASC;" 

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

getProductsInCategory = function(categoryname, search_string, done){
  var query = "SELECT * FROM Products " +
    "WHERE categoryname = '" + categoryname +"'" ;

    if (search_string == "")
      query += "";
    else
      query += " AND productname LIKE '%" + search_string +"%'" ;

    query += " ORDER BY pid ASC;" 

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

updateProduct = function(pid, new_name, new_price, new_sku, new_category, done){
  var query = "UPDATE Products " +
        "SET productname = '"+ new_name + "', price = '" + new_price 
        + "', sku = '"+ new_sku + "', categoryname = '" + new_category +"' " +
        "WHERE pid = '" + pid +"';";

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

deleteProduct = function(pid, done){
  var query = "DELETE FROM Products " +
        "WHERE pid = '" + pid + "';";

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

getCategories = function(done){

  var query = "SELECT c.*, COUNT(p.pid) as productCount FROM Categories c " +
  		"LEFT JOIN products p ON (p.categoryname = c.categoryname) GROUP BY c.cid " + 
  		"ORDER BY cid ASC;" ;

  db.any(query)
    .then(function (data) {
      //console.log(data);
        done(data, true);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
  });
}

addCategory = function(name, description, owner, done){
  var query = "INSERT INTO Categories " +
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
updateCategory = function(cid, new_name, new_description, done){
  var query = "UPDATE Categories " +
        "SET categoryname = '"+ new_name + "', description = '" + new_description + "' "+
        "WHERE cid = '" + cid +"';";

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

deleteCategory = function(cid, done){
  var query = "DELETE FROM Categories " +
        "WHERE cid = '" + cid + "';";

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


addOrder = function(date, username, ccn, total, done){
  var query = "INSERT INTO Orders" +
        "(date, username, ccn, total) " + 
         "VALUES ('"
          + date + "', '"
          + username + "', '" 
          + ccn + "', '" 
          + total + "')" 
          + "RETURNING oid;";
  db.any(query)
    .then(function (data) {
      console.log(data[0]);
        done(data[0], true);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
  });
}

addItemsToOrder = function(oid, cart, done){
  addItemsToOrderRecurse(oid, cart, 0, done);
}

addItemsToOrderRecurse = function(oid, cart, index, done){
  var item = cart[index];
  var query = "INSERT INTO LineItems" +
        "(productname, oid, quantity, price) " + 
         "VALUES ('"
          + item.productname + "', '"
          + oid.oid + "', '" 
          + item.quantity + "', '" 
          + item.price + "');";
  db.any(query)
      .then(function (data) {
        console.log(data);
        index++;
        if (index == cart.length)
          done(true)
        else
          addItemsToOrderRecurse(oid, cart, index, done);
      })
      .catch(function (error) {
        console.log("hi");
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
	getCategories: getCategories,
  getProduct: getProduct,
  getProducts: getProducts,
	getProductsInCategory: getProductsInCategory,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
	addCategory: addCategory,
	updateCategory: updateCategory,
	deleteCategory: deleteCategory,
  addOrder: addOrder,
  addItemsToOrder: addItemsToOrder

}