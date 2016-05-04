$(".category").click(function(){
	console.log($(this).text());
	$("#category_name").text($(this).text());
})


$('#add_error').hide();
$('#update_error').hide();
$('#delete_error').hide();
$('#add_success').hide();
$('#update_success').hide();
$('#delete_success').hide();

var app = angular.module("Products", []);

app.factory("httpLoader", ["$http", function ($http) {
    function load(href, done) {
        $http.get(href)
            .success(function(data, status, headers, config){
                done(null, data);
            })
            .error(function(data, status, headers, config){
                console.log(status);
                var err = new Error(data);
                err.code = status;
                done(err);
            });
    }
    return {
        load: load
    };
}]);

// Products directive - html Element
app.directive("products", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/products.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.username = loggedinuser;
            ctlr.search = "";

            ctlr.header = "All Products";

            ctlr.nextFunc = 0;

            ctlr.execute = function(){
            	if (ctlr.nextFunc == 0){
            		ctlr.showAll();
            	}
            	else{
            		ctlr.showCategory(ctlr.curr_category);
            	}
            }

            // Populate the list of categories
            ctlr.loadCategories = function(){
                httpLoader.load('http://localhost:3000/api/categories', function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        ctlr.categories = result;
                    }
                });
            }

            ctlr.showAll = function(){
            	var url = 'http://localhost:3000/api/products?search=' + ctlr.search;
                httpLoader.load(url, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        console.log(result);
                        ctlr.products = result;
                        ctlr.nextFunc = 0;
            			ctlr.header = "All Products";
                    }
                });
            }

            ctlr.showCategory = function(category){
            	var name = category.categoryname.trim();
            	var url = 'http://localhost:3000/api/products/' + name + '?search=' + ctlr.search;
                httpLoader.load(url, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        ctlr.products = result;
                        ctlr.nextFunc = 1;
                        ctlr.curr_category = category;
            			ctlr.header = "Products in category: " + category.categoryname;
                    }
                });            	
            }

            //TODO: can't update category name right now.
             ctlr.updateProduct = function(product, index){
            	var newname = $('#product_name' + index).val();
            	var newsku = $('#sku' + index).val();
            	var newcname = $('#category_name' + index).val();
            	var newprice = $('#price' + index).val();
            	var body = {
            		pid: product.pid,
            		productname: newname,
            		sku: newsku,
            		categoryname: newcname,
            		price: newprice
            	};
            	console.log(body);
            	var url = 'http://localhost:3000/api/products/';
            	$http.put(url, body).then(function(response){
                        console.log(response);
                        if (response.data.error){
                        	$('#add_error').hide();
							$('#update_error').show();
							$('#delete_error').hide();
							$('#add_success').hide();
							$('#update_success').hide();
							$('#delete_success').hide();
                        }
                        else {
                        	$('#add_error').hide();
							$('#update_error').hide();
							$('#delete_error').hide();
							$('#add_success').hide();
							$('#update_success').show();
							$('#delete_success').hide();
                        }
                        ctlr.showAll();
                    }, function(error){
                        console.log(error);
                    })
            }

             ctlr.createProduct = function(){
            	var pname = $('#new_pname').val();
            	var cname = $('#new_cname').val();
            	var price = $('#new_price').val();
            	var sku = $('#new_sku').val();
            	var body = {
            		productname: pname,
            		sku: sku,
            		categoryname: cname,
            		price: price
            	};
            	console.log(body);
            	var url = 'http://localhost:3000/api/products/';
            	$http.post(url, body).then(function(response){
                        console.log(response);
                        if (response.data.error){
                        	$('#add_error').show();
							$('#update_error').hide();
							$('#delete_error').hide();
							$('#add_success').hide();
							$('#update_success').hide();
							$('#delete_success').hide();
                        }
                        else {
                        	$('#add_error').hide();
							$('#update_error').hide();
							$('#delete_error').hide();
							$('#add_success').show();
							$('#update_success').hide();
							$('#delete_success').hide();
                        }
                        ctlr.execute();
                    }, function(error){
                        console.log(error);
                    })
            }


            ctlr.deleteProduct = function(product){
                if (confirm("Are you sure you want to delete?") == true){
                    var pid = product.pid;
                    var url = 'http://localhost:3000/api/products/' + pid;
                    $http.delete(url).then(function(response){
                        console.log(response);
                        if (response.data.error){
                        	$('#add_error').hide();
							$('#update_error').hide();
							$('#delete_error').show();
							$('#add_success').hide();
							$('#update_success').hide();
							$('#delete_success').hide();
                       
                        }
                        else {
                        	$('#add_error').hide();
							$('#update_error').hide();
							$('#delete_error').hide();
							$('#add_success').hide();
							$('#update_success').hide();
							$('#delete_success').show();
                        
                        }
                        ctlr.showAll();
                    }, function(error){
                        console.log(error);
                    })
                }

            }

            ctlr.setSearch = function(){
            	ctlr.search = $('#search_term').val();
            	ctlr.execute();
            }

            ctlr.clearSearch = function(){
            	ctlr.search = "";
            	ctlr.execute();
            }

            ctlr.loadCategories();
            ctlr.execute();

        }],
        controllerAs: "ctlr"
    };
}]);
