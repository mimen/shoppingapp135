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

            ctlr.x_offset = 0;
            ctlr.y_offset = 0;

            ctlr.x_string = "";
            ctlr.y_string = "";

            ctlr.cols = 0;
            ctlr.rows = 0;

            ctlr.runQuery = function(){
                var body = {
                    //rows: $('#rowsSelect').val(),
                    //order: $('#orderSelect').val(),
                    category: $('#categorySelect').val()
                }
                //ctlr.type = body.rows;
                var href = 'http://localhost:3000/api/analytics/?category=' + body.category;
                console.log(href);

                $http.get(href)
                    .success(function(data, status, headers, config){
                        ctlr.data = data;
                        ctlr.reset();
                        ctlr.buildTable();
                    })
                    .error(function(data, status, headers, config){
                        console.log(status);
                        var err = new Error(data);
                        err.code = status;
                        console.log(err);
                    });

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

                var data = ctlr.data;

                var tablehead = "<table><thead><tr><td> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Products ><br>States ∨ </td>";
                var table = "</tr></thead><tbody>";
                var tablefoot = "</tbody>"

                ctlr.rows = data.length;
                if (data) ctlr.cols = data[0].length;

                //if (ctlr.rows < 50) $('#incRows').hide();
                //if (ctlr.cols < 50) $('#incCols').hide();

                for (var i = ctlr.x_offset; i < ctlr.x_offset + 50; i++){
                    if (data && data[0] && data[0][i])
                        tablehead += "<td><b>" + data[0][i].productname + "(" + data[0][i].producttotal + ")</b></td>";
                    else
                        break;
                }

                for (var i = ctlr.y_offset; i < ctlr.y_offset + 50; i++){
                    var next = data[i];
                    if (next){
                        table += "</tr><tr>";
                        table += "<td><b>" + next[0].username + "(" + next[0].usertotal + ")</b></td>";
                        for (var j = ctlr.x_offset; j < ctlr.x_offset + 50; j++){
                            if (next[j])
                                table += "<td>" + next[j].totalprice + "</td>"
                            else
                                break;
                        }
                    } else {
                        break;
                    }
                }


                var complete = tablehead + table + tablefoot;
                document.getElementById("table").innerHTML = complete;
                //ctlr.updateStrings();
            }

            ctlr.createOrders = function(){
                var queries_num = $('#num_orders').val();
                console.log(queries_num);
                var href = 'http://localhost:3000/api/createOrders';
                var body = {
                    num_orders: queries_num
                };
                $http.post(href, body)
                    .success(function(data, status, headers, config){
                        console.log("success");
                        alert(queries_num + " orders are inserted!");
                        $('#num_orders').val("");
                    })
                    .error(function(data, status, headers, config){
                        console.log("failed");
                    });
            }

            ctlr.reset = function(){
                //$('#incRows').show();
                //$('#incCols').show();
                ctlr.x_offset = 0;
                ctlr.y_offset = 0;
            }

            ctlr.loadCategories();
            //$('#incCols').hide();
            //$('#incRows').hide();

        }],
        controllerAs: "ctlr"
    };
}]);
