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
    'picidae-transformer-calc-image-size?devEnable=false&debug=true',

    './transformers/progress?' + JSON.stringify({
      // progressImageUrlGetter: function (url) {
      //   console.log(url)
      //   return 'http://23.106.151.229:8000/resize/' + encodeURIComponent(url)
      // }.toString(),
    }),
    'picidae-transformer-medium-image-zoom'
  ],

  hotReloadTests: [/\/snippets\//],

  commanders: [
    // '',
    'new'
  ]
}
