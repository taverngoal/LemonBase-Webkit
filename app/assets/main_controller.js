/**
 * Created by lol on 2014/9/13.
 */
angular.module("LemonerTerminal", ["ngRoute"])
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/ssh', {
                templateUrl: 'views/ssh.html',
                controller: 'SSH'
            })
            .when('/telnet', {
                templateUrl: 'views/telnet.html',
                controller: 'Telnet'
            })
            .when('/ping', {
                templateUrl: 'views/ping.html',
                controller: 'Ping'
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

            process.on('uncaughtException', function (e) {
                $scope.term.write("\r\n" + e.code + "::" + e.message + "\r\n")
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
                console.log('socket timeout!');
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
    .controller("Ping", ["$scope", "$rootScope", "$interval", function ($scope, $rootScope, $interval) {
        $rootScope.module = "ping";
        $scope.ping_obj = function (obj) {
            this.$obj = obj;
            this.$data = [];    //所有ping
            this.$high_data = [];   //高延迟ping
            this.$error_data = [];  //错误ping
            this.$handle = null;  //循环的句柄
            var $this = this;
            this._ping = function () {
                $interval(function () {
                    $this.$handle = window.ping($this.$obj.address, function (err, ms) {
                            var type = "low";
                            if (err) {
                                type = "error";
                                ms = "Time Out or Error Address";
                                $this.$error_data.unshift(ms)
                            }
                            if (ms > $this.$obj.high_ping) {
                                type = "high";
                                $this.$high_data.unshift(ms)
                            }
                            $this.$data.unshift({value: ms, type: type, time: Date.now().toString()});
                            $scope.$$phase || $scope.$apply();
                        }
                    );
                }, this.$obj.interval, this.$obj.count == 0 ? undefined : this.$obj.count)
            };
            this.$get = function () {
                return this;
            };
        };

        $scope.ping_array = [];
        $scope.Ping = function (obj) {

            obj = new $scope.ping_obj(obj);
            obj._ping();
            $scope.ping_array.unshift(obj.$get());
            $scope.Ping_Click(obj);
            $scope.link = {address: "127.0.0.1", count: 4, high_ping: 200, interval: 1000}
        };

        $scope.Ping_Click = function (p) {
            $scope.active_p = p;
        };

        $scope.Close = function (p) {
            $scope.ping_array.remove(p);
            $interval.cancel(p.$handle);
            $scope.active_p = {};
        }
    }
    ])
;