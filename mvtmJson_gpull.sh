#!/bin/sh
if [ ! -n "$1" ];then
    echo "no theme chooesed"
else
    mv themes/"$1"/theme.config.json themes/"$1".json
    (cd themes/"$1" && git pull)
    cp themes/"$1".json themes/"$1"/theme.config.json
fi
