webpackJsonp([51,90],{1012:function(n,e){n.exports={content:'<!-- # linux C一周学习 & node c addon -->\n<p>还记得大一懵懂的时候，第一门专业课便是C语言了，当时都没接触过编程，而且用的是win32，老师也讲的就是一些<code>if while</code>语法知识，指针数组等等。</p>\n<p>没有涉及到linux系统调用函数，不过也理所当然，因为当时根本对操作系统，汇编，计算机系统等一概不懂，讲了也只是换来更多的懵逼脸。</p>\n<p>那三年后的我，为什么又重新学习C呢？  </p>\n<!--more-->\n<p>因为大四还有一门tcp/ip网络编程，老师和书本是基于<code>unix socket</code>和<code>winsocket</code>的。其实在大三网络课里面，老师就有要求完成一个tcp和udp的聊天程序，当时用的是<code>nodejs</code>的<code>net package</code>. 使用node完成的可就简单了，net包为你实现了请求的队列和一套异步编程api。</p>\n<p><strong>但在c中，socket只是一个位于tcp/udp之上的一层，多请求的处理，你可以采用多进程/多线程，也可以采用单进程轮询处理（往往搭配非阻塞IO）；IO操作你也可以使用阻塞和非阻塞，随你喜欢。</strong></p>\n<p>但这些名词，只有在你理解了计算机系统后才能运用自如。</p>\n<p>而且C也可以与node结合起来，参看<a href="https://github.com/nodejs/node-addon-examples/">node addon</a>，所以之后遇到计算量大和趋向底层的活，完全可以交给c实现。</p>\n<p>于是乎，我便开始了学习linux c之旅。</p>\n<h2 id="疑难总结"><a href="#%E7%96%91%E9%9A%BE%E6%80%BB%E7%BB%93" aria-hidden="true"><span class="icon icon-link"></span></a>疑难总结</h2>\n<ol>\n<li><code>char* a = "123";</code>与 <code>char b[] = "123";</code><br>\n在执行<code>char* a = "123";</code>时，编译器会把<code>"123"</code>当成字符串常量，而a指向的正式<code>\'a\'</code>的地址，而字符串的结束标志为<code>\'\\0\'</code>. 这就是为什么不能<code>strcat(a, b)</code>, 因为a指向的是常量字符串。<br>\n那么下面这段程序执行时什么结果呢？</li>\n</ol>\n<pre><code class="hljs language-c" data-query="{}" data-lang="c"><span class="hljs-keyword">char</span>* x = <span class="hljs-string">"123"</span>;\n<span class="hljs-keyword">char</span> y[] = <span class="hljs-string">"123"</span>;\n<span class="hljs-built_in">printf</span>(<span class="hljs-string">"%s %s %d %d %d\\n"</span>, <span class="hljs-built_in">strcat</span>(y, x), y, <span class="hljs-keyword">sizeof</span>(y), <span class="hljs-built_in">strlen</span>(y), <span class="hljs-keyword">sizeof</span>(x));\n<span class="hljs-comment">// 123123 123123 4 6 8</span></code></pre>\n<ol start="2">\n<li><code>char** s;</code> 二级指针</li>\n</ol>\n<pre><code class="hljs language-c" data-query="{}" data-lang="c"><span class="hljs-keyword">char</span>  **s;  \n*s = <span class="hljs-string">"hello world"</span>; </code></pre>\n<p>上面这段程序是有错的，因为没有给s分配空间,也就是s指向（值）为空（不可读写），\n<code>malloc</code>之后，s指向一个可以读写的内存块。</p>\n<p>更多参看 <a href="http://blog.csdn.net/daiyutage/article/details/8604720">http://blog.csdn.net/daiyutage/article/details/8604720</a></p>\n<h2 id="知识总结"><a href="#%E7%9F%A5%E8%AF%86%E6%80%BB%E7%BB%93" aria-hidden="true"><span class="icon icon-link"></span></a>知识总结</h2>\n<ol>\n<li>\n<p>网络编程  </p>\n<ol>\n<li>如何知道服务器或者客户端断开了连接？（read() == 0）</li>\n<li>处理多请求的俩种服务器实现（fork/select）</li>\n<li>\n<p>一些"奇怪"现象的解释</p>\n<ol>\n<li>主动关闭连接的一方要处于TIME_WAIT状态，等待两个MSL（maximum segment lifetime）的时间后才能回到CLOSED状态 </li>\n<li>网络服务器通常用fork来同时服务多个客户端，父进程专门负责监听端口，每次accept一个新的客户端连接就fork出一个子进程专门服务这个客户端。但是子进程退出时会产生僵尸进程，父进程要注意处理SIGCHLD信号和调用wait清理僵尸进程。</li>\n<li>server对每个请求只处理一次，应答后就关闭连接，client不能继续使用这个连接发送数据。但是client下次循环时又调用write发数据给server，write调用只负责把数据交给TCP发送缓冲区就可以成功返回了，所以不会出错，而server收到数据后应答一个RST段，client收到RST段后无法立刻通知应用层，只把这个状态保存在TCP协议层。client下次循环又调用write发数据给server，由于TCP协议层已经处于RST状态了，因此不会将数据发出，而是发一个SIGPIPE信号给应用层，SIGPIPE信号的缺省处理动作是终止程序</li>\n</ol>\n</li>\n</ol>\n</li>\n<li>\n<p>进程</p>\n<ol>\n<li>shell的工作方式，fork -> exec</li>\n<li>fork与exec</li>\n<li>shell的实现，改变current work path, 实现pipe与输入输出重定向</li>\n<li>...</li>\n</ol>\n</li>\n<li>\n<p>文件系统</p>\n<ol>\n<li>erverything is file</li>\n<li>dup与dup2运用, 重定向</li>\n<li>link/ln  stat/lstat</li>\n<li>...</li>\n</ol>\n</li>\n<li>库函数与系统函数</li>\n</ol>\n<h2 id="编码实践"><a href="#%E7%BC%96%E7%A0%81%E5%AE%9E%E8%B7%B5" aria-hidden="true"><span class="icon icon-link"></span></a>编码实践</h2>\n<p>学的虽然挺多的，但是需要做的东西出来才能掌握。\n1. c实现shell (掌握linux内核函数，进程管道通信，文件描述符等概念)<br>\n<a href="https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/shell.h">source file</a></p>\n<ol start="2">\n<li>\n<p>tcp双向通信 (select()/fork()两种方式)<br>\n<a href="https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/server.h">source file Server</a><br>\n<a href="https://github.com/moyuyc/c_cpp-node_c_cpp_addon/blob/master/cpp_src/client.h">source file Client</a></p>\n</li>\n<li>\n<p>node addon(node调用c/c++)<br>\n<a href="https://github.com/moyuyc/c_cpp-node_c_cpp_addon/tree/master/node_src">source file</a></p>\n</li>\n</ol>\n<h2 id="闲话"><a href="#%E9%97%B2%E8%AF%9D" aria-hidden="true"><span class="icon icon-link"></span></a>闲话</h2>\n<p>上面简单总结了一下知识和成果，我觉得学习linux c是十分必要的，可以将整个计算机系统理论串联起来，而且后续有必要的话，完全可以重零开始，自己造轮子。</p>\n<p>然后推荐两个项目，都是用linux c写的\n1. <a href="https://github.com/EZLippi/Tinyhttpd">TinyHttpd</a><br>\n500+行代码实现一个小型web服务器，助于理解web 服务器本质，而不再是只会使用现成的web服务器。代码不多，便于学习。</p>\n<ol start="2">\n<li><a href="https://github.com/posva/catimg">catimg</a><br>\n将图片print在shell中，便于学习unix字符转义，shell窗口控制，图像处理</li>\n</ol>\n<p>最后力荐一本电子书<a href="http://akaedu.github.io/book/">【Linux C编程一站式学习】</a>，学习linux C就靠它！</p>\n',extra:{}}}});