/**
 * Created by lol on 2014/9/12.
 */
window.ssh = require("ssh2");
window.ping = require('pinger');
window.telnet = require("telnet-client");
window.gui = require('nw.gui');
window.win = gui.Window.get();

window.maximize = function () {
    if (win.isFullscreen)
        win.unmaximize();
    else
        win.maximize();
};

window.quit = function () {
    win.close(true);
};


Array.prototype.remove = function (obj) {
    if (typeof obj == "number") {
        return this.splice(obj, 1);
    }
    else {
        var index = this.indexOf(obj);
        if (index > -1)
            return this.splice(index, 1);
    }
};
