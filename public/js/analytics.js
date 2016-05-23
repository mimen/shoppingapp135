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
                console.log("hi");
                var body = {
                    rows: $('#rowsSelect').val(),
                    order: $('#orderSelect').val(),
                    category: $('#categorySelect').val()
                }
                var href = 'http://localhost:3000/api/analytics/';

                $http.post(href, body)
                    .success(function(data, status, headers, config){
                        console.log(data);
                        ctlr.length = data.length;
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
                var tablehead = "<table><thead><tr><td></td>";
                var table = "</tr></thead><tbody>";
                var tablefoot = "</tbody>"
                var uname = "";
                var pname = "";
                var row = -1;
                while (data.length > 0){
                    var next = data.shift();
                    if (next.username != uname){
                        row++;
                        uname = next.username;
                        table += "</tr><tr>"
                        table += "<td><b>" + next.username + "(" + next.usertotal + ")</b></td>";
                    }
                    if (row == 0){
                        tablehead += "<td><b>" + next.productname + "(" + next.producttotal + ")</b></td>";
                    }
                    table += "<td>" + next.totalprice + "</td>"
                }
                var complete = tablehead + table + tablefoot;
                document.getElementById("table").innerHTML = complete;
            }

            ctlr.loadCategories();

        }],
        controllerAs: "ctlr"
    };
}]);
