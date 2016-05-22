$(".category").click(function(){
	console.log($(this).text());
	$("#category_name").text($(this).text());
})

var app = angular.module("ProductsBrowse", []);

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
app.directive("productsbrowse", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/productsbrowse.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

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

            	if (ctlr.search == "")
					$('#search_header').hide();
				else
					$('#search_header').show();
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
            	var cid = category.id;
            	var url = 'http://localhost:3000/api/products/' + cid + '?search=' + ctlr.search;
                httpLoader.load(url, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        ctlr.products = result;
                        ctlr.nextFunc = 1;
                        ctlr.curr_category = category;
            			ctlr.header = "Products in category: " + category.name;
                    }
                });            	
            }

            ctlr.setSearch = function(){
            	ctlr.search = $('#search_term').val();
            	ctlr.execute();
            }

            ctlr.clearSearch = function(){
            	ctlr.search = "";
                $('#search_term').val("");
            	ctlr.execute();
            }

            ctlr.loadCategories();
            ctlr.execute();

        }],
        controllerAs: "ctlr"
    };
}]);
