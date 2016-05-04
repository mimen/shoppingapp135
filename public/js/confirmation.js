
var app = angular.module("Confirmation", []);

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
app.directive("confirmation", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/confirmation.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.cart = mycart;
            ctlr.total = mytotal;

        }],
        controllerAs: "ctlr"
    };
}]);

