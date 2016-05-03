$(".category").click(function(){
	console.log($(this).text());
	$("#category_button").text($(this).text());
})

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
                        ctlr.products = result;
                        console.log(result);
                    }
                });
            }

            ctlr.showCategory = function(category){
            	var name = category.categoryname;
            	var url = 'http://localhost:3000/api/products/' + name + '?search=' + ctlr.search;
                httpLoader.load(url, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        ctlr.products = result;
                        console.log(result);
                    }
                });            	
            }

            ctlr.loadCategories();

        }],
        controllerAs: "ctlr"
    };
}]);
