/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerClient", ["ngRoute", "LemonerService"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/client/account', {
                templateUrl: 'views/client/account.html',
                controller: 'account'
            })
            .when('/client/account/:id/details', {
                templateUrl: 'views/client/accountdetails.html',
                controller: 'accountdetails'
            })
    }])
    .controller("account", ["$scope", "$rootScope", "clientService", function ($scope, $rootScope, clientService) {
        $rootScope.module = "account";
        clientService.account_list(0, 20, function (content, headersFun) {
            $scope.headers = headersFun();
            $scope.accounts = content;
        });
    }])
    .controller("accountdetails", ["$scope", "$rootScope", "clientService", "$routeParams", function ($scope, $rootScope, clientService, $routeParams) {
        $rootScope.module = "accountdetails";
        $scope.id = $routeParams.id;
        //获取账户详细
        clientService.account_details($routeParams.id, 0, 20, function (content) {
            $scope.details = content;
            var canvas = document.getElementById("canvas").getContext("2d");
            clientService.account_chart(canvas, content);
        });

        $scope.account = clientService.account($scope.id, function () {
        });

    }]);