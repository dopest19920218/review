# 基础

## 单双工通信、半双工通信、全双工通信的区别
1. 单双工通信 只允许一个方向的输送数据
2. 半双工通信 同一时间只允许一次输送数据
3. 全双工通信 同一时间你可以给我发送数据 我也可以给你发送数据

## 移动端适配方案
1. rem
2. vw vh

## rem的原理
根据屏幕宽度clientWidth去设置根元素(document.documentElement)的font-size，例如设计稿输出的基准是750px的宽度，那么公式可以是document.documentElement.clientWidth * 100 / 375，这样在手机375px宽度下1rem就等于100px，如果ui稿给定一个75px宽度的块，转换为css就是0.75rem。

## http

### http1.0 http1.x http2.0 的区别

#### http1.0
每一个请求都是一个TCP链接，TCP链接都要经过三次握手，频繁的建立TCP链接是很耗时的，而且对每个域名的链接数有限制，chrome下6-8个

#### http1.x
主要特性是keep-live 每个域名建立一个TCP链接，这样就不会有频繁建立和断开TCP链接的过程，http请求复用一个TCP链接。会有队头阻塞的问题：多个http请求可以并发请求，但是返回的顺序要按照请求的顺序一一返回，也就是说有一个请求发生阻塞，后面也都会阻塞

#### http2.0
主要的特性是多路复用、HPACK和服务端推送等
多路复用是指使用一个TCP链接，一个请求一个流，数据以二进制帧的形式在数据流中穿插输出数据，在最后根据stream Identify来拼装数据
HPACK是指头部压缩，可以减少头部信息的大小
服务端推送是指服务端可以主动推送资源到客户端

### http状态码
1. 200 请求成功
2. 301 永久重定向
3. 302 历史/临时重定向
4. 304 Not Modified 告诉浏览器用缓存资源
5. 400 Bad Request 一般是前端的参数有问题
6. 403 Forbidden 没有权限
7. 404 Not Found 没有找到资源
8. 500 服务端发生了错误
9. 502 Bad Gateway 中间服务层出现了错误
10. 504 Gateway Timeout 超时

1xx 信息响应
2xx 成功响应
3xx 重定向响应
4xx 客户端响应
5xx 服务端响应

### https和http的区别
https多了一层ssl加密，可以防止被运营商劫持和进一步保证链接的安全性

### https使用的什么加密的方式 过程是什么样的
在证书的交换过程用的是非对称加密
在数据传输过程用的是对称加密
具体过程：
1. 客户端 发起请求
2. 服务端 返回证书
3. 客户端 查看证书是否合法
4. 客户端 生成随机字符串
5. 客户端 用证书包含的公钥加密字符串，并把字符串保存下来
6. 客户端 发送加密字符串到服务端
7. 服务端 用私钥解密加密字符串
8. 服务端 用解密后的字符串作为公钥加密数据返回客户端
9. 客户端 收到加密数据 用保存下来的公钥解密数据 

## 进程与线程的区别
1. 一个应用程序至少有一个进程
2. 一个进程至少有一个线程
3. 进程的开销大与线程
4. 多个线程可以有自己的内存单元也有共享的进程内的内存单元
5. 线程崩溃进程崩溃，进程崩溃不会影响别的进程

## TCP链接的三次握手和四次挥手

### 三次握手
客户端 -> 服务端 告诉服务端要链接
服务端 -> 客户端 可以链接，你那ok了吗
客户端 -> 服务端 我这ok了，随时等你的响应

最后一次握手是为了 客户端没有链接成功，返回报文导致错误，所以要确认客户端已经链接可以接收报文

### 四次挥手
客户端 -> 服务端 告诉服务端要断开链接
服务端 -> 客户端 可以断开链接
服务端 -> 客户端 把剩下没有发送的报文发给客户端
客户端 -> 服务端 收到了，可以关闭

第三步是为了防止 服务端把剩下的报文发给了关闭的客户端，导致错误。服务端的关闭是先于客户端的，因为要防止服务端关闭之前还有报文给到客户端

## 缓存

### 缓存位置
查找缓存的优先级
1. from serviceworker 经过serviceworker缓存的资源或请求 size会是这个标识
2. memory cache memory cache是回话级别的缓存，即使设置了max-age=0，如果有memory cache也会走缓存，这是因为max-age=0意义更准确的是下次走请求资源。关闭浏览器页面tab memory cache就会清除
3. disk cache 缓存资源大多数都会存到disk cache

### 缓存策略

#### 强缓存
主要跟responese header里面的Expires和Cache-Control中的max-age有关。
Expires代表过期时间，是一个绝对时间的时间戳，浏览器判断如果在这个绝对时间内请求，会从缓存内拿资源
max-age代表过期时间，不过是一个相对时间的时间戳，是指在responseHeader里面date值之后的相对时间戳内的时间，会从缓存内拿资源

Expires 基本上已经弃用了改用Cache-Control中的max-age是因为这个是个绝对时间，但是不能保证服务器的当前时间和浏览器的当前时间一致，并且浏览器的时间是可以修改的。

#### 协商缓存
资源第一次请求回来response header里面的Last-Modified或Etag
资源没有命中强缓存，会在request header里面带上对应的If-Modified-Since或If-None-Match来让服务端来判断是否需要走协商缓存
Etag是文件内容标识的hash值，Last-Modified是上次修改的时间（秒级）
Etag的优先级高于Last-Modified，因为更准确，因为Last-Modified是秒级，有可能秒级内文件有修改，但是Last-Modified更轻量，不像Etag还得用文件内容来生成一个hash值
如果命中协商缓存，服务端返回304，从缓存内取资源

#### Cache-Control
1. max-age 
2. public 可以被任何服务器缓存
3. private 不允许被中间服务器缓存
4. no-cache 不走强缓存，去请求服务端看是否走协商缓存
5. no-store 永远请求最新资源
 
## 浏览器请求url到渲染发生了什么
1. 建立DNS链接
2. 建立TCP链接
3. 发送http请求，浏览器看是否有html的缓存，有就拿缓存，没有就下载
4. 然后解析dom树，建立om树，最后一起合成render Tree
5. 之后根据render tree计算出页面结构呈现到浏览器上，然后执行js。

## 性能优化

### 白屏时间
取自window.performance.timing
responseEnd - fetchStart

### 首次可交互时间

### 首屏加载时间

这些优化是不是都能通过ssr解决

### 页面加载性能优化
1. script 放在body下面
2. 用link去加载css文件
3. 合理使用缓存，serviceworker、html文件走协商缓存， 资源文件放cdn上走强缓存
4. 骨架屏、loading图减少用户预期的等待
5. 压缩资源文件，icon图片用svg或者iconfont或者base64图片
6. 如果用http1.0 使用雪碧图，减少http请求个数
7. 使用webp图片
8. 图片懒加载（new InterSectionObserver）

### 构建优化
1. webpack 使用 Happy Pack多进程Loader转换
2. ParallelUglifyPlugin多进程压缩js文件
3. 使用DllPlugin减少基础模块编译次数
4. 明确文件后缀

### 构建策略优化页面性能
1. 按照路由拆包（react-loadable React.lazy()）
2. 公共模块的提取（CommonChunk）
3. 按需引入（例如有些editor的组件可以动态引入，早需要的时候引入）（antd的组件按需加载 babel-import-plugin）（语言包）
4. 例如echart、betterscroll可以拆成异步加载cdn的包（配置externals）

### 开发优化
1. devserver

### 性能监控错误收集
window.addEventListenner('error', (e) => {
  console.log(e)
  e.preventDefault()
}, true)
window.addEventListenner('unhandledrejection', (e) => {
  console.log(e)
  e.preventDefault()
})
