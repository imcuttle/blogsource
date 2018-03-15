/**
 * @file node
 * @author Cuttle Cong
 * @date 2018/3/15
 * @description 
 */

// 2.2.6
exports.use = function (opt) {
  return [
    'picidae-transformer-medium-image-progressive?' + JSON.stringify(opt.progressive || {}),
    'picidae-transformer-medium-image-zoom?' + JSON.stringify(opt.zoom || {})
  ]
}