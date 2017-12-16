webpackJsonp([37,90],{1026:function(s,n){s.exports={content:'<h1 id="前言"><a href="#%E5%89%8D%E8%A8%80" aria-hidden="true"><span class="icon icon-link"></span></a>前言</h1>\n<p>本文介绍了<code>node</code>中<code>net</code>包使用，以及相关SMTP的知识。</p>\n<!--more-->\n<h1 id="知识介绍"><a href="#%E7%9F%A5%E8%AF%86%E4%BB%8B%E7%BB%8D" aria-hidden="true"><span class="icon icon-link"></span></a>知识介绍</h1>\n<img src="http://obu9je6ng.bkt.clouddn.com/Fv9jmxVALM06sFrlJUAlys62qFjW?imageslim" alt="ClipboardImage" width="1077" height="661" />\n> 如图,电子邮件服务的实现结构，我这里主要讲的是红色圆圈的内容。\n<p>下面是一次客户端成功发送QQ邮件的服务器响应和客户端请求的全过程。<strong>（数字开头的即为服务器响应）</strong></p>\n<pre><code data-query="{}" data-lang="">HELO moyu\n\n220 smtp.qq.com Esmtp QQ Mail Server\n\n250 smtp.qq.com\n\nAUTH LOGIN\n\n334 VXNlcm5hbWU6\n\nxxxxxxxxxxxxxxxxxxxx  #隐私内容，经过base64编码的用户名\n\n334 UGFzc3dvcmQ6\n\nxxxxxxxxxxxxxxxxxxx  #隐私内容，经过base64编码的密码\n\n235 Authentication successful\n\nMAIL FROM:492899414@qq.com\n\n250 Ok\n\nRCPT TO:492899414@qq.com\n\n250 Ok\n\nDATA\n\n354 End data with &#x3C;CR>&#x3C;LF>.&#x3C;CR>&#x3C;LF>\n\nFrom: Moyu\nSubject: Smtp Client implementation\nTo: 492899414@qq.com\nContent-Type: text/html\n\n&#x3C;h1>HELLO SMTP&#x3C;/h1>\n.\n\n\n250 Ok: queued as \n\nQUIT\n\n221 Bye\n</code></pre>\n<h1 id="代码"><a href="#%E4%BB%A3%E7%A0%81" aria-hidden="true"><span class="icon icon-link"></span></a>代码</h1>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript"><span class="hljs-keyword">var</span> net = <span class="hljs-built_in">require</span>(<span class="hljs-string">\'net\'</span>);\n<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">sendMail</span>(<span class="hljs-params">host,user,pwd,to,msg</span>) </span>{\n    <span class="hljs-keyword">var</span> socket = net.createConnection(<span class="hljs-number">25</span>,host);\n    <span class="hljs-comment">// 发送者用户名与密码需要base64编码发送</span>\n    <span class="hljs-keyword">var</span> user64 = <span class="hljs-keyword">new</span> Buffer(user).toString(<span class="hljs-string">"base64"</span>); \n    pwd  = <span class="hljs-keyword">new</span> Buffer(pwd ).toString(<span class="hljs-string">"base64"</span>); \n    socket.on(<span class="hljs-string">\'connect\'</span>,<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{\n        <span class="hljs-keyword">this</span>.write(<span class="hljs-string">\'HELO \'</span>+user+<span class="hljs-string">\'\\r\\n\'</span>);\n    });\n    <span class="hljs-keyword">var</span> wt = net.Socket.prototype.write;\n    socket.write = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{\n        <span class="hljs-built_in">console</span>.log(<span class="hljs-built_in">arguments</span>);\n        <span class="hljs-keyword">return</span> wt.apply(<span class="hljs-keyword">this</span>,<span class="hljs-built_in">arguments</span>);\n    }\n\n    <span class="hljs-keyword">var</span> op = [<span class="hljs-string">\'AUTH LOGIN\\r\\n\'</span>];\n    socket.pipe(process.stdout);\n    socket.on(<span class="hljs-string">\'data\'</span>,<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params">data</span>) </span>{\n        data = data.toString();\n        <span class="hljs-keyword">const</span> code = data.match(<span class="hljs-regexp">/^\\d{3}/</span>)[<span class="hljs-number">0</span>]\n        <span class="hljs-keyword">switch</span> (code){\n            <span class="hljs-keyword">case</span> <span class="hljs-string">\'250\'</span>:{\n                <span class="hljs-keyword">var</span> v = op.shift();\n                <span class="hljs-keyword">if</span>(v===<span class="hljs-string">\'AUTH LOGIN\\r\\n\'</span>){\n                    op.push(user64+<span class="hljs-string">\'\\r\\n\'</span>);\n                    op.push(pwd+<span class="hljs-string">\'\\r\\n\'</span>);\n                }<span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span>(v===<span class="hljs-string">\'RCPT TO:\'</span>+to+<span class="hljs-string">\'\\r\\n\'</span>){\n                    op.push(<span class="hljs-string">\'DATA\\r\\n\'</span>);\n                    op.push(msg+<span class="hljs-string">\'\\r\\n.\\r\\n\'</span>);\n                }\n                socket.write(v);\n                <span class="hljs-keyword">break</span>;\n            }\n            <span class="hljs-keyword">case</span> <span class="hljs-string">\'334\'</span>:{\n                <span class="hljs-keyword">var</span> v = op.shift();\n                socket.write(v);\n                <span class="hljs-keyword">if</span>(op.length===<span class="hljs-number">0</span>) op.push(<span class="hljs-string">\'MAIL FROM:\'</span>+user+<span class="hljs-string">\'\\r\\n\'</span>);\n                <span class="hljs-keyword">break</span>;\n            }\n            <span class="hljs-keyword">case</span> <span class="hljs-string">\'235\'</span>: socket.write(op.shift()); op.push(<span class="hljs-string">\'RCPT TO:\'</span>+to+<span class="hljs-string">\'\\r\\n\'</span>); <span class="hljs-keyword">break</span>;\n            <span class="hljs-keyword">case</span> <span class="hljs-string">\'221\'</span>: socket.end(); <span class="hljs-keyword">break</span>;\n            <span class="hljs-keyword">case</span> <span class="hljs-string">\'354\'</span>: socket.write(op.shift()); op.push(<span class="hljs-string">\'QUIT\'</span>+<span class="hljs-string">\'\\r\\n\'</span>); <span class="hljs-keyword">break</span>;\n            <span class="hljs-comment">// default : console.log(data);</span>\n        }\n    })\n}</code></pre>\n<p>调用</p>\n<pre><code class="hljs language-javascript" data-query="{}" data-lang="javascript">sendMail(\n    <span class="hljs-string">\'smtp.qq.com\'</span>,\n    <span class="hljs-string">\'492899414@qq.com\'</span>,\n    <span class="hljs-string">\'xxxxxxx\'</span>,\n    <span class="hljs-string">\'492899414@qq.com\'</span>,\n    <span class="hljs-string">"From: Moyu\\r\\n"</span>+\n    <span class="hljs-string">"Subject: Smtp Client implementation\\r\\n"</span>+\n    <span class="hljs-string">"To: 492899414@qq.com\\r\\n"</span>+\n    <span class="hljs-string">"Content-Type: text/html\\r\\n\\r\\n"</span>+ <span class="hljs-comment">// 两个\\r\\n作为与正式数据的分割</span>\n    <span class="hljs-string">"&#x3C;h1>Hello Moyu&#x3C;/h1>"</span>\n);</code></pre>\n<p>成功运行后，输出结果如下</p>\n<pre><code data-query="{}" data-lang="">{ \'0\': \'HELO 492899414@qq.com\\r\\n\' }\n220 smtp.qq.com Esmtp QQ Mail Server\n250 smtp.qq.com\n{ \'0\': \'AUTH LOGIN\\r\\n\' }\n334 VXNlcm5hbWU6\n{ \'0\': \'NDkyODk5NDE0QHFxLmNvbQ==\\r\\n\' }\n334 UGFzc3dvcmQ6\n{ \'0\': \'xxxxxxxxxxxxxxx\\r\\n\' }\n235 Authentication successful\n{ \'0\': \'MAIL FROM:492899414@qq.com\\r\\n\' }\n250 Ok\n{ \'0\': \'RCPT TO:492899414@qq.com\\r\\n\' }\n250 Ok\n{ \'0\': \'DATA\\r\\n\' }\n354 End data with &#x3C;CR>&#x3C;LF>.&#x3C;CR>&#x3C;LF>\n{ \'0\': \'From: Moyu\\r\\nSubject: Smtp Client implementation\\r\\nTo: 492899414@qq.com\\r\\nContent-Type: text/html\\r\\n\\r\\n&#x3C;h1>Hello Moyu&#x3C;/h1>\\r\\n.\\r\\n\' }\n250 Ok: queued as \n{ \'0\': \'QUIT\\r\\n\' }\n221 Bye\n</code></pre>\n<h1 id="总结"><a href="#%E6%80%BB%E7%BB%93" aria-hidden="true"><span class="icon icon-link"></span></a>总结</h1>\n<p>学习了node的相关网络编程，理解SMTP协议，自己造轮子。</p>\n',extra:{}}}});