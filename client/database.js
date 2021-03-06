
// Configuration file
var config = require('../config.js');

// Initialize the postgres database
var options = {};
var pgp = require('pg-promise')(options);
var db = pgp(config.postgres_url);

addUser = function(name, role, age, state, done){
  state = 5;
	var query = "INSERT INTO users" +
				 "(name, role, age, state_id) " + 
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

analyze = function(category, done){

    var factor = 'CREATE TEMPORARY TABLE analytics AS (SELECT a.state, a.productname, coalesce(b.totalprice, 0) as totalprice ' +
                'FROM ' +
                '(SELECT DISTINCT s.name as state, p.name as productname ' +
                'FROM products p, states s ';
    if (category != 'all') factor += ', categories c ' + 
                'WHERE p.category_id = c.id AND c.id = ' + category;
    factor +=    ') a ' +
                'FULL OUTER JOIN ' +
                '(SELECT s.name as state, p.name as productname, SUM(o.quantity * o.price) as totalprice ' +
                'FROM users u, orders o, states s, products p ';
    if (category != 'all') factor += ', categories c ';
    factor +=    'WHERE u.id = o.user_id ' +
                'AND s.id = u.state_id ' +
                'AND p.id = o.product_id ';
    if (category != 'all') factor += 'AND c.id = p.category_id AND c.id = ' + category + ' ';
    factor +=    'GROUP BY s.name, p.name) b ' +
                'ON a.state = b.state ' +
                'AND a.productname = b.productname ' +
                'ORDER BY state, productname);';

    var query = 'SELECT e.state as username, e.userTotal, e.productname, e.totalprice, f.productTotal ' + 
    'FROM ' +
      '(SELECT x.state, userTotal, productname, totalprice ' +
      'FROM ' +
        '(SELECT state, SUM(totalprice) as userTotal ' +
        'FROM analytics AS x ' +
        'GROUP BY state) AS z ' +
      'JOIN analytics AS x ' +
      'ON z.state = x.state ' +
      'ORDER BY userTotal DESC) AS e ' +
    'JOIN ' +
      '(SELECT x.state, productTotal, z.productname, totalprice ' +
      'FROM ' +
        '(SELECT productname, SUM(totalprice) as productTotal ' +
        'FROM analytics AS y ' +
        'GROUP BY productname) AS z ' +
      'JOIN analytics AS x ' +
      'ON z.productname = x.productname ' +
      'ORDER BY productTotal DESC) AS f ' +
    'ON e.state = f.state ' +
    'AND e.productname = f.productname ' + 
    'ORDER BY e.usertotal DESC, e.state ASC, f.producttotal DESC, e.productname ASC;';

  console.log("factor: ");
  console.log(factor);
  console.log("query: ");
  console.log(query);

  db.any('DROP TABLE analytics')
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


precompute = function(done){

  var query = 'INSERT INTO state_headers(state, state_id, category_id, total) ' + 
              '(SELECT s.name, s.id, p.category_id AS category_id, COALESCE(SUM(o.price*o.quantity), 0) AS total ' + 
              'FROM states s ' + 
              'LEFT OUTER JOIN users u ON u.state_id = s.id ' + 
              'LEFT OUTER JOIN orders o ON u.id = o.user_id ' + 
              'INNER JOIN products p ON p.id = o.product_id ' + 
              'GROUP BY s.id, s.name, category_id); ' + 

              'INSERT INTO product_headers(product, product_id, category_id, total) ' + 
              '(SELECT p.name AS name, p.id AS product_id, p.category_id AS category_id, COALESCE(SUM(s.price*s.quantity), 0) AS total ' + 
              'FROM products p ' + 
              'LEFT OUTER JOIN orders s ON p.id = s.product_id ' + 
              'GROUP BY p.id, p.name, p.category_id ' + 
              'ORDER BY total DESC); ' + 


              'INSERT INTO analytics(state_id, product_id, total) ' + 
              '(SELECT s.id, p.id, COALESCE(SUM(o.price*o.quantity), 0) AS total ' + 
              'FROM states s ' + 
              'CROSS JOIN products p ' + 
              'LEFT OUTER JOIN users u ON u.state_id = s.id ' + 
              'LEFT OUTER JOIN orders o ON o.product_id = p.id AND o.user_id = u.id ' + 
              'GROUP BY s.id, p.id ' + 
              'ORDER BY s.id);';

  //console.log(query);

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

update = function(done){

var query = 'UPDATE state_headers x ' + 
            'SET total= (x.total + y.total) ' + 
            'FROM ' + 
            '(SELECT s.name AS state, s.id AS state_id, p.category_id AS category_id, COALESCE(SUM(o.price*o.quantity), 0) AS total ' + 
            'FROM new_orders o, states s, users u, products p ' + 
            'WHERE u.state_id = s.id ' + 
            'AND p.id = o.product_id ' + 
            'AND u.id = o.user_id ' + 
            'GROUP BY s.id, s.name, category_id) y ' + 
            'WHERE x.state_id = y.state_id ' + 
            'AND x.category_id = y.category_id; ' + 

            'UPDATE product_headers x ' + 
            'SET total = (x.total + y.total) ' + 
            'FROM ' + 
            '(SELECT p.name AS product, p.id AS product_id, p.category_id AS category_id, COALESCE(SUM(o.price*o.quantity), 0) AS total ' + 
            'FROM new_orders o, products p ' + 
            'WHERE p.id = o.product_id ' + 
            'GROUP BY p.id, p.name, p.category_id ' + 
            'ORDER BY total DESC) y ' + 
            'WHERE x.category_id = y.category_id ' + 
            'AND x.product_id = y.product_id; ' + 

            'UPDATE analytics x ' + 
            'SET total = (x.total + y.total) ' + 
            'FROM ' + 
            '(SELECT s.id AS state_id, p.id AS product_id, COALESCE(SUM(o.price*o.quantity), 0) AS total ' + 
            'FROM new_orders o, products p, states s, users u ' + 
            'WHERE o.product_id = p.id ' + 
            'AND o.user_id = u.id ' + 
            'AND u.state_id = s.id ' + 
            'GROUP BY s.id, p.id ' + 
            'ORDER BY s.id) y ' + 
            'WHERE x.state_id = y.state_id ' + 
            'AND x.product_id = y.product_id; ' + 

            'DELETE FROM new_orders *;';

  //console.log(query);

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

//TODO: make sure this works
createOrders = function(num_orders, done){

  db.any("SELECT count(*) FROM orders")
    .then( function (old_total) {


      var random_num = Math.random() * 30 + 1;
      if (num_orders < random_num) random_num = num_orders;

      console.log(num_orders);
      console.log(random_num);

      var query = "SELECT proc_insert_orders(" + parseInt(num_orders) + "," + parseInt(random_num) + ")";

      db.any(query)
        .then( function (data) {
          var query2 = "INSERT INTO new_orders" +
                        "(user_id, product_id, quantity, price, is_cart)" +
                        "(SELECT user_id, product_id, quantity, price, is_cart" + 
                        " FROM orders WHERE id > " + old_total[0].count + ")";

          db.any(query2)
            .then( function (data) {
              console.log(data);
              done(true);
            })
            .catch(function (error) {
              console.log(error);
              done(false);
          });

        })
        .catch(function (error) {
          console.log(error);
          done(false);
      });

    })
    .catch(function (error) {
      console.log(error);
      done(false);
  });

}

getHeaders = function(category, done){

  if (category != 'all'){
    var query1 = "SELECT * FROM product_headers " +
                 "WHERE category_id = " + category + " " + 
                 "ORDER BY total DESC " + 
                 "LIMIT 50;";

    var query2 = "SELECT y.name as state, y.id as state_id, COALESCE(total, 0) as total " + 
                 "FROM " + 
                  "(SELECT state, state_id, SUM(total) as total  " + 
                  "FROM state_headers  " + 
                 "WHERE category_id = " + category + " " + 
                  "GROUP BY state, state_id  " + 
                  "ORDER BY total DESC, state ASC) x " + 
                  "FULL OUTER JOIN " + 
                  "(SELECT * FROM states) y " + 
                  "ON x.state = y.name " + 
                  "AND x.state_id = y.id " + 
                  "ORDER BY total DESC;";
  }
  else {
    var query1 = "SELECT product, product_id, SUM(total) as total FROM product_headers " +
                 "GROUP BY product, product_id " + 
                 "ORDER BY total DESC " + 
                 "LIMIT 50;";

    var query2 = "SELECT y.name as state, y.id as state_id, COALESCE(total, 0) as total " + 
                 "FROM " + 
                  "(SELECT state, state_id, SUM(total) as total  " + 
                  "FROM state_headers  " + 
                  "GROUP BY state, state_id  " + 
                  "ORDER BY total DESC, state ASC) x " + 
                  "FULL OUTER JOIN " + 
                  "(SELECT * FROM states) y " + 
                  "ON x.state = y.name " + 
                  "AND x.state_id = y.id " + 
                  "ORDER BY total DESC;";
  }

  console.log(query2);
  

  db.any(query1)
    .then(function (product_headers) {

      db.any(query2)
        .then(function (state_headers) {

          done(product_headers, state_headers, true);
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

getCell = function(product_id, state_id, done){
  var query = "SELECT * FROM analytics " +
              "WHERE state_id = " + state_id + " " + 
              "AND product_id = " + product_id;

  db.any(query)
    .then(function (result) {
      done(result, true);
    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
  });

}


updateStuff = function(category, done){

  var query1 = "SELECT s.name AS state, s.id AS state_id, COALESCE(SUM(o.price*o.quantity), 0) AS total " + 
               "FROM states s, users u, new_orders o, products p " + 
               "WHERE u.state_id = s.id " + 
               "AND u.id = o.user_id " + 
               "AND p.id = o.product_id ";
  if (category != 'all') query1 += "AND p.category_id = " + category + " ";
  query1 +=    "GROUP BY s.name, s.id " + 
               "ORDER BY total DESC"

  var query2 = "SELECT p.name AS product, p.id AS product_id, COALESCE(SUM(o.price*o.quantity), 0) AS total " + 
               "FROM products p, new_orders o " + 
               "WHERE p.id = o.product_id ";
  if (category != 'all') query2 += "AND p.category_id = " + category + " ";
  query2 +=    "GROUP BY p.id, p.name " + 
               "ORDER BY total DESC ";

  var query3 = "SELECT s.id AS state_id, p.id AS product_id, COALESCE(SUM(o.price*o.quantity), 0) AS total " + 
               "FROM new_orders o, states s, products p, users u " + 
               "WHERE u.state_id = s.id " + 
               "AND o.product_id = p.id " + 
               "AND o.user_id = u.id ";
  if (category != 'all') query3 += "AND p.category_id = " + category + " ";
  query3 +=    "GROUP BY s.id, p.id " + 
               "ORDER BY s.id";


  if (category != 'all'){
    var query4 = "SELECT * FROM product_headers " +
                 "WHERE category_id = " + category + " " + 
                 "ORDER BY total DESC " + 
                 "LIMIT 50;";
  }
  else {
    var query4 = "SELECT product, product_id, SUM(total) as total FROM product_headers " +
                 "GROUP BY product, product_id " + 
                 "ORDER BY total DESC " + 
                 "LIMIT 50;";
  }




  console.log(query1);

  db.any(query1)
    .then(function (states) {

      db.any(query2)
        .then(function (products) {

          db.any(query3)
            .then(function (cells) {

              db.any(query4)
                .then(function (top50) {

                  var body = {
                    state_headers: states,
                    product_headers: products,
                    cells: cells,
                    top50: top50
                  }

                  done(body, true);

                })
                .catch(function (error) {
                  console.log(error);
                  done(null, false);
              });


            })
            .catch(function (error) {
              console.log(error);
              done(null, false);
          });
          
        })
        .catch(function (error) {
          console.log(error);
          done(null, false);
      });

    })
    .catch(function (error) {
      console.log(error);
      done(null, false);
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
  getVectors: getVectors,
  createOrders: createOrders,
  precompute: precompute,
  update: update,
  getHeaders: getHeaders,
  getCell: getCell,
  updateStuff: updateStuff
}