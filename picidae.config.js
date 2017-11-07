module.exports = {
    // 更新webpack的配置
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 7777,
    publicPath: '/',
    host: 'https://imcuttle.github.io/',
    theme: './themes/refreshing',
    docRoot: './source/_articles',
    distRoot: './public',
    // 模板的根目录，其中html模板为 templateRoot 下的index.html
    templateRoot: './templates',
    // build过程中额外的资源，将会被复制到distRoot
    extraRoot: './extra',
    // 主题的配置根目录
    themeConfigsRoot: './theme-configs',
    // docRoot中被排除的规则，可以是 RegExp | String | (filename) => exclude
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
                'mo/lib': './lib'
            }
        }),
        'picidae-transformer-file-syntax',
        'picidae-transformer-style-loader?lang=css',
        './transformers/html-loader?lang=__html&dangerouslySetScript'
    ],

    hotReloadTests: [/\/snippets\//],

    commanders: [
        './commander/new.js'
    ]
}
