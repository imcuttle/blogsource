/**
 * @file: New
 * @author: cuttle
 */

var fs = require('fs')
var nps = require('path')
var mkdirp = require('mkdirp')

var nunjunks = require('picidae/exports/nunjucks')
var moment = require('picidae/exports/moment')

var baseTplPath = nps.join(__dirname, 'template.md')

module.exports = function (commander, opt, config, require) {
    return commander
        .command('new <title>')
        .description('create an new markdown from template')
        .action(function (title) {
            console.log('title:', title);

            var tplPath = nps.join(config.templateRoot, 'post.md');
            if (!fs.existsSync(tplPath)) {
              mkdirp.sync(config.templateRoot)
              fs.writeFileSync(tplPath, fs.readFileSync(baseTplPath))
            }
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