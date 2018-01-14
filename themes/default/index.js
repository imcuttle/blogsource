var getPickerUtils = require('picidae-tools/node/getPickerUtils');
var getPureText = require('./getMDPureText');

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
            getMarkdownData = gift.getMarkdownData,
            path = gift.path;

        // return getMarkdownData(content.slice(0, 80))
        //     .then(function (data) {

        return Object.assign(metaData, { desc: getPureText(content).slice(0, 100)/*data: data */})

            // })
    },
}