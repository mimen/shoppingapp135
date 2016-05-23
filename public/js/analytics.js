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

            ctlr.x_offset = 1;
            ctlr.y_offset = 1;

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
                var href = 'http://localhost:3000/api/analytics/';

                $http.post(href, body)
                    .success(function(data, status, headers, config){
                        ctlr.length = data.length;
                        ctlr.reset();
                        ctlr.buildTable(data);
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

            ctlr.buildTable = function(data){

                var tablehead = "<table><thead><tr><td> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Products ><br>" + ctlr.type + " ∨ </td>";
                var table = "</tr></thead><tbody>";
                var tablefoot = "</tbody>"
                var uname = "";
                var pname = "";
                ctlr.rows = 0;
                ctlr.cols = 0;
                while (data.length > 0){
                    var next = data.shift();
                    if (next.username != uname){
                        ctlr.cols = 0;
                        ctlr.rows++;
                        uname = next.username;
                        table += "</tr><tr class='row" + ctlr.rows + "'>";
                        table += "<td><b>" + next.username + "(" + next.usertotal + ")</b></td>";
                    }
                    ctlr.cols++;
                    if (ctlr.rows == 1){
                        tablehead += "<td class='col" + ctlr.cols + "'><b>" + next.productname + "(" + next.producttotal + ")</b></td>";
                    }
                    table += "<td class='col" + ctlr.cols + "'>" + next.totalprice + "</td>"
                }
                var complete = tablehead + table + tablefoot;
                document.getElementById("table").innerHTML = complete;
                ctlr.paginate();
            }

            ctlr.paginate = function(){
                for (var i = 1; i <= ctlr.cols; i++){
                    if (i >= ctlr.x_offset && i < ctlr.x_offset + 10){
                        $('.col' + i).removeClass('x');
                    }
                    else {
                        $('.col' + i).addClass('x'); 
                    }
                }
                for (var j = 1; j <= ctlr.rows; j++){
                    if (j >= ctlr.y_offset && j < ctlr.y_offset + 20){
                        $('.row' + j).removeClass('x');
                    }
                    else {
                        $('.row' + j).addClass('x'); 
                    }
                }

                ctlr.x_string = "Showing columns " + ctlr.x_offset + " - ";
                if (ctlr.x_offset + 9 > ctlr.cols)  ctlr.x_string += ctlr.cols;
                else                                ctlr.x_string += (ctlr.x_offset + 9);
                ctlr.x_string += " out of " + ctlr.cols + ".";
                ctlr.y_string = "Showing rows " + ctlr.y_offset + " - ";
                if (ctlr.y_offset + 19 > ctlr.rows) ctlr.y_string += ctlr.rows;
                else                                ctlr.y_string += (ctlr.y_offset + 19);
                ctlr.y_string += " out of " + ctlr.rows + ".";


                if (ctlr.y_offset + 19 >= ctlr.rows){
                    $('#incRows').hide();
                }
                if (ctlr.x_offset + 9 >= ctlr.cols){
                    $('#incCols').hide();
                }
            }

            ctlr.incColumns = function(){
                ctlr.x_offset += 10;
                if (ctlr.x_offset + 9 >= ctlr.cols){
                    $('#incCols').hide();
                }
                ctlr.paginate();
            }

            ctlr.incRows = function(){
                ctlr.y_offset += 20;
                if (ctlr.y_offset + 19 >= ctlr.rows){
                    $('#incRows').hide();
                }
                ctlr.paginate();
            }

            ctlr.reset = function(){

                $('#incRows').show();
                $('#incCols').show();
                ctlr.x_offset = 1;
                ctlr.y_offset = 1;
            }

            ctlr.loadCategories();

        }],
        controllerAs: "ctlr"
    };
}]);
