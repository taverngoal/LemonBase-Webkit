/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerClient", ["ngRoute", "LemonerService"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/client/login', {
                templateUrl: 'views/client/login.html',
                controller: 'login'
            })
            .when('/client/account', {
                templateUrl: 'views/client/account.html',
                controller: 'account'
            })
    }])
    .controller("login", ["$scope", "$rootScope", function ($scope, $rootScope) {
        $rootScope.module = "login";
        $scope.UserSave=function(user){
            $rootScope.user = user;
        }
    }])
    .controller("account", ["$scope", "$rootScope", "clientService", function ($scope, $rootScope, clientService) {
        $rootScope.module = "account";
        clientService.account_list(0, 20, function (content) {
            console.log(content)
        })
    }]);