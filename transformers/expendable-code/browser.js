/**
 * @file: browser
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description:
 */

function clone(el) {
  const cloneNode = document.createElement(el.tagName.toLowerCase())

  for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++) {
    cloneNode.setAttribute(atts[i].nodeName, atts[i].nodeValue)
  }
  cloneNode.textContent = el.textContent
  return cloneNode
}

module.exports = function(opts) {
  return function() {
    var callbackCollect = this.callbackCollect
    var unmountCallbackCollect = this.unmountCallbackCollect

    var focusHandler = (evt) => {
      let pre = evt.target.closest('.transformer-react-render-container > pre')
        if (pre) {
          pre.classList.add('focused')
        }
    }

    var blurHandler = (evt) => {
      let pre = evt.target.closest('.transformer-react-render-container > pre')
      if (pre) {
        pre.classList.remove('focused')
      }
    }

    callbackCollect(function(ele) {
      ele.addEventListener('focus', focusHandler, true)
      ele.addEventListener('blur', blurHandler, true)
    })
    unmountCallbackCollect(ele => {
      // ele.removeEventListener('focus', focusHandler, true)
      // ele.removeEventListener('blur', blurHandler, true)
    })
  }
}
