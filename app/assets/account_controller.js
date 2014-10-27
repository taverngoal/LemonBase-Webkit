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
    .controller("account", ["$scope", "$rootScope", "accountService", function ($scope, $rootScope, accountService) {
        $rootScope.module = "account";

        $scope.ReloadList = function () {
            $scope.accounts = accountService.Account.query({page: 0, count: 20}, function (content, headers) {
                $scope.headers = headers();
            });
        };
        $scope.ReloadList();

        $scope.Account_Submit = function (account) {
            $scope.account.$save(function () {
                $scope.ReloadList();
                account = {};
                $scope.Account_Add_Close();
            });
        };

        $scope.Account_Pre_Add = function () {
            $scope.account = new accountService.Account({ is_public: false, amount: 0.00 });
            $scope.account_show = true;
            $("#account").find(".well").slideDown();
        };
        $scope.Account_Add_Close = function () {
            $scope.account_show = false;
            $("#account").find(".well").slideUp();
        };

        $scope.Account_Edit_Pre = function (id) {
            $scope.account = accountService.Account.get({id: id}, function (content) {
                content.amount = Number(content.amount);
                $("#account").find(".well").slideDown();
            })
        }
    }])
    .controller("accountdetails", ["$scope", "$rootScope", "$routeParams", "accountService", function ($scope, $rootScope, $routeParams, accountService) {
        $rootScope.module = "accountdetails";
        $scope.id = $routeParams.id;
        //获取账户详细
        $scope.reload = function () {
            $scope.account = accountService.get($scope.id, function () {
                $scope.account.details.all(0, 20, function (content) {
                    $scope.details = content;
                    if ($scope.graph) $scope.graph.destroy();
                    var canvas = document.getElementById("canvas").getContext("2d");
                    $scope.graph = accountService.account_chart(canvas, content);
                });
            });
        };
        $scope.reload();

        $scope.Account_Detail_Submit = function (detail) {
            $scope.account.details.add(detail, function () {
                $scope.reload();
                detail = {};
                $scope.Account_Detail_Add_Close();
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