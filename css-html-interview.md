# CSS/HTMl

## 伪类和伪元素的区别
常用的伪类有： :first-child :last-of-type :hover
常用的伪元素： ::before ::after ::first-line

伪类是类似于一个选择器，是在一个选择器上加一个选择器来确定最后选择的是那个元素
伪元素是表现的像是在标记文本中加入一个全新的html元素， before向前加入一个元素 after向后加入一个元素 first-line是将元素的第一行 :before :after为什么也可以是因为浏览器向后兼容，最开始的before，after就是一个冒号

## Link和@import引入样式的区别
@import会在所有资源load完才会加载样式，所以会有样式闪动
link标签是浏览器解析文档遇到link标签就会去加载样式，不会有样式闪动

## <！DOCTYPE html>的含义
DTD，标识文档所用的html版本，不标记文档头就会以怪异模式解析文档。

##　Base64图片的优缺点
减少一个http请求，秒加载因为使打包在文件内，但是会使文件打包体积变大，适用与小icon图标类图片，不能被缓存。

## Css优化、提高性能的方法
1. 保持css选择器的简单化，不要嵌套很多层级。
2. 压缩css
3. 用link标签引入css
4. css的单一原则 比如margin: 20px 20px 0 0 的性能 是没有拆开margin-top: 20px和margin-right: 20px的性能好的

## Html5新增的语意标签，含义，以及为什么用语意化标签来编写html
header footer nav section article
用语意化标签编写html有利于网站的seo，提高代码的可维护性和可阅读性。

## 无依赖绝对定位是什么
绝对定位元素的样式没有定义right，left，top，bottom位置信息。
父级元素内的元素按正常文档流布局，如果一个无依赖绝对定位元素前面有block元素，那么他就折行排列，如果是inline-block元素就并行展示。
适用于 加图标之类的

## 包含块是什么
包含块是决定定位元素的left等位置信息百分比单位的参照元素是谁。
初始包含块就是html，大小就是视窗

fixed元素的包含块就是初始包含块
absolute元素的包含块就是定位父级，没有定位父级就是初始包含块
relative元素的包含块是父级元素是块级元素，inline-block元素

## 如何制作新手引导蒙层
1. border border-width 无限大 border-color rgba
2. 元素跟蒙层同级，动态改变z-index
3. box-shadow
4. canvas

## Css选择器有哪些？哪些属性可以继承？优先级怎么计算？
id选择器 class选择器 属性选择器（input[type="number"]） 标签选择器 后代选择器 相邻选择器 伪类选择器 通配符选择器

可继承属性： font-size line-height color font-family等

样式权重 !import > 内联样式 > id选择器（100） > 属性选择器 class选择器 伪类选择器（10） > 标签选择器 （1） > 通配符选择器 后代选择器 相邻选择器（0）

## 盒子模型有哪些？
普通盒子模型 宽度就是内容宽度 box-sizing: content-box
ie怪异盒模型 宽度是内容宽度+padding+border box-sizing: border-box

## px em rem vw的区别
px是固定单位
em rem vw都是相对单位
em 是根据当前元素的font-size
rem 是根据跟元素的font-size
vs 是根据视窗的大小 100vw等于视窗宽度

## css3硬件加速
为什么使用css动画？
因为css动画不占js线程，可以硬件加速，浏览器会在不需要的情况停止动画比如display:none

其实就是创建独立复合层让gpu去渲染动画。
怎么触发 transform opacity filters will-change都可以触发

比如一个动画用left来改变位置，那么实现在渲染的时候会一直触发repaint，但是用transform 就只有两此repaint 一次是开始的时候 一次是动画结束的时候，也可以用will-change、translateZ(0px)来告诉浏览器这个元素什么在渲染的时候适用gpu渲染。

如果发生闪动的现象可以通过设置backface-visibility: hidden和-webkit-perspective: 1000

也不要所有的动画都用gpu的方式去渲染，因为会手机发热 耗电量增加， gpu使用增高。

## 动画实现方式
transition keyframe requestAnimationFrame lottie

## 等高布局
1. margin-bottom 和 paddint-bottom对冲 -伪等高 有border看不见底部的border线
2. flex 父级盒子display: flex 子级元素自动等高
3. grid 父级盒子display: grid grid-template-columns: repeat(auto-fill, minmax(1fr, 100px))
4. table table-cell
5. 定位 右边盒子定位

## 两边定宽中间自适应
1. flex
2. grid
3. 前两个元素一个左浮动一个右浮动，第三个元素触发一下bfc
4. 定位
5. 中间自适应元素 width: calc(100% - 200px)

## 实现一个宽高比16:9的box
1. 利用padding-bottom是根据父级宽度来计算的原理，只需要设置元素width: 16%; height: 0px; padding-bottom: 9%;就可以
2. aspect-ratio: 16/9 草案中
3. grid

## 浏览器怎么解析css选择器
从右向左按节点解析，因为从左向右解析，会出现很多不匹配然后回朔寻找的情况，大部分时间都浪费在了找到不匹配的节点，从右向左就能保证每一步都是找到或者找不到。性能最大化

## 移动端遇到的一些兼容性问题，以及解决方案
1. 1px 边框问题 本质是设置一个伪类 宽高200% border 1px 再用transform scale(0.5)缩小一般来达到移动端1px视觉效果
2. ios惯性滚动 设置了overflow: auto的元素 需要设置-webkit-overflow-scrolling: touch来开启惯性滚动
3. fixed会在祖先级包含transform中失效
4. 视频音频不能自动播放 muted可以 app也可以设置一个属性来让h5可以自动播放， 再者就是body增加touchstart事件来hack自动播放
5. display inline-block有留白 父级font-size: 0 或者写html时候不要有换行符

## 如何清浮动
overflow: hidden可以清浮动
一般来讲是项目中封装一个清浮动的类clearfix
.clearfix:after {
  content: " ";
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}

## BFC是什么，如何触发BFC
BFC是block formatting context 块级格式化上下文，块元素排列顺序是垂直方向的，它们的间距通过margin来处理，同一个bfc的块元素会有margin合并的问题。
触发bfc的方式：
1. overflow不为visible none
2. position absolute fixed
3. float不为none
4. 根元素
5. display: inline-block table-cell

bfc可以解决margin合并、margin塌陷、清除浮动、浮动元素盖住元素的问题

