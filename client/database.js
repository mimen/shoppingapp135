
// Configuration file
var config = require('../config.js');

// Initialize the postgres database
var options = {};
var pgp = require('pg-promise')(options);
var db = pgp(config.postgres_url);

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

    var factor = 'CREATE TEMPORARY TABLE temp AS (SELECT username, productname, coalesce(totalprice, 0) as totalprice FROM ' +
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
                'ORDER BY username, productname) a)';

    query = 'SELECT e.username, e.userTotal, e.productname, e.totalprice, f.productTotal ' + 
            'FROM ' +
              '(SELECT x.username, userTotal, productname, totalprice ' +
              'FROM ' +
                '(SELECT username, SUM(totalprice) as userTotal ' +
                'FROM temp AS x ' +
                'GROUP BY username) AS z ' +
              'JOIN temp AS x ' +
              'ON z.username = x.username ' +
              'ORDER BY userTotal DESC) AS e ' +
            'JOIN ' +
              '(SELECT x.username, productTotal, z.productname, totalprice ' +
              'FROM ' +
                '(SELECT productname, SUM(totalprice) as productTotal ' +
                'FROM temp AS y ' +
                'GROUP BY productname) AS z ' +
              'JOIN temp AS x ' +
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

    var factor = 'CREATE TEMPORARY TABLE temp AS (SELECT state, productname, coalesce(totalprice, 0) as totalprice FROM ' +
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
        'FROM temp AS x ' +
        'GROUP BY state) AS z ' +
      'JOIN temp AS x ' +
      'ON z.state = x.state ' +
      'ORDER BY userTotal DESC) AS e ' +
    'JOIN ' +
      '(SELECT x.state, productTotal, z.productname, totalprice ' +
      'FROM ' +
        '(SELECT productname, SUM(totalprice) as productTotal ' +
        'FROM temp AS y ' +
        'GROUP BY productname) AS z ' +
      'JOIN temp AS x ' +
      'ON z.productname = x.productname ' +
      'ORDER BY productTotal DESC) AS f ' +
    'ON e.state = f.state ' +
    'AND e.productname = f.productname ';

  if (order == 'top')
    query+= 'ORDER BY e.usertotal DESC, e.state ASC, f.producttotal DESC, e.productname ASC';
  else
    query+= 'ORDER BY e.state ASC, e.productname ASC';

  }



  console.log("factor: ");
  console.log(factor);
  console.log("query: ");
  console.log(query);

  db.any('DROP TABLE temp')
    .then(function (data) {
  console.log("query 1");
      console.log(data);
        next(done, factor, category, query);
    })
    .catch(function (error) {
  console.log("query 1");
      console.log(error);
        next(done, factor, category, query);
  });
  
}

next = function(done, factor, category, query){

  var productQuery = 'SELECT COUNT(*) FROM products';
  if (category != 'all') productQuery += ' p, categories c WHERE p.category_id = c.id AND c.id = ' + category;

  console.log("hi");
  db.any(factor)
    .then(function (data) {
  console.log("query 2");
      console.log(data.length);

          console.log(query);
            db.any(query)
          .then(function (data) {
        console.log("query 3");
            console.log(data.length);

              db.any(productQuery)
                .then(function (numProducts) {
                    done(data, parseInt(numProducts[0].count), true);
                })
                .catch(function (error) {
                  console.log(error);
                    done(null, null, false);
              });
          })
          .catch(function (error) {
        console.log("query 3");
            console.log(error);
              done(null, null, false);
        });



    })
    .catch(function (error) {
  console.log("query 2");
      console.log(error);
        done(null, null, false);
  });
}

getVectors = function(done){

  console.log("hi");

  var query1 = 'SELECT uid, pid, productname, COALESCE(spent, 0) as spent ' + 
              'FROM ' + 
                '(SELECT b.uid, b.pid, b.productname, a.spent ' + 
                'FROM ' + 
                  '(SELECT u.id as uid, o.product_id as pid, SUM(o.price * o.quantity) as spent ' + 
                  'FROM users u, orders o ' + 
                  'WHERE o.user_id = u.id ' + 
                  'GROUP BY uid, pid ' + 
                  'ORDER BY pid) a ' + 
                'FULL OUTER JOIN ' + 
                  '(SELECT u.id as uid, p.id as pid, p.name as productname ' + 
                  'FROM users u, products p) b ' + 
                'ON a.uid = b.uid ' + 
                'AND a.pid = b.pid ' + 
                'ORDER BY pid, uid) a ';

  var query2 = 'SELECT COUNT(*) FROM users;';

  console.log("query1: ");
  console.log(query1);
  console.log("query2: ");
  console.log(query2);

  db.any(query1)
    .then(function (vectors) {
        db.any(query2)
          .then(function (numUsers) {
              done(vectors, parseInt(numUsers[0].count), true);
          })
          .catch(function (error) {
            console.log(error);
              done(null, null, false);
        });
    })
    .catch(function (error) {
        console.log(error);
        done(null, null, false);
  });
}


module.exports = {
	instance: db,
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
  analyze: analyze,
  getVectors: getVectors
}