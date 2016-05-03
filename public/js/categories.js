var app = angular.module("Categories", []);

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

// Library directive - html Element
app.directive("categories", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/categories.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            // Populate the list of songs
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

            ctlr.updateCategory = function(){
            	
            }

            ctlr.deleteCategory = function(category){
            	
                if (confirm("Are you sure you want to delete?") == true){
                    var name = category.categoryname;
                    var url = 'http://localhost:3000/api/categories/' + name;
                    $http.delete(url).then(function(response){
                        console.log(response);
                        ctlr.loadCategories();
                    }, function(error){
                        console.log(error);
                    })
                }

            }

            ctlr.loadCategories();

        }],
        controllerAs: "ctlr"
    };
}]);
