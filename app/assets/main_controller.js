/**
 * Created by lol on 2014/9/13.
 */
angular.module("LemonerTerminal", ["ngRoute", "LemonerClient", "LemonerService"])
    .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
            return {
                'request': function (config) {
                    config.url = config.url.replace(/%2F/g, "/");
                    config.headers['Lemon-Auth'] = new Buffer($rootScope.user.username + ':' + $rootScope.user.psd).toString('base64');
                    return config || $q.when(config);
                },
                'response': function (rejection) {
                    return rejection || $q.when(rejection);
                },
                responseError: function (rejection) {
                    if (rejection.status == 401)
                        $location.path("/client/login");
                    else if (rejection.status == 403)
                        $location.path("/client/forbidden");
                    return $q.reject(rejection);
                }

            }
        });

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
            .when('/setting', {
                templateUrl: 'views/setting.html',
                controller: 'setting'
            })
    }])
    .controller("Home", ["$scope", "$rootScope", "clientService", function ($scope, $rootScope, clientService) {
        $rootScope.user = simpleStorage.get("user") || {username: "", psd: ""};
        $scope.themes = {'default': 'default.css', dark: 'black_orange.css'};
        $scope.theme = simpleStorage.get('theme') || $scope.themes.dark;
        $scope.lang = simpleStorage.get('lang') || 'en';
        $scope.i18n = clientService.config.i18n[$scope.lang];

        $scope.LangChange = function (lang) {
            simpleStorage.set('lang', lang);
            $scope.lang = lang;
            $scope.i18n = clientService.config.i18n[$scope.lang];
        };

        $scope.ThemeChange = function (theme) {
            simpleStorage.set('theme', $scope.themes[theme]);
            $scope.theme = $scope.themes[theme]
        };

        //当路由更改时，要清空以前的数据
        $scope.$on('$routeChangeStart', function (obj, end, start) {
            if (start && start.scope && start.scope.conn) {
                start.scope.conn.end();
                console.log('connect end');
            }
        });

        $scope.platform = window.platform;

    }])
    .controller("SSH", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
        $rootScope.module = "ssh";
        $("#key").change(function () {
            $scope.link.key = $(this).val();
            $scope.$$phase || $scope.$apply();
        });
        //初始化传输流
        $scope.StreamInit = function (err, stream) {
            $scope.conn.send = function (content) {     //发送信息
                stream.write(content);
            };
            if (err)                                    //如果有错则显示到控制台
                $scope.term.write(err.toString());
            stream.on('exit', function (code, signal) {//当ssh退出
                $scope.term.write('\r\nStream :: exit :: code: ' + code);
                $scope.conn.enable = false;
                $scope.$$phase || $scope.$apply();
            }).on('close', function () {                //当链接关闭
                $scope.term.write("\r\nStream :: Closed");
                $scope.conn.end();
                $scope.conn.enable = false;
                $scope.$$phase || $scope.$apply();
            }).on('data', function (data) {
                $scope.term.write(data.toString());         //有数据时写入数据
            }).stderr.on('data', function (data) {
                    $scope.term.write('\r\nSTDERR: ' + data);
                    $scope.$$phase || $scope.$apply();
                });
            $scope.$$phase || $scope.$apply();
        };
        //初始化控制台
        $scope.TermInit = function () {
            Terminal.colors[256] = '';               //背景色
            Terminal.colors[257] = '';           //前景色
            $scope.term = new Terminal({
                cols: 80,
                rows: parseInt($("#Content > .terminal .content").height() / 17),
                screenKeys: true
            });
            $scope.term.open($("#Content >.terminal .content")[0]);
            $scope.term.on('data', function (data) {        //控制台有数据时发送数据
                if ($scope.conn.enable)
                    $scope.conn.send(data);
            });
            process.on('uncaughtException', function (e) {
                $scope.term.write("\r\n" + e.code + "::" + e.message + "\r\n")
            });
        };
        $scope.TermInit();
        //初始化连接    若传了key则是key登录
        $scope.Link = function (key) {
            $scope.term.write('Connecting...\r\n');
            $scope.conn = new window.ssh();
            $scope.conn.enable = true;  //链接状态
            var key_file = undefined;
            if (require('fs').existsSync($(key).val())) {
                key_file = require('fs').readFileSync($(key).val())
            }
            $scope.Conn(key_file);
        };
        //链接服务器
        $scope.Conn = function (key_file) {
            $scope.conn.on("close", function () {
                $scope.conn.enable = false;
                $scope.term.write("\r\nConnect :: Closed");
                $scope.$$phase || $scope.$apply();
            });
            $scope.conn.on('ready', function () {
                $scope.conn.shell({}, function (err, stream) {  //开启链接ssh
                    $scope.StreamInit(err, stream);
                });
            });
            $scope.conn.on('error', function (err) {
                console.log(err);
                $scope.term.write("\r\n" + err)
            });
            $scope.conn.on('close', function (hadError) {
                console.log(hadError)
            });

            try {

                $scope.conn.connect({
                    host: $scope.link.address,
                    port: $scope.link.port,
                    username: $scope.link.user,
                    password: !key_file ? $scope.link.psd : undefined,
                    readyTimeout: 60000,
                    privateKey: key_file || undefined
                });
            }
            catch (e) {
                $scope.conn.enable = false;
                $scope.term.write("\r\n" + e.message)
            }
        }
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
            this.$sent = 0;     //已发送
            this.$received = 0; //已接受
            this.$max = 0;      //最大延迟
            this.$min = 10000;  //最小延迟
            this.$lost = 0;     //丢失
            this.$loss = 0;     //丢包率
            this.$avg = 0;      //平均延迟
            this.$total = 0;    //延迟总计
            this.$high = 0;   //高延迟ping
            this.$handle = null;  //循环的句柄
            this.$started = false; //是否已开始
            var $this = this;
            this.start = function () {
                if ($this.$started) return;
                $this.$started = true;
                $this.$handle = $interval(function () {
                    $this.$sent++;
                    window.ping($this.$obj.address, function (err, ms) {
                            var type = "low";
                            if (err) {          //丢失时
                                $this.$lost++;
                                type = "error";
                                ms = "Time Out or Error Address";
                            } else {
                                $this.$received++;
                                $this.$total += ms;
                                $this.$loss = $this.$lost != 0 ? ($this.$lost / $this.$sent) * 100 : 0;
                                $this.$avg = parseInt($this.$total / $this.$received);
                            }
                            if (ms > $this.$obj.high_ping) {            //高延迟
                                type = "high";
                                $this.$high++
                            }
                            if (ms > $this.$max)$this.$max = ms;        //最高
                            if (ms < $this.$min)$this.$min = ms;        //最低

                            $this.$data.unshift({value: ms, type: type, time: Date.now().toString()});
                            $scope.$$phase || $scope.$apply();
                        }
                    );
                }, this.$obj.interval)
            };
            this.stop = function () {
                $interval.cancel(this.$handle);
            };

            this.$get = function () {
                return this;
            };
        };

        $scope.ping_array = [];
        //添加ping
        $scope.Ping = function (obj) {
            obj = new $scope.ping_obj(obj);
            $scope.ping_array.unshift(obj.$get());
            $scope.Ping_Click(obj);
            $scope.link = {address: "127.0.0.1", count: 4, high_ping: 200, interval: 1000}
        };
        //全部开始
        $scope.all_start = function () {
            angular.forEach($scope.ping_array, function (obj) {
                obj.start();
            })
        };
        //全部停止
        $scope.all_stop = function () {
            angular.forEach($scope.ping_array, function (obj) {
                obj.stop();
            })
        };
        //清除
        $scope.all_clear = function () {
            $scope.ping_array = [];
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
    .controller("setting", ["$scope", "$rootScope", "clientService", function ($scope, $rootScope, clientService) {
        $rootScope.module = "login";
        $scope.UserSave = function (user) {
            $rootScope.user = user;
            simpleStorage.set("user", user);
            clientService.test(function (content) {
                console.log(content)
            })

        }
    }])
;

