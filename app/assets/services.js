/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerService", ["ngResource"])
    .service("clientService", ['$resource', "$rootScope", function ($resource, $rootScope) {
        this.resource = function () {
            return $resource($rootScope.server.location + "/:path", {path: "@path"});
        };
        this.test = function (cb) {
            return this.resource().get({path: 'api/test'}, cb, function (info) {
                $rootScope.user.logined = false;
                $rootScope.server.status = info.status;
            });
        };

        this.account_detail_add = function (accountid, detail, cb) {
            detail.path = 'api/accounts/' + accountid + "/details";
            return this.resource().save(detail, cb)
        };

        this.account_add = function (account, cb) {
            account.path = 'api/accounts';
            return this.resource().save(account, cb);
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

            var chart = new Chart(ctx).Line(lineChartData, {
                responsive: true
            });
        };

        this.account_list = function (page, count, cb) {
            page = page || 0;
            count = count || 20;
            return this.resource().query({path: 'api/accounts', page: page, count: count}, cb)
        };

        this.account = function (id, cb) {
            return this.resource().get({path: "api/accounts/" + id}, cb);
        };

        this.account_details = function (id, page, count, cb) {
            page = page || 0;
            count = count || 20;
            return this.resource().query({path: 'api/accounts/' + id + "/details", page: page, count: count}, cb)
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
                    login: '登录',
                    logout: '注销',
                    save: '保存',
                    submit: '提交',
                    server_path: ' 服务器路径',
                    status_code: {
                        '-1': '',
                        '0': '服务器不存在',
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
                    login: 'Login',
                    logout: 'Logout',
                    save: 'Save',
                    submit: 'Submit',
                    server_path: 'Server Location',
                    status_code: {
                        '-1': '',
                        '0': 'Location Error',
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
                    }
                }

            }

        }
    }]);