/**
 * Created by lol on 2014/9/12.
 */
window.ssh = require("ssh2");
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

