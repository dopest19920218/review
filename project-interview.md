# 项目

## 自己有什么缺点？
先思考。
选一个缺点说，并且不能与程序员相关，如逻辑不缜密什么的。
说完缺点要说自己在怎么改进。
1. 表达能力欠佳 主动在团队内部或者小组内部分享，分享什么都可以
2. 有一点拖延症 每天都给自己列一个todo清单，保证当天做完
最后反问面试官如何看待自己的缺点

## 直播项目

## a+ ucid迁移node

## kemis vscode插件

## 定时任务
node-schedule 发布10-12点 整点推送 健康打卡
gitlab webhooks merge-request推送群组消息

## 前端工程化

## pre-commit husky lint prettier
需要安装 husky lint-staged npm包
然后在package.json 加上
```
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": [
      "prettier --write",
      "vue-cli-service lint",
      "git add"
    ]
  }
}
```

## node express写一个server
```
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParse.json())

app.listen(8081, () => {
  console.log('启动成功')
})

app.get('/test', (req, res) => {
  res.json('abc')
  res.send('<div>abc</div>')
})
```

## serviceworker
使用Google的Workbox
常用在生产中有几种缓存策略
1. staleWhileRevalidate
当路径匹配成功，会优先从缓存里面取，并后台发起请求更新缓存
2. networkFirst
当路径匹配成功，会优先走网络请求请求资源，请求失败或错误会取缓存里对应的资源
3. cacheFirst
当路径匹配成功，会先从缓存拿资源，拿不到会走网络请求

html可以用networkFirst缓存策略，用最新的资源加载 如果失败也有离线化
js/css可以用staleWhileRevalidate缓存策略
img可以用cacheFisrt缓存策略

## 项目中遇到的难解决的问题 怎么解决
### 作业帮 uiwebview 在滚动时 css动画 定时器停止
之前倒计时我们都是拿服务器时间来做倒计时，为了保证用户手机和服务器时间的不符（比如用户改动本地时间），如果服务器返回倒计时时长，我们就setTimeout 1s 递归去 时长-- 。但是如果我发生滚动的时候是7s，然后我滚动了5s停下，那么正确的倒计时应该是2s，但是我们这种实现方法，出现的是6s，这种bad case怎么解决呢
我们获取服务器的现在时间时间戳 和 服务器的倒计时终点时间时间戳，然后获取本地的时间戳，做一个恒等的服务器时间和本地时间的差值，然后我们会在定时器执行的回调当中实时获取当前的本地时间，然后根据恒等的差值算出当前服务器时间，然后用终点的倒计时时间-算出的服务器时间就是剩余的倒计时秒数的时间戳。

为什么用settimeout 不用 setinterval是因为settimeout执行回调的时间更精确，setinterval是会受到回调函数执行速度的影响

### 通用类hooks
通用类方法的抽象
1. 设置页面title的hooks
2. 函数式组件 函数防抖、截流的hooks 利用useCallback

### react 函数式组件 里面的方法用函数防抖 
例如： const debounceQuery = debounce((value) => {search(value), 500})
debounce为loadash/debounce

会发现每次输入导致函数式组件在重新render的时候，我们的每次输入都会被触发search，为什么呢？
这是因为render我们都会重新生成一个新的debounceQuery方法，里面的timeout没有被清除，所以每次输入都会触发search。
怎么解决可以通过useCallback这个hook来缓存生成debounceQuery，用法useCallback(debounce((value) => {search(value), 500}), [])

### react 利用useMemo 去缓存表单数据 防止数据太多 每个组件都需要diff 有时候数据不变就不需要update

### 单页应用 打开全屏弹窗 history.go(-1) 关闭弹窗

### 练习嵌入小程序