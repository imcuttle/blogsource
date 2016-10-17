/**
 * Created by Moyu on 16/10/14.
 */
var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var express = require('express');
var path = require('path');

var config = require("./webpack.config.js");

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    contentBase: './build',
    inline: false,
    setup: function (app) {
        app.all('/_api/:file', function (req, res) {
            res.sendFile(path.resolve('..', '..', '..', 'blog', 'static', '_api', req.params.file))
        })
    },
    stats: {
        colors: true,
        progress: true
    },
    devtool: 'eval',
    publicPath: '/'
});
server.listen(8080);