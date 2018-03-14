/**
 * @file node
 * @author Cuttle Cong
 * @date 2018/3/13
 * @description
 */
var visit = require('unist-util-visit')
var u = require('url')

var evalVal = require('./evalVal')

exports.use = 'picidae-transformer-calc-image-size'

function isUrlString(url) {
  return u.parse(url).slashes || url.startsWith('//')
}


exports.rehypeTransformer = function (options) {
  let progressImageUrlGetter
  if (options.progressImageUrlGetter) {
    progressImageUrlGetter = evalVal(options.progressImageUrlGetter)
  }
  else {
    progressImageUrlGetter = function (url) {
      return 'http://23.106.151.229:8000/resize/' + encodeURIComponent(url) + '?s=0.1'
    }
  }

  return function (node) {
    visit(node, 'element', function (ele) {
      if (ele.tagName === 'img') {
        var properties = ele.properties
        if (properties.src) {
          var old = properties.src
          if (isUrlString(properties.src)) {
            properties.src = progressImageUrlGetter(properties.src)
            properties['data-progressive-src'] = old
          }
        }
      }
    })
  }
}