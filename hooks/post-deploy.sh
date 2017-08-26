#!/bin/sh

# npm run normal-img $@
# npm run sitemap
# npm run deploy

echo $PATH

command_exists () {
    type "$1" &> /dev/null ;
}

if ! command_exists doc-pipe; then
    npm install -g doc-md-import
fi

doc-pipe push ./source/_articles/"$1".md -f
doc-pipe toc "[索引] 余聪文章" -p