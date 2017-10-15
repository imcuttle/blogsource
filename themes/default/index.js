var getPickerUtils = require('picidae-tools/node/getPickerUtils');

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
        var content = gift.content,
            filename = gift.filename,
            path = gift.path;

        return Object.assign(metaData, {desc: content.slice(0, 80)})
    },
}