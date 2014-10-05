/**
 * Created by tavern on 14-10-4.
 */
angular.module("LemonerService", ["ngResource"])
    .service("clientService", ['$resource', function ($resource) {
        var resource = $resource(package.server_path + "/:path", {path: "@path"});
        this.test = function (cb) {
            return resource.get({path: 'api/test'}, cb)
        };
        this.account_list = function (page, count, cb) {
            page = page || 0;
            count = count || 20;
            return resource.query({path: 'api/accounts', page: page, count: count}, cb)
        };
        this.config = {
            i18n: {
                "zh-cn": {
                    email: '电子邮件',
                    password: '密码',
                    account: '账户',
                    address: '地址',
                    port: '端口',
                    'key file': '密钥文件',
                    optional: '可选',
                    'click to chose': '点击选择',
                    'connect with password': '用密码登录',
                    'connect with key file': '用密钥文件登录',
                    setting: '设置',
                    save: '保存',
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
                    address: 'Address',
                    port: 'Port',
                    'key file': 'Key File',
                    optional: 'Optional',
                    'click to chose': 'Click to Chose',
                    'connect with password': 'Connect With Password',
                    'connect with key file': 'Connect With Key File',
                    setting: 'Setting',
                    save: 'Save',
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