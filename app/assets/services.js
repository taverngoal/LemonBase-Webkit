/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerService", ["ngResource"])
    .service("clientService", ['$resource', function ($resource) {
        var resource = $resource(package.server_path + "/:path", {path: "@path"});
        this.test = function (cb) {
            return resource.get({path: 'api/test'}, cb)
        };

        this.account_chart = function (ctx, data) {
            var sum = [], amount = [], date = [];
            angular.forEach(data, function (obj) {
                sum.push(obj.sum);
                amount.push(obj.amount);
                date.push(obj.created_at.substr(5, 5));
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
            return resource.query({path: 'api/accounts', page: page, count: count}, cb)
        };
        this.account_details = function (id, page, count, cb) {
            page = page || 0;
            count = count || 20;
            return resource.query({path: 'api/accounts/' + id + "/details", page: page, count: count}, cb)
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
                    save: '保存',
                    Account: {
                        title: '标题',
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
                        date: '入账日期'
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
                    save: 'Save',
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
                        date: 'Date'
                    }
                }

            }

        }
    }]);