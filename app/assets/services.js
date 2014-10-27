/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerService", ["ngResource"])
    .service("clientService", ['$resource', "$rootScope", function ($resource, $rootScope) {
        this.resource = function () {
            return $resource($rootScope.server.location + "/:path", {path: "@path"}, {
                put: {method: 'put'}
            });
        };
//        this.login = function (cb) {
//            return this.resource().get({path: 'api/login'}, cb, function (info) {
//                $rootScope.user.logined = false;
//                $rootScope.user.obj = {};
//                $rootScope.server.status = info.status;
//            });
//        };

        this.user_info_change = function (user, cb) {
            user.path = 'api/users/' + user.id;
            return this.resource().put(user, cb);
        };
        this.config = {
            i18n: {
                "zh-cn": {
                    email: '电子邮件',
                    password: '密码',
                    account: '账户',
                    account_details: '账户明细',
                    address: '地址',
                    port: '端口',
                    'key file': '密钥文件',
                    optional: '可选',
                    'click to chose': '点击选择',
                    'connect with password': '用密码登录',
                    'connect with key file': '用密钥文件登录',
                    setting: '设置',
                    server_setting: "服务器设置",
                    user_info_setting: "用户信息修改",
                    login: '登录',
                    logout: '注销',
                    save: '保存',
                    submit: '提交',
                    server_path: ' 服务器路径',
                    required: '必填',
                    status_code: {
                        '-1': '',
                        '0': '服务器不存在',
                        '400': '错误请求',
                        '401': '帐号不存在或密码错误',
                        '403': '权限不够',
                        '500': '服务器繁忙',
                        '404': '服务器不存在'
                    },
                    Account: {
                        title: '账目名',
                        amount: '金额',
                        creator: '创建人',
                        officer: '负责人',
                        is_public: '公开',
                        created_at: '创建日期'
                    },
                    AccountDetail: {
                        title: '标题',
                        sum: '入账金额',
                        amount: '实际金额',
                        user: '记录者',
                        purpose: '用途',
                        date: '入账日期',
                        memo: '备注'
                    },
                    User: {
                        email: '电子邮件',
                        password: '密码',
                        password_tip: "不修改密码请留空",
                        name: "姓名",
                        nick: "昵称",
                        birth: "生日",
                        addr: "住址",
                        phone: "电话",
                        show_pass: "显示密码"
                    }
                },
                "en": {
                    email: 'Email',
                    password: 'Password',
                    account: 'Account',
                    account_details: 'AccountDetails',
                    address: 'Address',
                    port: 'Port',
                    'key file': 'Key File',
                    optional: 'Optional',
                    'click to chose': 'Click to Chose',
                    'connect with password': 'Connect With Password',
                    'connect with key file': 'Connect With Key File',
                    setting: 'Setting',
                    server_setting: "Server Setting",
                    user_info_setting: "User Self Edit",
                    login: 'Login',
                    logout: 'Logout',
                    save: 'Save',
                    submit: 'Submit',
                    server_path: 'Server Location',
                    required: 'Required',
                    status_code: {
                        '-1': '',
                        '0': 'Location Error',
                        '400': 'Bad Request',
                        '401': 'Unauthorized',
                        '403': 'Forbidden',
                        '500': 'Server Busy',
                        '404': 'Location Error'
                    },
                    Account: {
                        title: 'Title',
                        amount: 'Amount',
                        creator: 'Creator',
                        officer: 'Officer',
                        is_public: 'Public?',
                        created_at: 'CreatedAt'
                    },
                    AccountDetail: {
                        title: 'Title',
                        sum: 'Sum',
                        amount: 'Amount',
                        user: 'Recorder',
                        purpose: 'Purpose',
                        date: 'Date',
                        memo: 'Memo'
                    },
                    User: {
                        email: 'Email',
                        password: 'Password',
                        password_tip: "Keep empty if you won't change it",
                        name: "Name",
                        nick: "Nick",
                        birth: "Birth",
                        addr: "Address",
                        phone: "Phone",
                        show_pass: "Show Password"
                    }
                }

            }

        }
    }])
    .service("accountService", ['$resource', '$rootScope', function ($resource, $rootScope) {
        this.resource = $resource($rootScope.server.location + "/api/accounts/:id", {id: "@id"});

        this.all = function (page, count, cb, err) {
            page = page || 0;
            count = count || 20;
            return this.resource.query({page: page, count: count}, cb, err);
        };

        this.save = function (account, success, err) {
            return this.resource.save(account, success, err);
        };


        this.get = function (id, sc, err) {
            var account = this.resource.get({id: id}, function (content, headers) {
                account.details = {
                    resource: $resource($rootScope.server.location + "/api/accounts/" + id + "/details/:detail_id", {detail_id: '@id'}),

                    add: function (detail, sc, err) {
                        return this.resource.save(detail, sc, err);
                    },
                    all: function (page, count, sc, err) {
                        page = page || 0;
                        count = count || 20;
                        return this.resource.query({page: page, count: count}, sc, err);
                    },
                    get: function (id, sc, err) {
                        return this.resource.get({id: id}, sc, err);
                    }
                };
                sc(content, headers);
            }, err);
            return account;
        };

        this.account_chart = function (ctx, data) {
            var sum = [], amount = [], date = [];
            angular.forEach(data, function (obj) {
                sum.unshift(obj.sum);
                amount.unshift(obj.amount);
                date.unshift(obj.created_at.substr(5, 5));
            });

            var lineChartData = {
                labels: date,
                datasets: [
                    {
                        label: "入账金额",
                        labelColor: 'red',
                        labelFontSize: '16',
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: sum
                    },
                    {
                        label: "总金额",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: amount
                    }
                ]
            };

            return new Chart(ctx).Line(lineChartData, {
                responsive: true
            });
        };
    }])
    .service("userService", ['$resource', '$rootScope', function ($resource, $rootScope) {
        this.resource = function () {
            return  $resource($rootScope.server.location + "/api/users/:id", {id: "@id"}, {
                login: {method: 'get', url: $rootScope.server.location + "/api/users/login"}
            })
        };
        var $this = this;
        this.login = function (sc, err) {
            return this.resource().login({}, sc, function (info) {
                $rootScope.user.logined = false;
                $rootScope.user.obj = {};
                $rootScope.server.status = info.status;
            });
        };

        this.all = function (page, count, sc, err) {
            page = page || 0;
            count = count || 20;
            return this.resource().query({page: page, count: count}, sc, err);
        };

        this.save = function (user, sc, err) {
            return this.resource().save(user, sc, err);
        };

        this.get = function (id, sc, err) {
            return this.resource().get({id: id}, function (content, header) {
                content.remove = function (sc, err) {
                    return $this.remove(id, sc, err);
                };
                sc(content, header);
            }, err)

        };

        this.remove = function (id, sc, err) {
            return this.resource().remove({id: id}, sc, err);
        }
    }]);