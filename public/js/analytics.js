var app = angular.module("Analytics", []);

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
app.directive("analytics", [function (){
    return {
        restrict: 'E',
        templateUrl: 'http://localhost:3000/views/analytics.html',
        controller: ["httpLoader", '$http', function (httpLoader, $http) {
            var ctlr = this;

            ctlr.runQuery = function(){
                var category = $('#categorySelect').val();
                ctlr.getData(category);
            }

            // Populate the list of categories
            ctlr.loadCategories = function(){
                httpLoader.load('http://localhost:3000/api/categories', function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        ctlr.categories = result;
                        ctlr.runQuery();
                    }
                });
            }

            ctlr.buildTable = function(){

                var tablehead = "<table><thead><tr><td> &nbsp;&nbsp;&nbsp; Products ><br>States ∨ </td>";
                var table = "</tr></thead><tbody>";
                var tablefoot = "</tbody>"

                ctlr.width = 0;
                if (ctlr.cols < 50) ctlr.width = (ctlr.cols + 1) * 100;
                else ctlr.width = 5100;
                
                for (var i = 0; i < ctlr.products.length; i++){
                    var product = ctlr.products[i];
                    tablehead += "<td><b>" + product.product + " ($" + product.total + ")</b></td>";
                }

                for (var i = 0; i < ctlr.states.length; i++){
                    var state = ctlr.states[i];
                    if (ctlr.products.length > 0){
                        table += "</tr><tr id='state" + state.state_id + "'>";
                        table += "<td><b>" + state.state + " ($" + state.total + ")</b></td>";

                        for (var j = 0; j < ctlr.products.length; j++){
                            var product = ctlr.products[j];
                            table += "<td id='product" + product.product_id + "'>" + ctlr.cells[i][j].total + "</td>";
                        }

                    }
                }

                var complete = tablehead + table + tablefoot;
                document.getElementById("table").innerHTML = complete;
                
            }

            ctlr.createOrders = function(){
                var queries_num = $('#num_orders').val();
                console.log(queries_num);
                var href = 'http://localhost:3000/api/createOrders';
                $http.post(href, { num_orders: queries_num })
                    .success(function(data, status, headers, config){
                        console.log("success");
                        alert(queries_num + " orders are inserted!");
                        $('#num_orders').val("");
                    })
                    .error(function(data, status, headers, config){
                        console.log("failed");
                    });
            }

            ctlr.getData = function(category_id){
                console.log(category_id);
                var href = 'http://localhost:3000/api/headers?category=' + category_id;
                $http.get(href)
                    .success(function(data, status, headers, config){
                        console.log("success");
                        console.log(data);
                        ctlr.cols = data.products.length;
                        ctlr.products = data.products;
                        ctlr.states = data.states;
                        ctlr.cells = data.cells;
                        ctlr.buildTable();
                    })
                    .error(function(data, status, headers, config){
                        console.log("failed");
                    });
            }

            ctlr.refresh = function(){
                var href = 'http://localhost:3000/api/refresh';
                var body = {
                    products: ctlr.products,
                    states: ctlr.states
                }
                $http.post(href, body)
                    .success(function(data, status, headers, config){
                        console.log("success");
                        ctlr.cols = data.products.length;
                        ctlr.products = data.products;
                        ctlr.states = data.states;
                        ctlr.cells = data.cells;
                        ctlr.buildTable();
                        console.log(data);
                    })
                    .error(function(data, status, headers, config){
                        console.log("failed");
                    });
                    
            }

            ctlr.loadCategories();
            ctlr.getData('all');

        }],
        controllerAs: "ctlr"
    };
}]);
