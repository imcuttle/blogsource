webpackJsonp([8,90],{1055:function(s,n){s.exports={content:'<script>\nHTMLElement.prototype.findParentByTag = function(tag){\n\tvar p = this.parentElement;\n\twhile(p.tagName!=tag) p = p.parentElement;\n\treturn p;\n}\nHTMLElement.prototype.type = function(op){\n\top = Object.extend({\n\t\tdelay:25,\n\t\tdest:this,\n\t\ttwinkle:\'|\'\n\t},op);\n\tvar chain = makeChain(this),f=false,html=\'\';\n\tconsole.log(chain);\n\tvar dest = op.dest;\n\tdest.innerHTML=\'\';\n\tvar time = setInterval(function(){\n\t\tvar str = chain.shift();\n\t\twhile(str.length>1){\n\t\t\thtml+=str;\n\t\t\tdest.innerHTML=html;\n\t\t\tstr = chain.shift();\n\t\t\tif(!chain.length){ \n\t\t\t\tclearInterval(time);\n\t\t\t\treturn;\n\t\t\t}\n\t\t}\n\t\thtml+=str;\n\t\tif(!chain.length){ \n\t\t\tdest.innerHTML=html\n\t\t\tclearInterval(time);\n\t\t\treturn;\n\t\t}\n\t\tdest.innerHTML=html+(f?op.twinkle:\' \');\n\t\tf=!f;\n\t},op.delay);\n\tfunction makeChain(node){\n\t\tvar nodes = node.childNodes;\n\t\tvar chain = [];\n\t\tfor(var i=0;i < nodes.length;i++){\n\t\t\tvar ne = nodes[i];\n\t\t\tif(ne.nodeType==1){\n\t\t\t\tif(ne.tagName==\'SCRIPT\'){\n\t\t\t\t\tchain.push(ne.outerHTML);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tvar str = ne.cloneNode().outerHTML;\n\t\t\t\tvar last = str.lastIndexOf(\'<\');\n\t\t\t\tchain.push(str.substring(0,last));\n\t\t\t\tchain = chain.concat(arguments.callee(ne));\n\t\t\t\tchain.push(str.substring(last));\n\t\t\t}else if(ne.nodeType==3){\n\t\t\t\tvar arr = ne.textContent.match(/(\\s+|[^\\s])/g);\n\t\t\t\tif(arr)\tchain = chain.concat(arr);\n\t\t\t}\n\t\t}\n\t\treturn chain;\n\t}\n}\nObject.extend = function(){\n\tif(!arguments || !arguments.length) return {};\n\tvar rlt = arguments[0];\n\tfor(var i=0;i<arguments.length;i++){\n\t\tvar argu = arguments[i];\n\t\tfor(var k in argu)\n\t\t\trlt[k] = argu[k];\n\t}\n\treturn rlt;\n}\nfunction typeHandle(ele){\n\tele.type({\n\t\tdelay:100,\n\t\tdest:ele,\n\t\ttwinkle:\'_\'\n\t});\n}\n</script>\n<p class=\'text-center\'><button class=\'btn\' onclick="typeHandle(this.findParentByTag(\'ARTICLE\'))">Click Me! Magic</button></p>\n<img src=\'/avatar-right.jpg\'/>\n<p class=\'text-center\'><input placeholder=\'input!\' /></p>\n<h1 id="好像挺好玩的哈"><a href="#%E5%A5%BD%E5%83%8F%E6%8C%BA%E5%A5%BD%E7%8E%A9%E7%9A%84%E5%93%88" aria-hidden="true"><span class="icon icon-link"></span></a>好像挺好玩的哈</h1>\n<!-- more -->\n<table>\n<thead>\n<tr>\n<th>项目</th>\n<th align="right">价格</th>\n<th align="center">数量</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>计算机</td>\n<td align="right">\\$1600</td>\n<td align="center">5</td>\n</tr>\n<tr>\n<td>手机</td>\n<td align="right">\\$12</td>\n<td align="center">12</td>\n</tr>\n<tr>\n<td>管线</td>\n<td align="right">\\$1</td>\n<td align="center">234</td>\n</tr>\n</tbody>\n</table>\n<h1 id="借鉴了两份代码"><a href="#%E5%80%9F%E9%89%B4%E4%BA%86%E4%B8%A4%E4%BB%BD%E4%BB%A3%E7%A0%81" aria-hidden="true"><span class="icon icon-link"></span></a>借鉴了两份代码</h1>\n<ul>\n<li>jQuery版本</li>\n</ul>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript">(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params">a</span>) </span>{\n    a.fn.typewriter = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{\n        <span class="hljs-keyword">this</span>.each(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{\n            <span class="hljs-keyword">var</span> d = a(<span class="hljs-keyword">this</span>), c = d.html(), b = <span class="hljs-number">0</span>;\n            d.show();\n            d.html(<span class="hljs-string">""</span>);\n            <span class="hljs-keyword">var</span> e = setInterval(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{\n                <span class="hljs-keyword">var</span> f = c.substr(b, <span class="hljs-number">1</span>);\n                <span class="hljs-keyword">if</span> (f == <span class="hljs-string">"&#x3C;"</span>) {\n                    b = c.indexOf(<span class="hljs-string">">"</span>, b) + <span class="hljs-number">1</span>\n                } <span class="hljs-keyword">else</span> {\n                    b++\n                }\n                d.html(c.substring(<span class="hljs-number">0</span>, b) + (b &#x26; <span class="hljs-number">1</span> ? <span class="hljs-string">"_"</span> : <span class="hljs-string">""</span>));\n                <span class="hljs-keyword">if</span> (b >= c.length) {\n                    clearInterval(e)\n                }\n            }, <span class="hljs-number">75</span>)\n        });\n        <span class="hljs-keyword">return</span> <span class="hljs-keyword">this</span>\n    }\n})(jQuery);</code></pre>\n<ul>\n<li>原生JS版本</li>\n</ul>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">Typing</span>(<span class="hljs-params">opts</span>) </span>{\n    <span class="hljs-keyword">this</span>.version = <span class="hljs-string">\'1.1\'</span>;\n    <span class="hljs-keyword">this</span>.source = opts.source;\n    <span class="hljs-keyword">this</span>.output = opts.output;\n    <span class="hljs-keyword">this</span>.delay = opts.delay || <span class="hljs-number">120</span>;\n    <span class="hljs-keyword">this</span>.chain = {\n        <span class="hljs-attr">parent</span>: <span class="hljs-literal">null</span>,\n        <span class="hljs-attr">dom</span>: <span class="hljs-keyword">this</span>.output,\n        <span class="hljs-attr">val</span>: []\n    }\n}\n\nTyping.fn = Typing.prototype = {\n    <span class="hljs-attr">toArray</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">eles</span>) </span>{\n        <span class="hljs-comment">//Array.prototype.slice;</span>\n        <span class="hljs-keyword">var</span> result = [];\n        <span class="hljs-keyword">for</span> (<span class="hljs-keyword">var</span> i = <span class="hljs-number">0</span>; i &#x3C; eles.length; i++) {\n            result.push(eles[i]);\n        }\n        <span class="hljs-keyword">return</span> result;\n    },\n    <span class="hljs-attr">init</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{\n        <span class="hljs-keyword">this</span>.chain.val = <span class="hljs-keyword">this</span>.convert(<span class="hljs-keyword">this</span>.source, <span class="hljs-keyword">this</span>.chain.val);\n    },\n    <span class="hljs-attr">convert</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">dom, arr</span>) </span>{\n        <span class="hljs-keyword">var</span> that = <span class="hljs-keyword">this</span>,\n            children = <span class="hljs-keyword">this</span>.toArray(dom.childNodes);\n\n        children.forEach(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">node</span>) </span>{\n            <span class="hljs-keyword">if</span> (node.nodeType === <span class="hljs-number">3</span>) {\n                arr = arr.concat(node.nodeValue.split(<span class="hljs-string">\'\'</span>));\n            } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (node.nodeType === <span class="hljs-number">1</span>) {\n                <span class="hljs-keyword">var</span> val = [];\n                val = that.convert(node, val);\n                arr.push({\n                    <span class="hljs-string">\'dom\'</span>: node,\n                    <span class="hljs-string">\'val\'</span>: val\n                });\n            }\n        });\n\n        <span class="hljs-keyword">return</span> arr;\n    },\n    <span class="hljs-attr">print</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">dom, val, callback</span>) </span>{\n        setTimeout(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{\n            dom.appendChild(<span class="hljs-built_in">document</span>.createTextNode(val));\n            callback();\n        }, <span class="hljs-keyword">this</span>.delay);\n    },\n    <span class="hljs-attr">play</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">ele</span>) </span>{\n        <span class="hljs-keyword">if</span> (!ele) <span class="hljs-keyword">return</span>;\n        <span class="hljs-keyword">if</span> (!ele.val.length &#x26;&#x26; ele.parent) <span class="hljs-keyword">this</span>.play(ele.parent);\n        <span class="hljs-keyword">if</span> (!ele.val.length) <span class="hljs-keyword">return</span>;\n\n        <span class="hljs-keyword">var</span> curr = ele.val.shift();\n        <span class="hljs-keyword">var</span> that = <span class="hljs-keyword">this</span>;\n\n        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">typeof</span> curr === <span class="hljs-string">\'string\'</span>) {\n            <span class="hljs-keyword">this</span>.print(ele.dom, curr, <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{\n                <span class="hljs-keyword">if</span> (ele.val.length) {\n                    that.play(ele);\n                } <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (ele.parent) {\n                    that.play(ele.parent);\n                }\n            });\n        } <span class="hljs-keyword">else</span> {\n            <span class="hljs-keyword">var</span> dom = <span class="hljs-built_in">document</span>.createElement(curr.dom.nodeName);\n            <span class="hljs-keyword">var</span> attrs = that.toArray(curr.dom.attributes);\n            attrs.forEach(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">attr</span>) </span>{\n                dom.setAttribute(attr.name, attr.value);\n            });\n            ele.dom.appendChild(dom);\n            curr.parent = ele;\n            curr.dom = dom;\n            <span class="hljs-keyword">this</span>.play(curr.val.length ? curr : curr.parent);\n        }\n    },\n    <span class="hljs-attr">start</span>: <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>) </span>{\n        <span class="hljs-keyword">this</span>.init();\n        <span class="hljs-keyword">this</span>.play(<span class="hljs-keyword">this</span>.chain);\n    }\n}</code></pre>\n<h1 id="之我见"><a href="#%E4%B9%8B%E6%88%91%E8%A7%81" aria-hidden="true"><span class="icon icon-link"></span></a>之我见</h1>\n<ul>\n<li>第一份jQuery版本，只是对<code>\'&#x3C;\'</code>,<code>\'>\'</code>两个特殊的字符串进行了判断处理，如果打印那种代码文本时将会有误。</li>\n<li>第二份原生JS代码，将元素的孩子结点都进行了处理，这是一种很好的方法，但是，他的数据结构有些复杂化了，有</li>\n</ul>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript">{\n\t<span class="hljs-attr">parent</span>: <span class="hljs-literal">null</span>,\n\t<span class="hljs-attr">dom</span>: <span class="hljs-keyword">this</span>.output,\n\t<span class="hljs-attr">val</span>: []\n}</code></pre>\n<p>对于那种标签嵌套比较严重和多余的文本结点较多的html处理起来不太美好。</p>\n<h1 id="之我改"><a href="#%E4%B9%8B%E6%88%91%E6%94%B9" aria-hidden="true"><span class="icon icon-link"></span></a>之我改</h1>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript">HTMLElement.prototype.type = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">op</span>)</span>{\n\top = <span class="hljs-built_in">Object</span>.extend({\n\t\t<span class="hljs-attr">delay</span>:<span class="hljs-number">25</span>,\n\t\t<span class="hljs-attr">dest</span>:<span class="hljs-keyword">this</span>,\n\t\t<span class="hljs-attr">twinkle</span>:<span class="hljs-string">\'|\'</span>\n\t},op);\n\t<span class="hljs-keyword">var</span> chain = makeChain(<span class="hljs-keyword">this</span>),f=<span class="hljs-literal">false</span>,html=<span class="hljs-string">\'\'</span>;\n\t<span class="hljs-built_in">console</span>.log(chain);\n\t<span class="hljs-keyword">var</span> dest = op.dest;\n\tdest.innerHTML=<span class="hljs-string">\'\'</span>;\n\t<span class="hljs-keyword">var</span> time = setInterval(<span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{\n\t\t<span class="hljs-keyword">var</span> str = chain.shift();\n\t\t<span class="hljs-keyword">while</span>(str.length><span class="hljs-number">1</span>){\n\t\t\thtml+=str;\n\t\t\tdest.innerHTML=html;\n\t\t\tstr = chain.shift();\n\t\t\t<span class="hljs-keyword">if</span>(!chain.length){ \n\t\t\t\tclearInterval(time);\n\t\t\t\t<span class="hljs-keyword">return</span>;\n\t\t\t}\n\t\t}\n\t\thtml+=str;\n\t\t<span class="hljs-keyword">if</span>(!chain.length){ \n\t\t\tdest.innerHTML=html\n\t\t\tclearInterval(time);\n\t\t\t<span class="hljs-keyword">return</span>;\n\t\t}\n\t\tdest.innerHTML=html+(f?op.twinkle:<span class="hljs-string">\' \'</span>);\n\t\tf=!f;\n\t},op.delay);\n\t<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">makeChain</span>(<span class="hljs-params">node</span>)</span>{\n\t\t<span class="hljs-keyword">var</span> nodes = node.childNodes;\n\t\t<span class="hljs-keyword">var</span> chain = [];\n\t\t<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> i=<span class="hljs-number">0</span>;i &#x3C; nodes.length;i++){\n\t\t\t<span class="hljs-keyword">var</span> ne = nodes[i];\n\t\t\t<span class="hljs-keyword">if</span>(ne.nodeType==<span class="hljs-number">1</span>){\n\t\t\t\t<span class="hljs-keyword">if</span>(ne.tagName==<span class="hljs-string">\'SCRIPT\'</span>){\n\t\t\t\t\tchain.push(ne.outerHTML);\n\t\t\t\t\t<span class="hljs-keyword">continue</span>;\n\t\t\t\t}\n\t\t\t\t<span class="hljs-keyword">var</span> str = ne.cloneNode().outerHTML;\n\t\t\t\t<span class="hljs-keyword">var</span> last = str.lastIndexOf(<span class="hljs-string">\'&#x3C;\'</span>);\n\t\t\t\tchain.push(str.substring(<span class="hljs-number">0</span>,last));\n\t\t\t\tchain = chain.concat(<span class="hljs-built_in">arguments</span>.callee(ne));\n\t\t\t\tchain.push(str.substring(last));\n\t\t\t}<span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span>(ne.nodeType==<span class="hljs-number">3</span>){\n\t\t\t\t<span class="hljs-keyword">var</span> arr = ne.textContent.match(<span class="hljs-regexp">/(\\s+|[^\\s])/g</span>);\n\t\t\t\t<span class="hljs-keyword">if</span>(arr)\tchain = chain.concat(arr);\n\t\t\t}\n\t\t}\n\t\t<span class="hljs-keyword">return</span> chain;\n\t}\n}\n<span class="hljs-built_in">Object</span>.extend = <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params"></span>)</span>{\n\t<span class="hljs-keyword">if</span>(!<span class="hljs-built_in">arguments</span> || !<span class="hljs-built_in">arguments</span>.length) <span class="hljs-keyword">return</span> {};\n\t<span class="hljs-keyword">var</span> rlt = <span class="hljs-built_in">arguments</span>[<span class="hljs-number">0</span>];\n\t<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> i=<span class="hljs-number">0</span>;i&#x3C;<span class="hljs-built_in">arguments</span>.length;i++){\n\t\t<span class="hljs-keyword">var</span> argu = <span class="hljs-built_in">arguments</span>[i];\n\t\t<span class="hljs-keyword">for</span>(<span class="hljs-keyword">var</span> k <span class="hljs-keyword">in</span> argu)\n\t\t\trlt[k] = argu[k];\n\t}\n\t<span class="hljs-keyword">return</span> rlt;\n}</code></pre>\n<p>我吸取了前面两者的优点，比如第一份代码的简单直接，第二份代码的子节点遍历与递归的思路，\n进一步的解决了前面两者的缺陷。\n1. 对无实际意义的文本结点（如 <code>" 12 \\n sx "</code> ）进行优化处理，处理为[\'   \',\'1\',\'2\',\' \\n \',\'s\',\'x\',\' \']\nvar arr = ne.textContent.match(/(\\s+|[^\\s.])/g);\nif(arr)\tchain = chain.concat(arr);\n2. 对 <code>script</code> 标签进行优化处理，统一打印文字的节奏\nif(ne.tagName==\'SCRIPT\'){\nchain.push(ne.outerHTML);\ncontinue;\n}\n3. 避免了打印代码块的错误\n因为代码中分别对 <code>nodeType == 1</code> 和 <code>nodeType == 3</code> 进行了不同的处理，\n可以根据 <code>chain</code> 中元素的长度判断是否为文本节点</p>\n<h1 id="之我版"><a href="#%E4%B9%8B%E6%88%91%E7%89%88" aria-hidden="true"><span class="icon icon-link"></span></a>之我版</h1>\n<p class=\'text-center\'>[fork it！](https://github.com/moyuyc/typemagic)</p>\n',extra:{}}}});