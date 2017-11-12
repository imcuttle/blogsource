/**
 * @file: New
 * @author: cuttle
 */

var fs = require('fs')
var nps = require('path')
var nunjunks = require('nunjucks')
var moment = require('picidae/exports/moment')

module.exports = function (commander, opt, config, require) {
    return commander
        .command('new [title]')
        .description('create a new markdown')
        .action(function (title) {
            console.log('title:', title);
            if (!title) {
                process.exit(1);
            }

            var tplPath = nps.join(config.templateRoot, 'post.md');
            var mdPath = nps.join(config.docRoot, title + '.md');
            var tpl = fs.readFileSync(tplPath, {encoding: 'utf8'});
            var res = nunjunks.renderString(tpl, {title: title, datetime: moment().format('YYYY-MM-DD HH:mm:ss')})

            if (!fs.existsSync(mdPath)) {
                fs.writeFileSync(mdPath, res);
                console.error(mdPath, ' is created')
            }
            else {
                console.error(mdPath, 'is existed')
            }
            process.exit(0);
        })
}