
var app = angular.module("ProductOrder", []);

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
app.directive("productorder", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/productorder.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.username = loggedinuser;
            ctlr.product = product;
            //ctlr.quantity = 1;

            ctlr.addToCart = function(){
                var quantity = $('#quantity').val();
                var body = {
                    id: product.id,
                    quantity: quantity,
                    price: product.price
                }
                console.log(body);
                var url = 'http://localhost:3000/api/cart/add/';
                $http.post(url, body).then(function(response){
                        console.log(response);
                        if (response.data.error){
                            console.log("error when adding to cart");
                        }   
                        else {
                            console.log("added to cart");
                        }
                    }, function(error){
                        console.log(error);
                    })
            }


            ctlr.getCart = function(){
                var url = 'http://localhost:3000/api/cart/';
                httpLoader.load(url, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("loaded");
                        ctlr.cart = result;
                        console.log(result);
                    }
                });             
            }

            ctlr.getCart();

        }],
        controllerAs: "ctlr"
    };
}]);

