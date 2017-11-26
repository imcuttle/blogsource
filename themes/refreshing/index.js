var autoKeyword = require('picidae-tool-auto-keyword')

module.exports = {
  routes: {
    path: '/',
    component: './Layout',
    indexRoute: {
      component: './Archive',
    },
    childRoutes: [
      {
        path: 'posts/:page',
        component: './Archive'
      },
      {
        path: 'search/(:keyword)',
        component: './Archive'
      },
      {
        path: '*',
        component: './Post'
      }
    ]
  },
  notFound: './NotFound',

  root: './template',

  plugins: [
    // 'toc?depth=3'
  ],

  config: require('./config'),

  picker(metaData, gift, require) {
    // var cheerio = require('cheerio')

    var content = gift.content,
      filename = gift.filename,
      getMarkdownData = gift.getMarkdownData,
      path = gift.path;

    autoKeyword(metaData, gift, {name: 'keywords'})

    return Object.assign(metaData, {desc: content.slice(0, 200)})
  },
}