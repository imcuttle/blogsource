module.exports = {
    // 更新webpack的配置
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 7777,
    publicPath: '/',
    theme: './theme',
    docRoot: './articles',
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
        // 'picidae-transformer-react-render?lang=react', 'picidae-transformer-file-syntax',
    ],

    commanders: [
    ]
}
