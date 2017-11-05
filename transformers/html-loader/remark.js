var toString = require('mdast-util-to-string')
var visit = require('unist-util-visit')

module.exports = function (opts) {
    var lang = opts.lang || 'html'

    return function (node) {
        visit(node, 'code', function (foundNode, index, parent) {
            if (foundNode.lang === lang) {
                foundNode.lang = 'html';
                parent.children.splice(
                    index + 1, 0,
                    {
                        type: 'html',
                        value: '<transformer-html-loader>' + toString(foundNode) + '</transformer-html-loader>'
                    }
                )
            }
        })
    }
}