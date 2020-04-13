# this指向
所有普通函数function的this指向都是window，无论在哪定义。
当然如果是严格模式，最外层指向就不是window了，而是undefined。

如果是普通函数作为一个方法挂在对象上，那么它的this指向是这个对象。举个栗子：
```
  var obj = {
    name: 'curry',
    logName: function() {
      console.log(this.name);
    }
  }
  obj.logName();
  // curry
```
那如果是这样呢？this的指向是什么？
```
  var obj = {
    name: 'curry',
    logName: function() {
      console.log(this.name);
    }
  }
  var see = obj.logName;
  see();
  // undefined
```
为什么是undefined呢？因为```var see = obj.logName```相当于 ```var see = function(){ console.log(this.name) }```这时候this指向的是window，window下没有name这个属性，所以是undefined。

**总结：如果该普通函数是挂载在对象上的，那么this指向跟调用的方式有关。**

如果function是new出来的那么它的this指向是不可以修改的，并且指向调用者，看栗子：
```
function Say() {

}
var b = new Say();
b.a = 3;
console.log(b.a)
// 3
```

说完了普通函数，接下来说说箭头函数。
# 箭头函数与普通函数的区别
1. 箭头函数没有constructor，所以它不能new。
2. 箭头函数没有prototype，所以它本身没有this指向。
3. 箭头函数的this指向继承于外层第一个普通函数，如果外层没有，就之一往外层去找，直至window。
4. 箭头函数的this指向不可被修改，如想修改箭头函数的this指向，就只能修改它继承的this指向。
5. 如果箭头函数指向的是window，那么它就没有arguments，如果继承的是一个普通函数，那么它的arguments就是普通函数的arguments。

举上面的一个栗子
```
  var obj = {
    name: 'curry',
    logName: function() {
      console.log(this.name);
    }
  }
  obj.logName();
  // curry
```
改成箭头函数呢？
```
  var obj = {
    name: 'curry',
    logName: () => {
      console.log(this.name);
    }
  }
  obj.logName();
  // undefined
```
因为this指向的是window。
不能使用arguments，但是可以使用rest参数来代替，这是一种更好的方式。
# apply、call与bind改变this指向
apply、call与bind都可以改变普通函数的this指向，它们的区别主要是传参以及使用方式不同。
1. apply接收两个参数，第一个是改变后的this指向，第二个参数是一个数组，是作为arguments传入函数内。栗子：
```
  var obj = {
    name: 'curry',
    logName: function(...params) {
      console.log(this.name, params.join('+'));
    }
  }
  var obj2 = {
    name: 'james'
  }
  obj.logName.apply(obj2);
  // james
  obj.logName.apply(obj2, ['kobe', 'yao']);
  // james kobe+yao
```
自己实现一个apply
```
  Function.prototype.myApply = function(context, params) {
    var fn = Symbol();
    console.log(params);
    context[fn] = this;
    var result = context[fn](...params);
    delete context[fn];
    return result
  }
  var arr = [1, 2, 3];
  Array.prototype.push.myApply(arr, [4, 5, 6]);
  console.log(arr);
  // [1, 2, 3, 4, 5, 6]
  console.log(Math.max.myApply({}, [1, 2, 3]));
  // 3
```
2. call接收n个参数，第一个是改变后的this指向，后面的参数都是作为方法执行的参数传入函数。栗子：
```
  var obj = {
    name: 'curry',
    logName: function(...params) {
      console.log(this.name, params.join('+'));
    }
  }
  var obj2 = {
    name: 'james'
  }
  obj.logName.call(obj2);
  // james
  obj.logName.call(obj2, 'kobe', 'yao');
  // james kobe+yao
```
自己实现一个call
```
  Function.prototype.myCall = function(context, ...params) {
    var fn = Symbol();
    context[fn] = this;
    var result = context[fn](...params);
    delete context[fn];
    return result;
  }
  var arr = [1, 2, 3];
  Array.prototype.push.myCall(arr, 4, 5, 6);
  console.log(arr);
  // [1, 2, 3, 4, 5, 6]
  console.log(Math.max.myCall({}, 1, 2, 3));
  // 3
```
3. call接收n个参数，第一个是改变后的this指向，后面的参数都是作为方法执行的参数传入函数，并返回一个function。栗子：
```
  var obj = {
    name: 'curry',
    logName: function(...params) {
      console.log(this.name, params.join('+'));
    }
  }
  var obj2 = {
    name: 'james'
  }
  obj.logName.bind(obj2)();
  // james
  obj.logName.bind(obj2, 'kobe', 'yao')();
  // james kobe+yao
  obj.logName.bind(obj2, 'kobe', 'yao')('iverson', 'green');
  // james kobe+yao+iverson+green
```
可以看出bind会返回一个方法，并且方法也支持传递参数，实现一个bind。
```
  Function.prototype.myBind = function (context, ...params) {
    var that = this;
    return function(...arg) {
      return that.apply(context, [ ...params, ...arg]);
    }
  }
  var obj = {
    name: 'curry',
    logName: function(...params) {
      console.log(this.name, params.join('+'));
    }
  }
  var obj2 = {
    name: 'james'
  }
  obj.logName.myBind(obj2)();
  // james
  obj.logName.myBind(obj2, 'kobe', 'yao')();
  // james kobe+yao
  obj.logName.myBind(obj2, 'kobe', 'yao')('iverson', 'green');
  // james kobe+yao+iverson+green
```
# 作用域以及作用域链
作用域是指查找变量的优先级，先找当前作用域的变量，找不到再根据作用域链去找上层作用域的变量，一值往上找，直至找到或者最外层。

**作用域在函数定义的时候就已经确定了，跟调用时机和方式无关。**
栗子：
```
var name = 'abc';
function say() {
  var name = 'efg';
  function log() {
    console.log(name);
  }
  log();
}
say();
// efg
```
作用域链最实际的运用是 **闭包**
# 闭包
闭包其实就是外部函数使用其他函数的内部变量。栗子：
```
function foo() {
  var name = 'abc'
  return function () {
    consol.log(name);
  }
}
var name = 'efg';
var log = foo();
log();
// abc
```
下面看看闭包在js中最常用的方法
# 函数的节流与防抖
## 函数节流
意思是函数在固定时间只触发一次。常用于监听scroll事件回调的执行，为了提高性能和减少执行次数。使用函数节流是很好的方式。
```
function throttle(callback, delay) {
  let executionTime = 0;
  return function (...params) {
    const now = Date.now();
    if (now - executionTime > delay) {
      callback.apply(this, params);
    }
  }
}
```
## 函数防抖
意思是函数延迟固定时间触发。连续触发只触发最后一次，常用于搜索中的input连续输入，为了避免频繁触发。使用函数防抖是很好的方式。
```
function debounce(callback, delay) {
  let timeout;
  return function (...params) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, params);
    }, delay);
  }
}
```

# 性能优化相关
## http相关
### http1.0 http1.x http2.0的区别
首先这三个http协议都是基于TCP链接的，都要经过三次握手，四次挥手，而且TCP链接是有慢启动的问题的，所以说尽可能的要链接复用而不是重启。 

再说http1.0 每个请求都是一个tcp链接，不同的浏览器对同域名下的并发链接数有限制，比如chrome一般是6-8个，移动端更少。这块有一个优化点就是不同的静态资源放在不同域名的cdn下，比如js放在js.cdn，css放在css.cdn等，这是一种取巧的方式来提升性能，还有就是把图片合并成雪碧图减少连接数。

再说http1.x 这个协议实现了keep-alive这个主要功能，keep-alive是用一个tcp链接来发不通的请求。除此之外它还丰富了很多请求头的信息，缓存相关等。

常见的HTTP 1.1状态代码及其含义：
1. 2xx：成功--表示请求已被成功接收、理解、接受。
2. 3xx：重定向--要完成请求必须进行更进一步的操作。 302重定向、304 not modified 缓存等
3. 4xx：客户端错误--请求有语法错误或请求无法实现。 404 not found 未找到、403 不被允许，没有权限。
4. 5xx：服务器端错误--服务器未能实现合法的请求。 500 502都是服务端的错误。

http2.0 主要实现了 **多路复用** ，之前都是用超文本传输数据，这个协议使用帧的概念也就是二进制数据去传输数据，跟http1.1一样建立一个TCP链接，但是有多少个请求就有多少个流，帧在不同流中穿插传输，帧会有一个stream identity的标识来进行最后不同返回数据的拼装。这就是多路复用。还有一个主要功能是 **服务端推送** ，可以使用内嵌资源，这一般是在页面里固定会用到的资源。

## http与https的区别（跟性能优化无关）
主要区别是https多加了一层ssl加密层，更多的保证数据的安全性，页面也不会产生运营商劫持的现象。
加密的方式有两种，一种是公钥加密，一种是私钥加密。
1. 公钥加密 也是 对称加密。

优点：对称加密算法的优点是算法公开、计算量小、加密速度快、加密效率高。

缺点：对称加密，密钥管理的安全性很低，因为加密和解密都使用同一个密钥，在密钥的发送过程中，密钥可能被第三方截取，导致第三方也可以破解密文。

2. 私钥加密 也是 非对称加密

非对称密钥的算法强度复杂（是优点也是缺点），安全性依赖于算法与密钥。

优点：安全性较高，比对称密钥安全性高很多。 非对称加密算法的保密性比较好，它消除了最终用户交换密钥的需要。

缺点：由于其算法复杂，而使得加密解密速度没有对称加密解密的速度快。

主要流程是客户端和服务端都生成一对公钥和私钥，公钥是公开的。服务端先把服务端的公钥给客户端，私钥保留，客户端也会把公钥给服务端，私钥保留。然后客户端向服务端请求数据的时候会用服务端的公钥把数据加密，然后服务端拿到加密数据用自己的私钥才能解开，第三方是解不开的。

## 使用dns-prefetch
```
<link rel="dns-prefetch" href="//domain.com">
```
使用 DNS Prefetch 能够加快页面的解析速度。

## 使用webp算法去处理图片

什么是 WebP 格式图片？WebP 是由谷歌（google）开发的一种旨在加快图片加载速度的图片格式,并能节省大量的服务器宽带资源和数据空间，在压缩率上比 JPEG 格式更优越，同时提供了有损压缩与无损压缩的图片文件格式，在质量相同的情况下，WebP 格式图像的体积要比 JPEG 格式图像小 40%。

但是webp图片也有兼容性问题，ios上不支持，对于支持webp的浏览器我们可以使用webp格式的图片，会有效的减少网络请求速度，提高效率和性能。

可以通过```canvas.toDataURL('image/webp').indexOf('image/webp') === 5```来判断是否使用webp图片。
或者使用定义个component。使用picture标签来实现优先使用webp图片和优雅降级。
```
<picture>
  <img src="img_girl.png@f_webp">
  <img src="img_girl.png">
</picture>
```

## 骨架屏

骨架屏的概念和loading图是一样的，旨在减少用户预期的等待时间，让用户有更好的用户体验。是一种另类的提高'性能'的方法。

## 公共代码的提取以及按需加载

公共代码的提取和封装，可以使相同代码在一处引用，避免重复定义和加载。

按需加载，顾名思义就是优先加载需要的chunk比如页面的首屏可以封装到一个chunk里，其他部分等到需要的时候再去加载或者之后再预加载。这也会提升页面的加载速度因为一个页面的所有代码不会在页面加载时都进行下载和加载。

## 缓存
缓存分为 **强缓存** 和 **协商缓存** 两种方式。
缓存的优先级依次是serviceworker、memory cache、disk cache。memory cache一般关闭浏览器就消失了。

1. 强缓存

直接从浏览器中寻找缓存资源。跟强缓存相关的请求header字段有Expires、Cache-Control两个字段。

Expires代表着过期时间，由服务端告诉客户端在某个时间内请求该资源可以直接走浏览器缓存，而不用去服务端请求资源。但是这个值会有问题，如果浏览器时间被修改，那么就有可能不走缓存了。所以就有了Cache-Control。

Cache-Control代表着可缓存性，它有几个常用的值。
- max-age max-age: 10代表着浏览器在请求资源的时候在当前的时间10秒以内都可以直接用浏览器缓存来返回资源。前面说到了Expires的缺点，那用max-age就可以避免这个缺点，因为max-age的值是相对时间，是服务端返回给浏览器时候的相对时间内请求都可以直接用缓存。而我们实际中利用强缓存也是通过max-age来控制，只不过值可能是一个一年时间的秒数。

- no-cache 代表不走强缓存，需要请求服务端来确定是否走缓存资源。

- no-store 代表不走缓存，永远去服务端请求资源。

- private 不允许中间服务器进行缓存操作。

- public 允许各个服务器进行缓存操作。

2. 协商缓存

需要浏览器经过请求服务端之后来确定是否进行缓存操作还是重新下载资源。跟协商缓存的字段有，request header里面是IF-Modifi-Since和If-None-Match

