const style = `
<style>
.transformer-react-render {
  border: 1px dashed #959da5;
  border-radius: 5px;
  display: block;
}
.transformer-react-render-container > pre {
  max-height: 400px;
  transition: all .2s ease;
}
.transformer-react-render-container > pre.focused {
  max-height: none;
  box-shadow: 0 0 6px rgba(0,0,0,.2);
}
</style>
`

module.exports = function(opts) {
  // var lang = opts.lang || 'react'

  return function(node) {
    node.children = [
      {
        type: 'html',
        value: style
      }
    ].concat(node.children)
  }
}
