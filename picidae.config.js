
module.exports = {
  webpackConfigUpdater: function(config, webpack) {
    return config
  },
  verbose: true,
  port: 7777,
  publicPath: '/',
  host: 'https://imcuttle.github.io/',

  theme: 'picidae-theme-grass',
  // theme: './themes/default',

  docRoot: './source/_articles',
  distRoot: './public',
  templateRoot: './templates',
  // build过程中额外的资源，将会被复制到distRoot
  extraRoot: './extra',
  // 主题的配置根目录
  themeConfigsRoot: './theme-configs',
  excludes: [/\/ignore\//],

  transformers: [
    'picidae-transformer-react-render?' + JSON.stringify({
      lang: 'react',
      editorProps: {
        workerUrl: '/hljs.worker.js'
      },
      editable: true,
      alias: {
        'log': './mod.js',
        'mo/lib': './lib',
        'snippet': './source/_articles/snippets'
      }
    }),
    'picidae-transformer-file-syntax',
    'remark-mark',
    'picidae-transformer-style-loader?lang=css',
    './transformers/html-loader?lang=__html&dangerouslySetScript',
    'picidae-transformer-calc-image-size?devEnable=true&debug=true',

    'picidae-transformer-medium-image?' + JSON.stringify({
      progressive: {
        sizeOptions: { debug: false, devEnable: false },
        progressImageUrlGetter: function(url) {
          var obj = require('url').parse(url)
          if (obj.hostname === 'eux-blog-static.bj.bcebos.com') {
            obj.pathname = obj.pathname += '@s_0,h_30,l_1,f_jpg,q_50'
            var newUrl = require('url').format(obj)
            return newUrl
          }
          if (obj.hostname === 'obu9je6ng.bkt.clouddn.com') {
            obj.search = 'imageView2/0/w/200/h/20/format/webp/interlace/1/q/49|imageslim'
            obj.query = null
            var newUrl = require('url').format(obj)
            return newUrl
          }
          var q = String.fromCharCode(63)
          return 'http://23.106.151.229:8000/resize/' + encodeURIComponent(url) + q + 's=0.1'
        }.toString()
      }
    })
  ],

  hotReloadTests: [/\/snippets\//],

  commanders: [
    'new'
  ]
}
