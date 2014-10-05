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
    }])
    .controller("account", ["$scope", "$rootScope", "clientService", function ($scope, $rootScope, clientService) {
        $rootScope.module = "account";
        clientService.account_list(0, 20, function (content) {
            console.log(content)
        })
    }]);