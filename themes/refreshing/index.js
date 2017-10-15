
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

        return Object.assign(metaData, {desc: content.slice(0, 200)})

        return getMarkdownData()
            .then(function (data) {
                data.content = data.content.slice(0, 200)

                return Object.assign(metaData, {desc: data})
            });
    },
}