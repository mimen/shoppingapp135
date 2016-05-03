var app = angular.module("Categories", []);

$('#updated_message').hide();
$('#error_message').hide();
$('#error_delete').hide();

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

// Categories directive - html Element
app.directive("categories", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/categories.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.username = loggedinuser;

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

            ctlr.updateCategory = function(category, index){
            	console.log("update");
            	var newname = $('#name' + index).val();
            	var newdescription = $('#description' + index).val();
            	var body = {
            		cid: category.cid,
            		name: newname,
            		description: newdescription
            	};
            	console.log(body);
            	var url = 'http://localhost:3000/api/categories/';
            	$http.put(url, body).then(function(response){
                        console.log(response);
                        if (response.data.error){
                        	$('#error_message').show();
                        	$('#create_error').hide();
                        	$('#updated_message').hide();
							$('#error_delete').hide();
                        }
                        else {
                        	$('#updated_message').show();
                        	$('#error_message').hide();
                        	$('#create_error').hide();
							$('#error_delete').hide();
                        }
                        ctlr.loadCategories();
                    }, function(error){
                        console.log(error);
                    })
            }

            ctlr.deleteCategory = function(category){
            	console.log("delete");
            	
                if (confirm("Are you sure you want to delete?") == true){
                    var cid = category.cid;
                    var url = 'http://localhost:3000/api/categories/' + cid;
                    $http.delete(url).then(function(response){
                        console.log(response);
                        if (response.data.error){
                        	$('#error_delete').show();
                        	$('#create_error').hide();
                        	$('#updated_message').hide();
							$('#error_message').hide();
                        }
                        else {
                        	$('#updated_message').show();
                        	$('#error_message').hide();
                        	$('#create_error').hide();
							$('#error_delete').hide();
                        }
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
