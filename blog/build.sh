#!/usr/bin/env bash

if [ ! -n "$1" ];then
       branch='master'
else
       branch=$1

fi
if [ ! -n "$1" ];then
       commitMessage='update from bash'
else
       commitMessage=$2

fi

git add .
git commit -m "$commitMessage"
git push origin $branch

curl http://202.119.104.195:7899/load
echo 'done'

