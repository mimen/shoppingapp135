
var app = angular.module("BuyShoppingCart", []);

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

// Shopping Cart directive - html Element
app.directive("buyshoppingcart", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/buyshoppingcart.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.username = loggedinuser;

            ctlr.total = 0;

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

                        for (var i = 0; i < result.length; i++){
                            ctlr.total += (result[0].price * result[0].quantity);
                        }

                        $('#total_price').val(ctlr.total);

                    }
                });             
            }

            ctlr.buyCart = function(){
                var ccn = $('#cc_number').val();
                var body = {
                    username: loggedinuser,
                    total: ctlr.total,
                    ccn: ccn,
                    cart: ctlr.cart
                }
                console.log("Buying cart...");
                console.log(body);
                var url = 'http://localhost:3000/api/cart/checkout/';
                $http.post(url, body).then(function(response){
                        console.log(response);
                        if (response.data.error){
                            console.log("failed");
                        }
                        else {
                            console.log("success");


                        }
                    }, function(error){
                        console.log(error);
                    })
            }

            ctlr.getCart();

        }],
        controllerAs: "ctlr"
    };
}]);

