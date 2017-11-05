/**
 * @file: key-extra
 * @author: Cuttle Cong
 * @date: 2017/11/1
 * @description: 
 */


function KeyExtra(opt) {
    this._init(opt);
}

KeyExtra.prototype = new EventEmitter();
KeyExtra.prototype.constructor = KeyExtra;

KeyExtra.prototype._init = function (opt) {
    var keyExtra = this;

    // double key press
    var doublePressTimeoutMs = 500;
    var lastKeypressTime = 0;
    var lastKeyChar = null;

    function doubleHandle(type) {
        return function (evt) {
            var thisCharCode = evt.key.toUpperCase();
            if (lastKeyChar === null) {
                lastKeyChar = thisCharCode;
                lastKeypressTime = new Date();
                return;
            }
            if (thisCharCode === lastKeyChar) {
                var thisKeypressTime = new Date();
                if (thisKeypressTime - lastKeypressTime <= doublePressTimeoutMs) {
                    keyExtra.emit('double-' + type, thisCharCode);
                }
            }
            lastKeyChar = null;
            lastKeypressTime = 0;
        }
    }
    document && document.addEventListener('keypress', doubleHandle('keypress'));
    document && document.addEventListener('keydown', doubleHandle('keydown'));
};