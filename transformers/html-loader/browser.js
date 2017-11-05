/**
 * @file: browser
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description: 
 */

function clone(el) {
    const cloneNode = document.createElement(el.tagName.toLowerCase())

    for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
        cloneNode.setAttribute(atts[i].nodeName, atts[i].nodeValue);
    }
    cloneNode.textContent = el.textContent
    return cloneNode
}

module.exports = function (opts) {
    const dangerouslySetScript = !!opts.dangerouslySetScript || false;

    return function () {
        if (!dangerouslySetScript) return

        var callbackCollect = this.callbackCollect;
        var unmountCallbackCollect = this.unmountCallbackCollect;

        callbackCollect(function (ele) {
            const scripts = [...ele.querySelectorAll('script')];
            scripts.forEach(script => document.head.appendChild(clone(script)))
        });
    }
}