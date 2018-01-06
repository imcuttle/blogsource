---
title: Javascript 项目常用的配置文件
datetime: 2018-01-06 13:43:43
tags: []
---

# 引子

基本上 GitHub 上优秀的javascript项目上面有很多零零碎碎的文件。如图，以koa为例
![](https://i.loli.net/2018/01/06/5a5063addc5f0.jpg)

下文将一一说明这些个“奇怪”的文件是干什么的...


# 持续集成篇

持续集成（CI, Continuous integration），是将我们的代码规范化流程化。  
相比于系统集成，CI希望每一次微小的代码修改，都会进行一次集成（可能包括构建，测试，发布等阶段），这样极大地加强了项目工程的可控性。

从 GitLab 8.0 开始，GitLab CI 就已经集成在 GitLab 中<sup>[1]</sup>。那么 GitHub 中对于CI的支持如何呢？GitHub 可以采用任意第三方的 CI 服务，下面主要介绍其中的一种：travis-ci

## travis-ci (`.travis.yml`)

官网：https://travis-ci.org/  
该平台也是本人经常使用的 CI 平台，需要在项目跟目录下添加文件 `.travis.yml`，如：
```yaml
language: node_js
node_js: stable

install:
  - npm install
script:
  - npm test
```

便是一个简单的配置文件参考，travis-ci 有下面几个生命周期，顺序如下：<sup>[2]</sup>
1. `before_install`
2. `install`
3. `before_script`
4. `script`
5. `after_success` 或者 `after_failure`
6. `before_deploy`
7. `deploy`
8. `after_deploy`
9. `after_script`

同时 travis-ci 还提供了一大批的 Provider，以方便我们来书写一些常用的部署动作<sup>[3]</sup>

配置好了之后，同时在travis-ci认证提供之后，并且给对应的repo赋予权限，那么我们的每次commit都会触发按照上面的执行过程，在travis-ci提供的集群上执行。

## 其他 CI 平台

除了 travis-ci，市面上还有其他很多 CI 平台，如：react 项目中使用的 [appveyor](https://www.appveyor.com/) 和 [CircleCi](https://circleci.com/) 等等。至于这些平台的对比则不是该文章的讨论范畴了。

# 代码规范篇

代码规范又是另一个话题了，但是目的都是为了提高代码的可控性，减少 bug 率。

## ESLint (`.eslintrc.*`, `.eslintignore`)

利用 ESLint 提供的若干规则，造出一份适合于自己或团队的代码规范配置，同时 .eslintignore 用 glob file 规则去忽略文件

## Prettier (`.prettierrc`, `.prettierignore`)

[Prettier](https://github.com/prettier/prettier) 只是用来纯粹美化代码。

# 工具篇

## CodeCov (`.codecov.yml`)

一个好的工程，离不开一系列的测试，CodeCov 则是用来报告测试中代码覆盖率的工具

## Babel (`.babelrc`, `.babelignore`)
## NPM (`.npmrc`)

这俩兄弟不多做解释了，前端都知道~

# 其他

## `.editorconfig`

http://editorconfig.org/  
我们在不同编辑器，不同系统平台编写同一项目代码时，常常会遇到代码格式不统一的问题，该文件则是用来抹去这种差异！

# 结

以上便是比较常用的一些javascript项目的配置文件说明，后续还会不断添加，欢迎大家伙指正添加。

# 参考

- \[1\] [用 GitLab CI 进行持续集成](https://scarletsky.github.io/2016/07/29/use-gitlab-ci-for-continuous-integration/)
- \[2\] [travis-ci: Customizing the Build](https://docs.travis-ci.com/user/customizing-the-build/)
- \[3\] [travis-ci: Deployment](https://docs.travis-ci.com/user/deployment/)