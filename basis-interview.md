# 基础

## 浏览器请求url到渲染发生了什么
建立DNS链接，建立TCP链接，发送http请求，浏览器看是否有html的缓存，有就拿缓存，没有就下载，然后解析dom树，建立om树，最后一起合成render Tree，之后根据render tree计算出页面结构呈现到浏览器上，然后执行js。

## perfomance.timing 