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
                    tablehead += "<td id='ph" + product.product_id + "' data-price=" + parseFloat(product.total) + "><b>" + product.product + " ($" + rounding(product.total) + ")</b></td>";
                }

                for (var i = 0; i < ctlr.states.length; i++){
                    var state = ctlr.states[i];
                    if (ctlr.products.length > 0){
                        table += "</tr><tr id='state" + state.state_id + "'>";
                        table += "<td class='state_header' data-price=" + parseFloat(state.total) + "><b>" + state.state + " ($" + rounding(state.total) + ")</b></td>";

                        for (var j = 0; j < ctlr.products.length; j++){
                            var product = ctlr.products[j];
                            table += "<td data-price=" + parseFloat(ctlr.cells[i][j].total) + " id='product" + product.product_id + "'>" + rounding(ctlr.cells[i][j].total) + "</td>";
                        }

                    }
                }

                var complete = tablehead + table + tablefoot;
                document.getElementById("table").innerHTML = complete;
                
            }

            ctlr.updateTable = function(data){

                for (var i = 0; i < data.state_headers.length; i++){
                    var state = data.state_headers[i];
                    var old_total = $('#state' + state.state_id + ' > .state_header').attr("data-price");
                    var new_total = rounding(parseFloat(old_total) + parseFloat(state.total));
                    $('#state' + state.state_id + ' > .state_header').addClass('updated_cell');
                    $('#state' + state.state_id + ' > .state_header').text("" + state.state + " ($" + new_total + ")");
                }

                for (var i = 0; i < data.product_headers.length; i++){
                    var product = data.product_headers[i];
                    var old_total = $('#ph' + product.product_id).attr("data-price");
                    var new_total = rounding(parseFloat(old_total) + parseFloat(product.total));
                    $('#ph' + product.product_id).addClass('updated_cell');
                    $('#ph' + product.product_id).text("" + product.product + " ($" + new_total + ")");
                }

                for (var i = 0; i < data.cells.length; i++){
                    var cell = data.cells[i];
                    var selector = '#state' + cell.state_id + ' > #product' + cell.product_id;
                    var old_total = $(selector).attr("data-price");
                    var new_total = rounding(parseFloat(old_total) + parseFloat(cell.total));
                    $(selector).addClass('red_cell');
                    $(selector).text("" + new_total);
                }

                var newtop = data.top50;
                var oldtop = ctlr.products;

                var matching = [];

                for (var i = 0; i < newtop.length; i++){
                    for (var j = i; j < oldtop.length; j++){
                        var p1 = newtop[i];
                        var p2 = oldtop[j];
                        if (p1.product_id == p2.product_id){
                            break;
                        }
                        if (j == oldtop.length - 1){
                            var id = p2.product_id;
                            $('#ph' + id).addClass("purple_cell");
                            $('#product' + id).addClass("purple_cell");
                        }
                    }
                }

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
                var category_id = $('#categorySelect').val();
                var href = 'http://localhost:3000/api/refresh?category=' + category_id;
                $http.get(href)
                    .success(function(data, status, headers, config){
                        console.log("success");
                        console.log(data);
                        ctlr.updateTable(data);
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

var rounding = function(num){
    return Math.round(num * 100) / 100;
}