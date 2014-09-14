/**
 * Created by lol on 2014/9/13.
 */
angular.module("LemonerTerminal", ["ngRoute"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when('/ssh', {
            templateUrl: 'views/ssh.html',
            controller: 'SSH'
        })
        $routeProvider.when('/telnet', {
            templateUrl: 'views/telnet.html',
            controller: 'Telnet'
        })
    }])
    .controller("Home", ["$scope", function ($scope) {

    }])
    .controller("SSH", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
        $rootScope.module = "ssh";
        $scope.TermInit = function () {
            Terminal.colors[256] = '';
            Terminal.colors[257] = '#444';
            $scope.term = new Terminal({
                cols: 80,
                rows: parseInt($(".terminal .content").height() / 20),
                screenKeys: true
            });
            $scope.term.open($(".terminal .content")[0]);
            $scope.term.on('data', function (data) {
                if ($scope.conn.enable)
                    $scope.conn.send(data);
            });
        };
        $scope.Link = function () {
            $scope.TermInit();
            $scope.term.write('Connecting...\r\n');
            $scope.conn = new window.ssh();
            $scope.conn.on('ready', function () {
                $scope.conn.enable = true;
                $scope.conn.shell({}, function (err, stream) {
                    $scope.conn.send = function (content) {
                        stream.write(content);
                    };
                    if (err)
                        $scope.term.write(err.toString());
                    stream.on('exit', function (code, signal) {
                        $scope.term.write('\r\nStream :: exit :: code: ' + code + ', signal: ' + signal);
                        $scope.conn.enable = false;
                        $scope.$$phase || $scope.$apply();
                    }).on('close', function () {
                        $scope.term.write("\r\nConnection :: Closed")
                        $scope.conn.end();
                        $scope.conn.enable = false;
                    }).on('data', function (data) {
                        $scope.term.write(data.toString());
                    }).stderr.on('data', function (data) {
                            $scope.term.write('\r\nSTDERR: ' + data);
                            $scope.$$phase || $scope.$apply();
                        });
                    $scope.$$phase || $scope.$apply();
                });
            });
            try {
                $scope.conn.connect({
                    host: $scope.link.address,
                    port: $scope.link.port,
                    username: $scope.link.user,
                    password: $scope.link.psd,
                    readyTimeout: 60000
                });
            } catch (e) {
                $scope.term.write(e.message)
            }
        };
    }])
    .controller("Telnet", ["$scope", "$rootScope", function ($scope, $rootScope) {
        $rootScope.module = "telnet";
        $scope.Returns = [];
        $scope.Send = function (cmd) {
            $scope.conn.exec(cmd, function (response) {
                console.log(response);
            });
        };

        $scope.Link = function () {
            $scope.conn = new window.telnet();
            $scope.conn.on('ready', function (prompt) {
                $scope.conn.enable = true;
                $scope.conn.exec(cmd, function (response) {
                    console.log(response);
                });
            });

            $scope.conn.on('timeout', function () {
                console.log('socket timeout!')
                $scope.conn.end();
            });

            $scope.conn.on('close', function () {
                console.log('connection closed');
                $scope.conn.enable = false;
            });

            $scope.conn.connect({
                host: $scope.link.address,
                port: $scope.link.port,
                timeout: $scope.link.timeout
            });
            console.log({
                host: $scope.link.address,
                port: $scope.link.port,
                shellPrompt: '/ # '
            })
        }
    }])
;