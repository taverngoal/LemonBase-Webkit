/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerService", ["ngResource"])
    .service("clientService", ['$resource', function ($resource) {
        var resource = $resource(package.server_path + "/:path", {path: "@path"});
        this.account_list = function (page, count, cb) {
            page = page || 0;
            count = count || 20;
            return resource.query({path: 'api/accounts', page: page, count: count}, cb)
        }
    }]);