import mediumProgress from 'medium-image-progressive'
import { utils } from 'picidae/exports/html-to-react'

function evalOptions(names = [], options = {}) {
  names.forEach(function (name) {
    if (typeof options[name] === 'string') {
      options[name] = eval('(function() { \n return ' + options[name] + '\n})()')
    }
  })
}

export default function (opt = {}) {
  evalOptions([
    'progressImageUrlGetter', 'originImageUrlGetter', 'widthGetter', 'heightGetter',
    'computeProgressImageUrl'
  ], opt)

  return function (pageData) {

    const callbackCollect = this.callbackCollect

    callbackCollect(function (ele) {
      mediumProgress(ele.querySelectorAll('img'), opt)
    })

    const computeProgressImageUrl = opt.computeProgressImageUrl
      ? opt.computeProgressImageUrl
      : oldUrl => oldUrl

    return [
      {
        shouldProcessNode: function (node) {
          return node && node.name === 'img' && node.attribs && node.attribs['src']
        },
        processNode: function (node, children = [], index) {
          node.attribs['src'] = computeProgressImageUrl(node.attribs['src'])

          return utils.createElement(node, index, node.data, children)
        }
      }
    ]
  }
}
