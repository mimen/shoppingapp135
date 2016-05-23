
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


addUser = function(name, role, age, state, done){
	var query = "INSERT INTO users" +
				 "(name, role, age, state) " + 
				 "VALUES ('"
				 	+ name + "', '"
				 	+ role + "', '" 
				 	+ age + "', '"
				 	+ state + "')" 
          + "RETURNING id;";
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

getUser = function(name, done){
  var query = "SELECT * FROM users " +
              "WHERE name = '"+ name +"';";

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

addProduct = function(name, category_id, sku, price, done){
  var is_delete = false;
  var query = "INSERT INTO products" +
        "(name, category_id, sku, price, is_delete) " + 
         "VALUES ('"
          + name + "', '"
          + category_id + "', '" 
          + sku + "', '" 
          + price + "', '" 
          + is_delete + "');";
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

getProduct = function(id, done){
  var query = "SELECT * FROM products " +
    "WHERE id = '" + id +"';";

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

  var query = "SELECT * FROM products ";
    query += "WHERE is_delete = false";

    if (search_string == "")
      query += "";
    else
      query += " AND name LIKE '%" + search_string +"%'" ;

    query += " ORDER BY id ASC;" 

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

getProductsInCategory = function(category_id, search_string, done){
  var query = "SELECT * FROM products " +
    "WHERE category_id = '" + category_id +"'" + 
    "AND is_delete = false";

    if (search_string == "")
      query += "";
    else
      query += " AND name LIKE '%" + search_string +"%'" ;

    query += " ORDER BY id ASC;" 

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

updateProduct = function(id, new_name, new_price, new_sku, new_category_id, done){
  var query = "UPDATE products " +
        "SET name = '"+ new_name + "', price = '" + new_price 
        + "', sku = '"+ new_sku + "', category_id = '" + new_category_id +"' " +
        "WHERE id = '" + id +"';";

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

deleteProduct = function(id, done){
  var query = "UPDATE products " +
        "SET is_delete = true " +
        "WHERE id = '" + id +"';";

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

  var query = "SELECT c.*, COUNT(p.id) as productCount FROM categories c " +
  		"LEFT JOIN products p " +
      "ON (p.category_id = c.id) " + 
      "AND p.is_delete = false " +  
      "GROUP BY c.id " +
  		"ORDER BY c.id ASC;" ;

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

addCategory = function(name, description, done){
  var query = "INSERT INTO categories " +
        "(name, description) " + 
         "VALUES ('"
          + name + "', '"
          + description + "');";
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

updateCategory = function(id, new_name, new_description, done){
  var query = "UPDATE categories " +
        "SET name = '"+ new_name + "', description = '" + new_description + "' "+
        "WHERE id = '" + id +"';";

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

deleteCategory = function(id, done){
  var query = "DELETE FROM categories " +
        "WHERE id = '" + id + "';";

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


addToCart = function(uid, pid, quantity, price, done){
  var query = "INSERT INTO orders" +
        "(user_id, product_id, quantity, price, is_cart) " + 
         "VALUES ('"
          + uid + "', '"
          + pid + "', '" 
          + quantity + "', '" 
          + price + "', '" 
          + true + "');";
  db.any(query)
    .then(function (data) {
      console.log(data[0]);
        done(true);
    })
    .catch(function (error) {
      console.log(error);
      done(false);
  });
}

getCart = function(uid, done){
  var query = 'SELECT p.name AS product_name, p.sku, o.price, o.quantity, c.name AS category_name ' +
              'FROM orders o' +
              ' LEFT JOIN products p ON (o.product_id = p.id)' + 
              ' LEFT JOIN categories c ON (p.category_id = c.id)' + 
              ' WHERE o.user_id = ' + uid + 
              ' AND o.is_cart = true;';
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

checkoutCart = function(uid, done){
  var query = 'UPDATE orders ' +
              'SET is_cart = false ' +
              'WHERE user_id = ' + uid + ';';
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

analyze = function(rows, order, category, done){

  var query = "";

  if (rows !== 'states'){

    var factor = '(SELECT username, productname, coalesce(totalprice, 0) as totalprice FROM ' +
                '(SELECT a.username, a.productname, b.totalprice ' +
                'FROM ' +
                '(SELECT u.name as username, p.name as productname ' +
                'FROM users u, products p ';
    if (category != 'all') factor += ', categories c ' +
                'WHERE p.category_id = c.id AND c.id = ' + category;
    factor +=   ') a ' +
                'FULL OUTER JOIN ' +
                '(SELECT u.name as username, p.name as productname, SUM(o.quantity * o.price) as totalprice ' +
                'FROM users u, orders o, products p ';
    if (category != 'all') factor += ', categories c ';
    factor +=    'WHERE u.id = o.user_id ' +
                'AND p.id = o.product_id ';
    if (category != 'all') factor += 'AND c.id = p.category_id AND c.id = ' + category + ' ';
    factor +=    'GROUP BY u.name, p.name) b ' +
                'ON a.username = b.username ' +
                'AND a.productname = b.productname ' +
                'ORDER BY username, productname) AS x)';

    query = 'SELECT e.username, e.userTotal, e.productname, e.totalprice, f.productTotal ' + 
            'FROM ' +
              '(SELECT x.username, userTotal, productname, totalprice ' +
              'FROM ' +
                '(SELECT username, SUM(totalprice) as userTotal ' +
                'FROM ' + factor + ' AS x ' +
                'GROUP BY username) AS z ' +
              'JOIN ' + factor + ' AS x ' +
              'ON z.username = x.username ' +
              'ORDER BY userTotal DESC) AS e ' +
            'JOIN ' +
              '(SELECT x.username, productTotal, z.productname, totalprice ' +
              'FROM ' +
                '(SELECT productname, SUM(totalprice) as productTotal ' +
                'FROM ' + factor + ' AS y ' +
                'GROUP BY productname) AS z ' +
              'JOIN ' + factor + ' AS x ' +
              'ON z.productname = x.productname ' +
              'ORDER BY productTotal DESC) AS f ' +
            'ON e.username = f.username ' +
            'AND e.productname = f.productname ';


  if (order == 'top')
    query+= 'ORDER BY e.usertotal DESC, e.username ASC, f.producttotal DESC,  e.productname ASC';
  else
    query+= 'ORDER BY e.username ASC, e.productname ASC';

  }
  else {

    var factor = '(SELECT state, productname, coalesce(totalprice, 0) as totalprice FROM ' +
                '(SELECT a.state, a.productname, b.totalprice ' +
                'FROM ' +
                '(SELECT DISTINCT u.state, p.name as productname ' +
                'FROM users u, products p ';
    if (category != 'all') factor += ', categories c ' +
                'WHERE p.category_id = c.id AND c.id = ' + category;
    factor +=    ') a ' +
                'FULL OUTER JOIN ' +
                '(SELECT u.state, p.name as productname, SUM(o.quantity * o.price) as totalprice ' +
                'FROM users u, orders o, products p ';
    if (category != 'all') factor += ', categories c ';
    factor +=    'WHERE u.id = o.user_id ' +
                'AND p.id = o.product_id ';
    if (category != 'all') factor += 'AND c.id = p.category_id AND c.id = ' + category + ' ';
    factor +=    'GROUP BY u.state, p.name) b ' +
                'ON a.state = b.state ' +
                'AND a.productname = b.productname ' +
                'ORDER BY state, productname) AS x)';

    query = 'SELECT e.state as username, e.userTotal, e.productname, e.totalprice, f.productTotal ' + 
    'FROM ' +
      '(SELECT x.state, userTotal, productname, totalprice ' +
      'FROM ' +
        '(SELECT state, SUM(totalprice) as userTotal ' +
        'FROM ' + factor + ' AS x ' +
        'GROUP BY state) AS z ' +
      'JOIN ' + factor + ' AS x ' +
      'ON z.state = x.state ' +
      'ORDER BY userTotal DESC) AS e ' +
    'JOIN ' +
      '(SELECT x.state, productTotal, z.productname, totalprice ' +
      'FROM ' +
        '(SELECT productname, SUM(totalprice) as productTotal ' +
        'FROM ' + factor + ' AS y ' +
        'GROUP BY productname) AS z ' +
      'JOIN ' + factor + ' AS x ' +
      'ON z.productname = x.productname ' +
      'ORDER BY productTotal DESC) AS f ' +
    'ON e.state = f.state ' +
    'AND e.productname = f.productname ';

  if (order == 'top')
    query+= 'ORDER BY e.usertotal DESC, e.state ASC, f.producttotal DESC, e.productname ASC';
  else
    query+= 'ORDER BY e.state ASC, e.productname ASC';

  }

  console.log(query);

  db.any(query)
    .then(function (data) {
        done(data, true);
    })
    .catch(function (error) {
        done(null, false);
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
  addToCart: addToCart,
  getCart: getCart,
  checkoutCart: checkoutCart,
  analyze: analyze
}