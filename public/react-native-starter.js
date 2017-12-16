webpackJsonp([30,90],{1033:function(n,a){n.exports={content:'<p><strong>注：本文暂无逻辑</strong></p>\n<h2 id="移动端app分类"><a href="#%E7%A7%BB%E5%8A%A8%E7%AB%AFapp%E5%88%86%E7%B1%BB" aria-hidden="true"><span class="icon icon-link"></span></a>移动端App分类</h2>\n<img src="http://img.blog.csdn.net/20160326162834667" alt="" width="700" height="368" />\n<ul>\n<li>\n<p>Web(正在用的): </p>\n<ul>\n<li>优：开发效率高，成本低，纯前端就能搞定，跨平台</li>\n<li>劣：基于Web Dom渲染，运行效率底，用户体验不佳, 本地接口局限</li>\n</ul>\n</li>\n<li>\n<p>Native:</p>\n<ul>\n<li>\n<p>优：用户体验佳，充分使用本地接口</p>\n</li>\n<li>\n<p>劣：开发效率低(需编译)，成本高，纯前端就能搞定</p>\n</li>\n</ul>\n</li>\n<li>\n<p>Hybrid</p>\n<ul>\n<li>\n<p>优：js作为native, webview的桥梁，各尽其职</p>\n</li>\n<li>\n<p>劣：前端与端上开发人员耦合严重，成本高，开发效率低</p>\n</li>\n</ul>\n</li>\n</ul>\n<h2 id="基础"><a href="#%E5%9F%BA%E7%A1%80" aria-hidden="true"><span class="icon icon-link"></span></a>基础</h2>\n<ol>\n<li>React  <a href="http://reactjs.cn/react/docs/getting-started-zh-CN.html">中文</a>  <a href="https://facebook.github.io/react/docs/hello-world.html">英文</a></li>\n<li><a href="http://www.ruanyifeng.com/blog/2015/03/react.html">React入门</a></li>\n<li>Redux*(React数据管理)</li>\n</ol>\n<h2 id="文档"><a href="#%E6%96%87%E6%A1%A3" aria-hidden="true"><span class="icon icon-link"></span></a>文档</h2>\n<ol>\n<li><a href="https://reactnative.cn/docs/0.39/getting-started.html">中文</a></li>\n<li><a href="https://facebook.github.io/react-native/docs/getting-started.html">英文</a></li>\n</ol>\n<h2 id="工具"><a href="#%E5%B7%A5%E5%85%B7" aria-hidden="true"><span class="icon icon-link"></span></a>工具</h2>\n<p>以mac开发Android为例</p>\n<ol>\n<li><a href="https://developer.android.com/studio/install.html">Android Studio</a></li>\n<li><a href="https://www.npmjs.com/package/react-native-cli">react-native-cli</a></li>\n<li><a href="https://www.zhihu.com/question/31360766">Homebrew设置代理</a></li>\n<li><a href="https://gist.github.com/tomysmile/a9a7aee85ff73454bd57e198ad90e614">jdk</a></li>\n<li>...</li>\n</ol>\n<h2 id="使用中"><a href="#%E4%BD%BF%E7%94%A8%E4%B8%AD" aria-hidden="true"><span class="icon icon-link"></span></a>使用中</h2>\n<ol>\n<li>\n<p><code>React Native</code>将babel内置，无需关心语法兼容问题，随意使用<code>es6/7</code></p>\n</li>\n<li>\n<p>采用flexbox布局</p>\n<ul>\n<li><a href="http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html">教程一</a></li>\n<li><a href="http://www.ruanyifeng.com/blog/2015/07/flex-examples.html">教程二</a></li>\n</ul>\n</li>\n<li>\n<p>App相当于SPA, <a href="https://reactnative.cn/docs/0.39/navigator.html#content">Navigator</a>控制路由</p>\n</li>\n<li>\n<p><a href="https://github.com/moyuyc/injnu-app">iNjnu App</a><br>\n<a href="https://github.com/moyuyc/injnu-server">服务端：node + json web tokens</a></p>\n<ul>\n<li>真机运行截图</li>\n</ul>\n<img src="http://obu9je6ng.bkt.clouddn.com/FuH-0ZSzgnT3jWrifGkZ3fqyyJal?imageslim" alt="ClipboardImage" width="1080" height="1920" />\n<img src="http://obu9je6ng.bkt.clouddn.com/Fkw5Ho1U9pEtmSM1pZQYnAdRS-Gw?imageslim" alt="ClipboardImage" width="1080" height="1920" />\n<img src="http://obu9je6ng.bkt.clouddn.com/Fl0Q8TZ2lio3KCUQmMBpXD_WqCIa?imageslim" alt="ClipboardImage" width="1080" height="1920" />\n<img src="http://obu9je6ng.bkt.clouddn.com/FjEQHKAZVBkn9NfPqCjWg_D7JMak?imageslim" alt="ClipboardImage" width="1080" height="1920" />\n<img src="http://obu9je6ng.bkt.clouddn.com/FoGBVVpfz7K5C4S5kOpvoP72u8Ud?imageslim" alt="ClipboardImage" width="1080" height="1920" />\n</li>\n<li>\n<p>利用git，部署技巧<br>\n每次在本机修改完后端代码，push到github后，如何快速部署?(无需登录服务器)<br>\n后端入口(<code>nodejs</code>)</p>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript"><span class="hljs-keyword">var</span> cp = <span class="hljs-built_in">require</span>(<span class="hljs-string">\'child_process\'</span>)\n<span class="hljs-keyword">var</span> p = <span class="hljs-built_in">require</span>(<span class="hljs-string">\'path\'</span>)\n<span class="hljs-keyword">var</span> fs = <span class="hljs-built_in">require</span>(<span class="hljs-string">\'fs\'</span>)\n\nfs.watch(__dirname, (type, filename) => {\n    <span class="hljs-comment">// 监控js文件修改，修改后重启node服务</span>\n    <span class="hljs-keyword">if</span>(!filename.endsWith(<span class="hljs-string">".js"</span>)) {\n        <span class="hljs-keyword">return</span>;\n    }\n    serverProcess.kill(<span class="hljs-string">\'SIGINT\'</span>)\n    serverProcess = runServer()\n})\n\n<span class="hljs-keyword">var</span> serverProcess = runServer()\n\n<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">runServer</span>(<span class="hljs-params"></span>) </span>{\n    <span class="hljs-comment">// index.js 是真正的服务端代码入口</span>\n    <span class="hljs-keyword">return</span> cp.fork(<span class="hljs-string">\'./index.js\'</span>, process.argv, {<span class="hljs-attr">stdio</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-string">\'ipc\'</span>]})\n}</code></pre>\n<p><code>index.js</code>中有下面片段代码</p>\n<pre><code data-query="{}" data-lang="">app.all(\'/pull\', (req, res) => {\n    res.writeHead(200, {\n        \'Content-Type\': \'text/event-stream\',\n        \'Cache-Control\': \'no-cache\',\n        \'Connection\': \'keep-alive\'\n    });\n    var ls = require(\'child_process\').spawn(\'git\', [\'pull\', \'origin\', \'master\'])\n    ls.stdout.on(\'data\', (data) => {\n        data = data.toString()\n        console.log(data)\n        res.write(`${data}`);\n    });\n\n    ls.stderr.on(\'data\', (data) => {\n        data = data.toString()\n        console.log(data)\n        res.write(`${data}`);\n    });\n    ls.on(\'close\', (code) => {\n        console.log(`child process exited with code ${code}`)\n        res.end(`child process exited with code ${code}`);\n    });\n})\n</code></pre>\n<p><code>push.sh</code>脚本</p>\n<pre><code class="hljs language-bash" data-query="{}" data-lang="bash"><span class="hljs-meta">#!/usr/bin/env bash\n</span>\nmsg=<span class="hljs-string">"from bash"</span>\n<span class="hljs-keyword">if</span> [ -n <span class="hljs-string">"<span class="hljs-variable">$1</span>"</span> ]; <span class="hljs-keyword">then</span>\n    msg=<span class="hljs-variable">$1</span>\n<span class="hljs-keyword">fi</span>\n\ngit add .\ngit commit -m <span class="hljs-string">"<span class="hljs-variable">$msg</span>"</span>\ngit push origin master\n\n<span class="hljs-comment"># 服务器执行 `git pull origin master`</span>\n<span class="hljs-comment"># 从而更新js代码，继而重启服务器</span>\ncurl http://202.119.104.195/pull</code></pre>\n</li>\n</ol>\n<h2 id="总结"><a href="#%E6%80%BB%E7%BB%93" aria-hidden="true"><span class="icon icon-link"></span></a>总结</h2>\n<p>传统的<code>react native</code>使得前端开发高性能移动端App成为可能。\n但距离自由地开发App(需要掌握原生App开发)还有很远，目前本人只停留在<a href="https://js.coach/">jscoach</a>中寻找组件进行开发。\n而且！<code>react native</code>的代码检错与报错不太友好。</p>\n<h2 id="更多"><a href="#%E6%9B%B4%E5%A4%9A" aria-hidden="true"><span class="icon icon-link"></span></a>更多</h2>\n<ul>\n<li><a href="http://blog.csdn.net/zlts000/article/details/50987265">移动端App介绍</a></li>\n<li><a href="https://github.com/attentiveness/reading">iReading App: react-native+redux, android+ios</a></li>\n<li><a href="http://www.jianshu.com/p/7f32660359ef">react native的几种常见报错</a></li>\n</ul>\n',extra:{}}}});