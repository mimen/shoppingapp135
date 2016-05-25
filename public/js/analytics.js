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
                    rows: $('#rowsSelect').val(),
                    order: $('#orderSelect').val(),
                    category: $('#categorySelect').val()
                }
                ctlr.type = body.rows;
                var href = 'http://localhost:3000/api/analytics/?rows=' + body.rows + '&order=' + body.order + '&category=' + body.category;
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

                var tablehead = "<table><thead><tr><td> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Products ><br>" + ctlr.type + " ∨ </td>";
                var table = "</tr></thead><tbody>";
                var tablefoot = "</tbody>"

                ctlr.rows = data.length;
                ctlr.cols = data[0].length;

                if (ctlr.rows < 20) $('#incRows').hide();
                if (ctlr.cols < 10) $('#incCols').hide();

                for (var i = ctlr.x_offset; i < ctlr.x_offset + 10; i++){
                    if (data && data[0] && data[0][i])
                        tablehead += "<td><b>" + data[0][i].productname + "(" + data[0][i].producttotal + ")</b></td>";
                    else
                        break;
                }

                for (var i = ctlr.y_offset; i < ctlr.y_offset + 20; i++){
                    var next = data[i];
                    if (next){
                        table += "</tr><tr>";
                        table += "<td><b>" + next[0].username + "(" + next[0].usertotal + ")</b></td>";
                        for (var j = ctlr.x_offset; j < ctlr.x_offset + 10; j++){
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
                ctlr.updateStrings();
            }

            ctlr.incColumns = function(){
                ctlr.x_offset += 10;
                if (ctlr.x_offset + 10 >= ctlr.cols){
                    $('#incCols').hide();
                }
                ctlr.buildTable();
            }

            ctlr.incRows = function(){
                ctlr.y_offset += 20;
                if (ctlr.y_offset + 20 >= ctlr.rows){
                    $('#incRows').hide();
                }
                ctlr.buildTable();
            }

            ctlr.updateStrings = function(){
                ctlr.y_string = "Showing rows " + (ctlr.y_offset + 1) + " - ";
                if (ctlr.y_offset + 20 > ctlr.rows) ctlr.y_string += ctlr.rows;
                else                                ctlr.y_string += (ctlr.y_offset + 20);
                ctlr.y_string += " out of " + ctlr.rows + ".";

                ctlr.x_string = "Showing columns " + (ctlr.x_offset + 1) + " - ";
                if (ctlr.x_offset + 10 > ctlr.cols)  ctlr.x_string += ctlr.cols;
                else                                ctlr.x_string += (ctlr.x_offset + 10);
                ctlr.x_string += " out of " + ctlr.cols + ".";
            }

            ctlr.reset = function(){
                $('#incRows').show();
                $('#incCols').show();
                ctlr.x_offset = 0;
                ctlr.y_offset = 0;
            }

            ctlr.loadCategories();
            $('#incCols').hide();
            $('#incRows').hide();

        }],
        controllerAs: "ctlr"
    };
}]);
