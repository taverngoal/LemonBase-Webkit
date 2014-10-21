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
        $scope.ReloadList = function () {
            clientService.account_list(0, 20, function (content, headersFun) {
                $scope.headers = headersFun();
                $scope.accounts = content;
            });
        };
        $scope.ReloadList();

        $scope.Account_Submit = function (account) {
            clientService.account_add(account, function () {
                $scope.ReloadList();
            });
        };

        $scope.Account_Pre_Add = function () {
            $scope.account = { is_public: false, amount: 0.00 };
            $scope.account_show = true;
            $("#account .well").slideDown();
        };
        $scope.Account_Add_Close = function () {
            $scope.account_show = false;
            $("#account .well").slideUp();
        }
    }])
    .controller("accountdetails", ["$scope", "$rootScope", "clientService", "$routeParams", function ($scope, $rootScope, clientService, $routeParams) {
        $rootScope.module = "accountdetails";
        $scope.id = $routeParams.id;
        //获取账户详细
        $scope.reload = function () {
            clientService.account_details($routeParams.id, 0, 20, function (content) {
                $scope.details = content;
                if ($scope.graph) $scope.graph.destroy();
                var canvas = document.getElementById("canvas").getContext("2d");
                $scope.graph = clientService.account_chart(canvas, content);
            });

            $scope.account = clientService.account($scope.id, function () {
            });
        };
        $scope.reload();

        $scope.Account_Detail_Submit = function (detail) {
            clientService.account_detail_add($scope.account.id, detail, function () {
                $scope.reload();
            });
        };

        $scope.Account_Detail_Pre_Add = function () {
            $scope.account_detail = { };
            $scope.account_detail_show = true;
            $(".detail_form").slideDown();
        };
        $scope.Account_Detail_Add_Close = function () {
            $scope.account_detail_show = false;
            $(".detail_form").slideUp();
        }
    }]);