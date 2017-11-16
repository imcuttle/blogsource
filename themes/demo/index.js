var nps = require('path')

module.exports = {
  routes: [
    {
      path: 'post/*',
      component: './Article',
    }
  ],
  notFound: './NotFound',

  root: './pages',

  plugins: [
    // 'toc?depth=3'
  ],

  config: {
    a: 'abc',
    // routesMap: {
    //   'graceful-document-maker-picidae.md': 'index'
    // }
    routesMap(filename) {
      console.log(filename)
      return nps.join('post', filename)
    }
  },

  picker(metaData, gift, require) {

    var content = gift.content,
      filename = gift.filename,
      getMarkdownData = gift.getMarkdownData,
      path = gift.path;

    return Object.assign(metaData, {desc: content.slice(0, 200)})

    return getMarkdownData()
      .then(function (data) {
        data.content = data.content.slice(0, 200)

        return Object.assign(metaData, {desc: data})
      });
  },
}