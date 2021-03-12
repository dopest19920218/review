# JS

## 内存空间与数据类型
### 内存空间
1. 栈 栈遵循着先入后出的规则，在js中函数执行后会形成执行上下文的堆栈，最下面的永远是global全局的执行上下文。
2. 堆 存储引用数据类型，类似于key-value的形式存储。
3. 队列 遵循着先入先出的规则，事件循环中是以队列的方式存储回调函数的

### 数据类型
1. 基本数据类型
null undefined number boolean string symbol
2. 引用数据类型
function object array

## 执行上下文与变量对象
### 执行上下文
执行上下文分为三种：全局上下文、函数上下文、eval上下文（暂不讨论）
执行上下文生命周期分为：创建阶段、执行阶段、回收阶段
1. 创建阶段 创建当前上下文中的变量对象初始值，包括确定this执行，作用域链（scope chain）等
2. 执行阶段 赋值与函数执行阶段
3. 回收阶段 执行上下文从堆栈中移除，并且进行垃圾回收

### 变量对象
在执行上下文创建阶段，会完成变量对象的创建，会对在当前上下文中的function和var的变量进行初始赋值
```
function a() {
  console.log(b)
  var b = 1;
  function c() {
    console.log(123)
  }
}
a();

// a函数的执行上下文，创建阶段的变量对象
VO = {
  b: undefined,
  c: reference to function c(){}
}
```
引用数据类型是放在堆中存储，变量对象拿到的是队中对应数据的指针，这也就是有变量提升的概念。
为什么引用数据类型的赋值之后的修改会同时修改赋值前后的变量？就是因为在变量对象中存的是指针，修改引用数据类型会修改堆中对应的数据的值，但是赋值前后的两个变量的指针还是指向同一个堆中的值。

## 作用域与作用域链
作用域就是查找变量的优先级，沿着作用域链一直寻找，直到找到或者找不到，作用域链在变量对象创建的过程中就已经确定下来了，作用域链类似于数组[]，第一位是当前函数的变量对象，最后一个是全局变量对象，按照顺序查找变量。

## 闭包
作用域和作用域链最常见使用的地方就是闭包。
闭包有几个条件：
1. 在执行上下文创建的函数
2. 创建的函数引用执行上下文中的变量
3. 在其他执行上下文中执行
```
(function (){
  var a = 1
  function b() {
    console.log(a)
  }
  window.fn = b
})()

window.fn()

function a() {
  var b = 1
  return function() {
    console.log(b)
  }
}

var c = a()
c()
```
闭包在模块化的有着很好的应用，会拥有私有的方法和变量。
函数的防抖与截流也是闭包实际应用常用到的。
不正当使用会导致内存泄漏。
函数防抖
```
function debounce(fn, wait) {
  let timer = null
  return (...params) => {
    clearTimer(timer)
    timer = setTimeout(() => {
      fn.apply(this, params)
    }, wait)
  }
}
```
函数截流
```
function throttle(fn, wait) {
  let prevTime = 0
  return (...params) => {
    const currentTime = Date.now()
    if (currentTime - prevTime > wait) {
      prevTime = currentTime
      fn.apply(this, params)
    }
  }
}
```

## 内存泄漏
常见的垃圾回收方式有两种：
1. 标记清除
2. 引用计数

常见的内存泄漏的原因有：
1. 循环引用
2. 不必要的全局变量。因为全局变量，浏览器很难判断是否还会被使用，所以不确定是否能垃圾回收。
3. 没用清理的定时器

在不用的时候把变量设置为null，就会在下次扫描的时候，进行该变量的垃圾回收。

## this指向
由于this指向在执行上下文创建阶段就已经确定，所以上下文的创建有关系。
1. 全局上下文创建时，this指向window，如果是严格模式，指向undefined。
2. 函数上下文创建的时候就是函数的调用的时候，跟函数执行的方式有关，如果是独立调用，那么this指向全局上下文的this指向，如果是作为属性调用，this指向的调用者。如果是构造函数 new出来的 this指向它本身。

结论：this指向跟函数的调用方式有关。

## 箭头函数与普通函数的区别

1. 箭头函数没有constructor，所以不能new
2. 箭头函数的this指向，指向外层第一个普通函数，如果没有就依次寻找直至全局。
3. 箭头函数的this指向不可被修改，只能改变箭头函数this指向的this指向。
4. 没有arguments

## 改变this指向的三种方法的区别（apply、call、bind）
1. apply接收的参数第一个是改变后的this指向，第二个参数是一个数组，作为函数执行的参数。
```
Function.prototype.myApply = function(context, params = []) {
  var fn = Symbol()
  context[fn] = this
  var result = context[fn](...params)
  delete context[fn]
  return result
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
obj.logName.myApply(obj2);
obj.logName.myApply(obj2, ['curry', 'bryant']);

var arr = [1, 2, 3];
Array.prototype.push.myApply(arr, [4, 5, 6]);
console.log(arr);
```
2. call接收的参数第一个是改变后的this指向，后续的参数作为函数执行的参数。
```
Function.prototype.myCall = function (context, ...params) {
  var fn = Symbol()
  context[fn] = this
  var result = context[fn](...params) // 问题？ 此处的context[fn]可以用this代替吗？
  delete context[fn]
  return result
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
obj.logName.myCall(obj2);
obj.logName.myCall(obj2, 'curry', 'bryant');

var arr = [1, 2, 3];
Array.prototype.push.myCall(arr, [4, 5, 6]);
console.log(arr);

问题的答案： 
不可以， 因为context[fn]的this指向是context才是我们要修改后的this指向。 直接替换成this，执行的时候this指向是指向的是Function.prototype。
```
3. bind接受的参数跟call一样，不过bind会返回一个方法，而不是马上执行，返回方法再执行会将两次的参数进行合并。

```
Function.prototype.myBind = function (context, ...params) {
  return (...others) => {
    this.apply(context, params.concat(others))
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
var a = obj.logName.myBind(obj2, 'oneal');
a('curry', 'bryant')

var arr = [1, 2, 3];
var a = Array.prototype.push.myBind(arr, 4, 5, 6);
a()
console.log(arr);
```

## 原型和原型链
每个函数都有一个prototype，prototype是个对象也就是原型。
每一个构造函数 new出来的实例都有一个隐式原型_proto_指向构造函数的显示原型prototype，实例拥有构造函数的方法与属性。
比如 一个由构造函数new出来的实例，它的_proto_指向构造函数的原型，构造函数的_proto_指向Function的原型，Function的_proto_指向Object的原型，由此构成了一条链路，叫原型链。

## 继承
继承属性可以通过 apply call bind去继承
但是继承之后的对象是没有_proto_和prototype的，需要显示的定义一下。
后续补充。

## 事件循环

### 为什么要有事件循环
因为js是单线程的，如果没有异步处理，比如发送一个请求，如果要一直等待结果返回那么后续的执行都会被阻塞，而请求往往和后续的执行是没有关系的，也为了cpu的利用率高，所以要有异步回调的处理，异步回调都是放在队列中，完成一个事件就从队列中取出一个事件来执行，如此反复就是事件循环。

### 任务队列

队列是先进先出的规则，来存储回调函数。队列分为两种微任务(micro-task)和宏任务(marco-task)。

常见的微任务有Promise的回调，process.nextTick。
常见的宏任务有setTimeout，setInterval，setImmediate, requestAnimationFrame。

注：process.nextTick和setImmediate是node环境特有的，浏览器环境是没有这两个方法。

### 事件循环实际执行过程

js在执行过程中会先执行同步的代码（script）中的，然后在执行的过程中，碰见对应的微任务和宏任务就把它的回调函数放到相应的队列中，在执行完同步代码会先执行微任务，直至把微任务的队列清空（在执行微任务的过程中如果创建了微任务也会在后面执行）之后取宏任务队列队首的一个回调函数执行 执行之后先去清空微任务队列，然后再取宏任务队首回调函数执行，如此反复就是事件循环。

## 跨域以及解决跨域的方法
### 什么是跨域
跨域是因为浏览器有同源策略，同源策略是具有相同的协议、域名、端口才是同源。
为什么要有同源策略，如果没有同源策略的限制可能会恶意网站页面用全屏的iframe加载你的登陆页，在用户输入的时候就能操作你的dom获取你的账号密码。还可能正常登陆种的cookie，在登恶意网站时获取你的cookie来伪造真实用户身份，来恶意操作。
所以有了同源策略，cookie只有才同源的情况下才能获取到，操作dom。

### 解决跨域
1. jsonp 通过script标签来请求，在window挂载一个callback名称并把名称挂到script的src上，如：http://www.a.com/b/c?callback=cb，收到请求执行window.cb()，达到目的。 适用场景： 请求第三方服务的脚本。
2. 代理 nginx反向代理
3. CORS 通过设置服务端的Access-Control-Allow-Orgin: \*来解决跨域，如果需要携带cookie access-control-allow-origin就不可以设置\*，要设置具体的域名，并设置Access-Control-Allow-Credentials: true，前端的axios也要设置config.withCredentials = true
4. postmessage 是一个异步方法，主要是操作页面与iframe通信的场景
5. websocket 不常用

## 正向代理和反向代理的区别，实际应用场景
正向代理：隐藏了真实请求的客户端，比如 VPN
反向代理：隐藏了真实请求的后端服务，比如 nginx方向代理

## cookie localstorage sessionstorage区别
大小： cookie是每条4kb超出就会截断 cookie同域名最多20条 localstorage和sessionstorage是5MB
生命周期： cookie可以设置过期时间，如果没有设置过期时间，就在页面关闭就过期。localstorage可以一直存储在浏览器，不会过期，需要手动删除，或者清理缓存。sessionstorage仅仅存在会话阶段，关闭页面就会消失。
与服务端交互： cookie可以跟随请求发送到服务端，localstorage和sessionstorage不会自动随着请求发送，需要手动获取塞入到请求体中。
属性： cookie有name、value、domain、path、secure、http-only参数，只有在同源下才会有对应的cookie，secure安全验证只有在ssl链接才会发送到服务端，http-only js是否可以操作当前的cookie。localstorage和sessionstorage只有name value
使用场景： cookie一般存储用户身份的加密token，localstorage一般用来处理持久性信息的存储，比如某个功能弹窗是否弹出过。sessionstorage可以用来存储当前页面某个按钮的点击次数。

## script defer async区别
在浏览器解析html文档的时候碰到script标签就会停止解析dom加载script并执行，会阻塞dom的解析。
script defer 会异步下载脚本，在dom解析完成之后按照顺序加载脚本js，相当于按顺序写在body下面
script async 会异步下载脚本，但在下载完会马上执行，执行的时候阻塞dom解析，多个async script会谁先下载完就先加载谁，适用于彼此没有依赖的脚本。

## 0.1 + 0.2 === 0.3 ？
答案是false，为什么？
因为十进制的数字会变成二进制的，而二进制的浮点数表示时是无穷的。
所以才有了这个问题。

### 解决
最开始的解决办法是找到最大小数点的位数然后把所有数字*这个位数变成整数之后再进行运算，元算的结果再根据算式除以最大位数（如果是乘法就是 Math.pow(位数, 乘法的项数) 依次类推）。因为转换成整数运算不就没问题了吗，但是在变成整数的过程中也是用到了浮点数的运算，还是会有精度问题比如：35.41 * 100 = 3540.9999999999995。
所以我们换一种思路，用还是获取最大小数点位数，然后变成整数不用*，用string的replace然后Number变成整数，剩下都是一样的操作，就可以解决了。

## 手写个promise
```
function MyPromise(callback) {
  this.status = 'pending'
  this.value = undefined
  this.resolveEvents = []
  this.rejectEvents = []
  
  function resolve(value) {
    if (this.status === 'pending') {
      this.status = 'fullfilled'
      this.value = value
      this.resolveEvents.forEach(cb => {
        cb(value)
      })
    }
  }

  function reject(value) {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.value = value
      this.rejectEvents.forEach(cb => {
        cb(value)
      })
    }
  }

  try {
    callback(resolve, reject)
  } catch(e) {
    console.error(e)
  }
}

MyPromise.prototype.then = function (resolveHandler, rejectHandler) {
  if (this.status === 'fullfilled') {
    resolveHandler(this.value)
  } else if (this.status === 'rejected') {
    rejectHandler(this.value)
  } else {
    this.resolveEvents.push(resolveHandler)
    this.rejectEvents.push(rejectHandler)
  }
}
```

## 深拷贝和浅拷贝
拷贝主要这个对象里面的每一个引用数据类型的指针要换成一个新的指针，

浅拷贝只能拷贝基本数据类型，引用数据类型的指针还是没有变，新对象和原对象的引用数据类型是===的, 所以你改引用数据类型里的值，新老对象会同时修改。

浅拷贝的方式： Object.assign() ... array.concat() array.slice()

深拷贝 
JSON.parse(JSON.stringify())可以进行深拷贝，但是如果对象理由function拷贝完就会变成null

实现一个深拷贝（遍历）
```
function deepClone(obj) {
  if (typeof obj !== 'object') return obj
  // 用构造函数来生成一个新的对象
  const newObj = new obj.constructor()
  for (let name in obj) {
    if (obj.hasOwnProperty(name)) {
      newObj[name] = deepClone(obj[name])
    }
  }
  return newObj
}
```

## isEqual
```
function isEqual(obj1, obj2) {
  // 无论什么类型
  if (obj1 === obj2) {
    return true
  }

  // 如果是 数组或者json 或者 Date这种对象
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)

    if (obj1Keys.length !== obj2Keys.length) return false

    for (let name in obj1) {
      if (obj1.hasOwnProperty(name)) {
        if (!isEqual(obj1[name], obj2[name])) {
          return false
        }
      }
    }
    
    return true
  }

  return false
}
```

## hasOwnProperty 和 for (var name in obj)的区别
hasOwnProperty是获取不到实例继承下来的属性 Object.prototype.hasOwnProperty(key) 返回true false
name in obj 是遍历obj的所有属性，包含继承下来的属性

## Object.defineProperty
Object.defineProperty(obj, propName, desc)
三个参数 第一个对象宿主 第二个属性名称 第三个描述标识符
```
var count = 1
var obj = {}

Object.defineProperty(obj, 'a', {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
})

console.log(obj.a) // 1
```
value是标识属性的值
writable是标识属性可不可以通过属性赋值的形式修改（obj.a = 2）
configurable是标识属性是否可以被删除，是否可以重新定义标识内容
enumerable是标识属性是否可以遍历（在 var ... in ... 和 Object.keys()）可以获取

```
var count = 1
var obj = {}

Object.defineProperty(obj, 'a', {
  get() {
    return count
  }
  set(value) {
    count = value
  }
})

obj.a = 2
console.log(count) // 2
console.log(obj.a) // 2
```
可以定义getter和setter来标识对象属性值发生变化时的回调，desc里面get、set和value不可以同时出现

## for...in Object.keys() Object.getOwnPropertyNames() 有什么区别
for...in可以把所有自身和继承中的可枚举的属性都拿到
Object.keys() 可以把自身所有可枚举都拿到
Object.getOwnPropertyNames() 可以把自身的所有属性（包括可枚举和不可枚举）都拿到

## 事件观察者模式
```
class Sub{
  constructor() {
    this.observerList = []
  }

  add(observer) {
    if (!this.observerList.includes(observer)) {
      this.observerList.push(observer)
    }
  }

  remove(observer) {
    const target = this.observerList.findIndex(observer)
    if (target > -1) {
      this.observerList.splice(target, target + 1)
    }
  }

  notify() {
    this.observerList.forEach(item => {
      item.update()
    })
  }

}

class Observer{
  constructor(name) {
    this.name = name
  }

  update() {
    console.log(this.name)
  }
}
const observer1 = new Observer('a')
const observer2 = new Observer('b')

const watcher = new Sub()

watcher.add(observer1)
watcher.add(observer2)

watcher.notify()

```

## 事件订阅发布
是进阶版的观察者模式，因为观察者模式有局限性，比如只能固定调用update方法
```
class EventBus{
  constructor() {
    this.eventList = {}
  }

  on = function(eventType, callback) {
    const list = this.eventList[eventType] ? [...this.eventList[eventType]] : []
    if (!list.includes(callback)) {
      list.push(callback)
    }
    this.eventList[eventType] = list
    return this
  }

  emit(eventType, ...data) {
    const eventList = this.eventList[eventType]
    eventList.forEach(cb => {
      cb(...data)
    })
    return this
  }

  clear(eventType) {
    this.eventList[eventType] = []
    return this
  }

  off(eventType, callback) {
    const eventList = this.eventList[eventType]
    const targetIndex = eventList.findIndex(cb => cb === callback)
    if (targetIndex > -1) {
      eventList.splice(targetIndex, targetIndex + 1)
    }
    return this
  }
}
```

## es6

### const let var的区别
1. 都是定义变量的方式
2. const 表示常量 不可重新赋值， let、var可以重新赋值
3. const、let会形成块级作用域，暂时性死区，在变量定义前，获取变量会报错 x is not defined， var在定义前获取是undefined

## Set、Map、WeakSet、WeakMap区别
都是一个构造函数，可以用new一个实例
1. Set
方法和属性： size获取成员个数，add增加一个成员，delete删除一个成员，has判断某个成员是否在Set里面，clear清空成员，例：const a = new Set(); a.add(1).add(2); console.log(a.size())
2. WeakSet
WeakSet的成员只能是对象，其次WeakSet是弱引用，垃圾回收不考虑WeakSet中的对象引用，也就是说里面的成员随时有可能消失，所以不能遍历，没有size方法。
拥有的方法和属性： add、delete、has
3. Map
拥有的方法和属性：set，get，has，delete，clear，size，遍历的方法keys，values，entries，forEach
本质是一组键值对[[1,2],['name', 'tuan']]
4. WeakMap
key必须为对象，并且跟WeakSet一样对内部成员都是弱引用，不参与垃圾回收，所以没有遍历的方法和size，
最常用的就是保存dom的对象

### Proxy
vue 2.0 用的是 Object.defineProperty来做的数据劫持
vue 3.0 用的是 Proxy来做的数据劫持

为什么要用Proxy来做？
Object.defineProperty无法感知到数组的某些操作，比如arr[0] = 1; arr.push(1)
在实际使用中你需要用Vue提供的set方法来重新给data中的arr赋值
用Proxy就可以感知到这些数组的变化
用法 new Proxy(target, options)

用Proxy做一个wacther
```
const data = {
  arr: [1, 2, 3]
}
const watcher = {}

Object.defineProperty(watcher, 'arr', {
  value: new Proxy(data.arr, {
    set(target, property, val) {
      console.log('setting arr')
      return Reflect.set(target, property, val)
    }
  })
})

watcher.arr[0] = 0
watcher.arr.push(4)
watcher.arr.push(5)

console.log(data.arr) // [0, 2, 3, 4, 5]
console.log(watcher.arr) // [0, 2, 3, 4, 5]
console.log(watcher.arr === data.arr) // false
```
共打印5次setting arr 因为push的时候还有一次set length的值

用Object.defineProperty(obj, propertyName, options)做一个watcher
```
const data = {
  arr: [1, 2, 3]
}
const watcher = {}

Object.defineProperty(watcher, 'arr', {
  get() {
    return data.arr
  },
  set(val) {
    console.log(val, '////')
    data.arr = val
  }
})

watcher.arr[0] = 0
watcher.arr.push(4)
watcher.arr.push(5)
console.log(watcher.arr) // [0, 2, 3, 4, 5]
watcher.arr = [1, 6, 7]
console.log(watcher.arr) // [1， 6， 7]
```
只会打印一次[1, 6, 7] ////
符合我们的预期，push方法和下标赋值都不会触发set方法的回调

**所以用Proxy来做数据劫持的wacther更可靠，更方便**

### Reflect
用于方法的劫持，Reflect是内置函数，没有constructor，不能new。
符合函数调用的思维，比如 'name' in obj来判断obj是否有某个属性，可以用Reflect.has(obj, 'name')也会返回Boolean
拥有的方法：
1. has Reflect.has(obj, propertyName) 判断obj有无propertyName这个属性
2. set Reflect.set(obj, propertyName, val) 相当于obj[propertyName] = val，会返回Boolean，来表示是否成功赋值
3. ownkeys Reflect.ownKeys(obj) 相当于Obj.getOwnPropertyNames()会把自身所有属性包括不可枚举都获取
4. deleteProperty Reflect.deleteProperty(obj, propertyName) 相当于 delete obj[propertyName]
5. defineProperty Reflect.defineProperty(obj, propertyName, attr) 相当于 Object.defineProperty(obj, propertyName, arr)
and so on....
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect>

## IntersectionObserver是做什么的
IntersectionObserver是检测元素和视窗的碰撞关系，可以获取元素是否在视窗内。
可以不使用scroll事件，然后获取元素的位置信息来判断，获取元素的位置信息是非常消耗性能的。

可以创建一个observer，接受两个参数 第一个是callback， 第二个是options

**实际使用场景： 图片懒加载，无限滚动加载数据（observer绑定最底下的loading块），广告的曝光埋点**

图片懒加载
```
<img data-src="http://www.a.com/b.jpg" class="img-lazy-load">

const imgList = document.querySelectorAll('.img-lazy-load')

const observer = new InsectionObserver((nodes) => {
  nodes.forEach(item => {
    // item是每个图片
    // 自定义做什么事
    if (item.isIntersecting) {
      // 在视窗内
      item.target.src = item.target.dataset.src
    }
  })
})
observer.observe(Array.from(imgList))
```

## csrf攻击 xss攻击
xss 是指跨站脚本攻击 比如有一段脚本<\script>标签，后端存储后，返回前端 前端innerHtml = 这段获取的脚本，就会马上执行，达到恶意的xss攻击，现在服务端都有很成熟的防xss的脚本。

csrf 是指伪造用户身份的攻击，比如登陆正常登陆网站种了userid的明文cookie，然后就可能被篡改成各种身份，来刷接口获取信息或者操作重要的行为比如转账等，一般是种的是加密的token，这样就加大了恶意篡改的难度。想要完全杜绝是不可能的，只能是加大恶意操作的成本，使他们获得的和付出的不成正比。

## 手写个new
```
function MyNew(constructor, ...params) {
  const obj = Object.create({}) // 创建一个新的对象
  obj.__proto__ = constructor.protoType // 将新对象的隐式原型指向构造函数的protoType
  const result = constructor.apply(obj, params) // 获取构造函数执行的结构，并把属性继承和改变this指向到obj
  return typeof result === 'object' ? result : obj // 如果返回是object就return object如果不是返回新的对象
}
```

## 二叉树
<https://juejin.cn/post/6844904105559719944>

### 什么是二叉树
二叉树有一个根节点，每个节点可以有左右两个节点，左节点的值小于父节点，右节点的值大于父节点，没有子节点的节点叫做叶子节点

#### 创建二叉树
```
function BST() {
  this.root = null
  this.insert = insert
}

function Node(val, left = null, right = null) {
  this.value = val
  this.left = left
  this.right = right
}

function insert(val) {
  const node = new Node(val)
  if (this.root === null) {
    this.root = node
  } else {
    let parentNode = this.root
    while (true) {
      if (val < parentNode.value) {
        if (parentNode.left === null) {
          parentNode.left = node
          break;
        } else {
          parentNode = parentNode.left
        }
      } else {
        if (parentNode.right === null) {
          parentNode.right = node
          break;
        } else {
          parentNode = parentNode.right
        }
      }
    }
  }
}
const tree = new BST()

tree.insert(50)
tree.insert(10)
tree.insert(70)
tree.insert(5)
tree.insert(15)
tree.insert(60)
tree.insert(80)
```

### 先序遍历
```
function preOrder(node) {
  const result = []
  if (node !== null) {
    result.push(node.value)
    Array.prototype.push(result, preOrder(node.left))
    Array.prototype.push(result, preOrder(node.right))
  }
  return result
}

console.log(preOrder(tree.root)) // 50, 10, 5, 15, 70, 60, 80
```

### 中序遍历
```
function middleOrder(node) {
  const result = []
  if (node !== null) {
    Array.prototype.push(result, middleOrder(node.left))
    result.push(node.value)
    Array.prototype.push(result, middleOrder(node.right))
  }
  return result
}

console.log(middleOrder(tree.root)) // 5, 10, 15, 50, 60, 70, 80
```

### 后序遍历
```
function postOrder(node) {
  const result = []
  if (node !== null) {
    Array.prototype.push(result, postOrder(node.left))
    Array.prototype.push(result, postOrder(node.right))
    result.push(node.value)
  }
  return result
}

console.log(postOrder(tree.root)) // 5, 15, 10, 60, 80, 70, 50
```

### 左右节点翻转
```
function reverseTree(node) {
  if (node !== null) {
    reverseTree(node.left)
    reverseTree(node.right)
    const cache = node.left
    node.left = node.right
    node.right = cache
  }
}
```

### 判断二叉树是否为对称二叉树
```
function compareTree(left, right) {
  if (node.left === null && node.right === null) return true
  if (node.left === null || node.right === null) return false
  return left.value && right.value && compare(left.left, right.right) && compare(left.right, right.left) 
}
console.log(compareTree(tree.root))
```

### 求任意二叉树根节点到叶子路径所有数字之和
```
function calculateValue(root) {
  let result = 0
  function getValue(node) {
    if (node !== null) {
      result += node.value
      getValue(node.left)
      getValue(node.right)
    }
  }
  getValue(root)
  return result
}
console.log(calculateValue(tree.root))
```

## 链表

## react、vue

### 组件通信
1. 父 => 子 props
2. 子 => 父 父级将方法作为props传入子组件，子组件调用并传值给函数 vue可以通过:value.sync 子组件$emit('update:value', 1)
3. 兄弟组件 可以通过单一数据流的方式 通过父组件转发
4. 多层级组件 react 可以通过context上下文来通信
5. 通用解决 复杂的组件通信可以使用 事件发布订阅着模式通信

### 生命周期
1. vue beforeCreate created beforeMount mounted beforeUpdate updated beforeDestory destoryed
2. react componentWillMount componentDidMount componentWillReceiveProps shouldComponentUpdate componentWillUpdate componentDidUpdate componentWillUnmount

### 虚拟dom
虚拟dom就是有js组成的一个树形结构，每个节点有一些属性来描述这个节点的信息，如：className，children等，根据创建的虚拟dom树来反应真实的dom，虚拟dom树通过diff算法减少不必要的更新，可以提升渲染的性能，每次setState更新都会比较新老虚拟dom树，然后把差异应用到真实构建的dom上。

### diff算法
根据新老虚拟dom树来比较，从而确定节点的增删改
1. 只比较同级元素
2. 列表有key属性，方便比较
3. 只会匹配相同class（组件名）的组件
4. setState会进行合并一起调用，同一个值的修改，后面的覆盖前面的
5. 可以通过useMemo和shouldComponentUpdate来显示判定组件是否需要更新

尽可能不使用index下标来做key，例如[0,1,2,3]数据改成[3,2,1,0]，这时候两次虚拟dom key都为0的时候 他们的内容是不同的一个是0 一个是3，这样就是发生重新渲染，而如果用id0，id1，id2，id3来做的话 那顺序仅仅是变成了 id3，id2，id1，id0，这个时候diff仅仅是节点的移动，而不会重新渲染

### setState是异步还是同步
有时候异步有时候同步，在setTimeout和原生方法里使用setState是同步也就是立即生效的，否则会进行合并一起调用也就是异步调用

### Vue响应式原理

init => Observer(data) => 遍历data => defineReactive把值变成响应式的，并且递归observe当前的值 => Object.defineProperty get方法进行依赖收集Dep set方法进行依赖notify（观察者模式） => 依赖就是Watcher，Dep notify会触发每个Watcher的update方法

收集依赖时会有一个全局变量Dep.target指向当前的Watcher，然后放入当前的Dep实例中
在渲染的过程，参数都会触发get方法，通过这种方式搜集Watcher

Watcher分为computed-watcher user-wachter render-watcher
computed-watcher 就是 执行一下对应的computed的方法 就会触发 内部data的get方法完成收集依赖
user-watcher 就是 在updateComponent的过程中触发内部data的get方法完成收集依赖

### nextTick原理
利用任务队列来实现nextTcik
1. 先用Promise
2. 利用mutationObeserver
3. 利用setImmediate
4. settimeout 0

