module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 7777,
    publicPath: '/',
    host: 'https://imcuttle.github.io/',
    theme: './themes/refreshing',
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
