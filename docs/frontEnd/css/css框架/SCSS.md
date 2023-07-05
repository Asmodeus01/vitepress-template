# SCSS

## 一、 什么是SASS

SASS是一种CSS的开发工具，提供了许多便利的写法，大大节省了设计者的时间，使得CSS的开发，变得简单和可维护。

## 二、安装和使用

### 2.1 安装

#### 1. 通过npm安装

```
npm install -g sass
```

**注：**国内 npm 建议使用淘宝镜像来安装

```
npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install [name]
```

安装完成后可以查看版本：

```
sass --version
```

![image-20210426162953819](https://gitee.com/zwh912/images/raw/master/imgs/20210426164303.png)

### 2.2 使用

SASS文件就是普通的文本文件，里面可以直接使用CSS语法。文件后缀名是.scss，意思为Sassy CSS。

下面的命令，可以在屏幕上显示.scss文件转化的css代码。（假设文件名为test。）

> 　　sass test.scss

如果要将显示结果保存成文件，后面再跟一个.css文件名。

> 　　sass test.scss test.css

SASS提供四个编译风格的选项：

> 　　* nested：嵌套缩进的css代码，它是默认值。
>
> 　　* expanded：没有缩进的、扩展的css代码。
>
> 　　* compact：简洁格式的css代码。
>
> 　　* compressed：压缩后的css代码。

生产环境当中，一般使用最后一个选项。

> 　　sass --style compressed test.sass test.css

你也可以让SASS监听某个文件或目录，一旦源文件有变动，就自动生成编译后的版本。

````
　　// watch a file

　　sass --watch input.scss:output.css

　　// watch a directory

　　sass --watch app/sass:public/stylesheets
````

## 三、 基本用法

### 3.1 变量

变量用于存储一些信息，它可以重复使用。

Sass 变量可以存储以下信息：字符串、数字、颜色值、布尔值、列表和null值。

SASS允许使用变量，所有变量以$开头。

```scss
$variablename: value;
```

如果变量需要镶嵌在字符串之中，就必须需要写在#{}之中。

```scss
$side : left;

.rounded {
	border-#{$side}-radius: 5px;
}
```

demo:

```scss
<template>
    <view class="knowledge">
        <view class="test">
            xxx
        </view>
    </view>
</template>

<style lang="scss">
	$myColor : red;
	$myFontSize:18rpx;
	$myWidth:100rpx;
	$myHeight:100rpx;
	$side:left;
	.knowledge{
        margin-left: 30rpx;
        margin-right: 30rpx;
            .test {
                width: $myWidth;
                height: $myHeight;
                font-size: $myFontSize;
                background-color: $myColor;
                margin-#{$side}: 50rpx;
            }
}
</style>
```

效果展示：

![image-20210426170420319](https://gitee.com/zwh912/images/raw/master/imgs/20210426170420.png)

### 3.2 计算功能

SASS允许在代码中使用算式。

demo:

```scss
<style lang="scss">
	$myColor : red;
	$myFontSize:18rpx;
	$myWidth:100rpx;
	$myHeight:100rpx;
	$side:left;
	.knowledge{
        margin-left: 30rpx;
        margin-right: 30rpx;
            .test {
                width: $myWidth;
                height: $myHeight + 20rpx;
                font-size: $myFontSize;
                background-color: $myColor;
                margin-#{$side}: 50rpx;
            }
}
</style>
```

![image-20210426172952389](https://gitee.com/zwh912/images/raw/master/imgs/20210426172952.png)

### 3.3 作用域

Sass 变量的作用域只能在当前的层级上有效果.

```scss
<view class="test">
	xxx
</view>
<text class="text">yyyyy</text>

<style lang="scss">
	$myColor : red;
	$myFontSize:18rpx;
	$myWidth:100rpx;
	$myHeight:100rpx;
	$side:left;
	
    .test {
        width: $myWidth;
        height: $myHeight + 20rpx;
        font-size: $myFontSize;
        $myColor:green;
        background-color: $myColor;
        margin-#{$side}: 50rpx;
    }
    .text{
    	color: $myColor;
    }

</style>
```

![image-20210426185700792](https://gitee.com/zwh912/images/raw/master/imgs/20210426185700.png)

### 3.4 !global

当然 Sass 中我们可以使用 **!global** 关键词来设置变量是全局的

```scss
<view class="test">
	xxx
</view>
<text class="text">yyyyy</text>

<style lang="scss">
	$myColor : red;
	$myFontSize:18rpx;
	$myWidth:100rpx;
	$myHeight:100rpx;
	$side:left;
	
    .test {
        width: $myWidth;
        height: $myHeight + 20rpx;
        font-size: $myFontSize;
        $myColor:green !global;
        background-color: $myColor;
        margin-#{$side}: 50rpx;
    }
    .text{
    	color: $myColor;
    }

</style>
```

![image-20210426190134251](https://gitee.com/zwh912/images/raw/master/imgs/20210426190134.png)

### 3.5 嵌套

SASS允许选择器嵌套。比如，下面的CSS代码：

```css
div h1 {
	color:red;
}
```

可以写成：

```scss
div {
    hi {
    	color:red;
    }
}
```

属性也可以嵌套，比如border-color属性，可以写成：

```scss
p {
    border: {
    	color: red;
    }
}
```

==注意，border后面必须加上冒号。==

在嵌套的代码块内，可以使用&引用父元素。比如a:hover伪类，可以写成：

```scss
a {
	&:hover { color: #ffb3ff; }
}
```

### 3.6 注释

SASS共有两种注释风格。

标准的CSS注释 /* comment */ ，会保留到编译后的文件。

单行注释 // comment，只保留在SASS源文件中，编译后被省略。

在/*后面加一个感叹号，表示这是"重要注释"。即使是压缩模式编译，也会保留这行注释，通常可以用于声明版权信息。

## 四、 代码的重用

### 4.1 继承

SASS允许一个选择器，继承另一个选择器。继承要使用@extend命令。

```scss
.test {
    width: $myWidth;
    height: $myHeight + 20rpx;
    font-size: $myFontSize;
    $myColor:pink;
    border: 2rpx solid $myColor;
    margin-#{$side}: 50rpx;
}
.text{
    @extend .test;
    font-size: 120%;
}
```

![image-20210426191347231](https://gitee.com/zwh912/images/raw/master/imgs/20210426191347.png)

### 4.2 Mixin

Mixin有点像C语言的宏（macro），是可以重用的代码块。使用@mixin命令，定义一个代码块。

使用@mixin命令，定义一个代码块。

```scss
@mixin left {
    float: left;
    margin-left: 20rpx;
    background-color: pink;
}
.test {
    width: $myWidth;
    height: $myHeight + 20rpx;
    font-size: $myFontSize;
    $myColor:pink;
    border: 2rpx solid $myColor;
    margin-#{$side}: 50rpx;
}
```

使用@include命令，调用这个mixin。

```scss
.text{
    @extend .test;
    font-size: 120%;
    @include left;
}
```



![image-20210426191704498](https://gitee.com/zwh912/images/raw/master/imgs/20210426191704.png)

mixin的强大之处，在于可以指定参数和缺省值。

```scss
@mixin left($value:30rpx) {
    float: left;
    margin-left: $value;
    background-color: pink;
}
.text{
    @extend .test;
    font-size: 120%;
    @include left(50rpx);
}
```

![image-20210426192156519](https://gitee.com/zwh912/images/raw/master/imgs/20210426192156.png)

### 4.3 颜色函数

SASS提供了一些内置的颜色函数，以便生成系列颜色。

```scss
lighten(#cc3, 10%) // #d6d65c
darken(#cc3, 10%) // #a3a329
grayscale(#cc3) // #808080
complement(#cc3) // #33c
```

### 4.4 插入文件

@import命令，用来插入外部文件。

```scss
@import 'path/filename.scss'
```

如果插入的是.css文件，则等同于css的import命令。

```css
@import "foo.css";
```

### 4.5 Partials

如果你不希望将一个 Sass 的代码文件编译到一个 CSS 文件，你可以在文件名的开头添加一个下划线。这将告诉 Sass 不要将其编译到 CSS 文件。

但是，在导入语句中我们不需要添加下划线。

Sass Partials 语法格式：

```
_filename;
```

以下实例创建一个 _colors.scss 的文件，但是不会编译成 _colors.css 文件：

```scss
// _color.scss
$myPink: #EE82EE;
$myBlue: #4169E1;
$myGreen: #8FBC8F;
```

如果要导入该文件，则不需要使用下划线：

```scss
@import "colors";

body {
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: $myBlue;
}
```

==**注意：**请不要将带下划线与不带下划线的同名文件放置在同一个目录下，比如，_colors.scss 和 colors.scss 不能同时存在于同一个目录下，否则带下划线的文件将会被忽略。==

## 五、 函数

### 5.1 条件语法

@if可以用来判断：

```scss
.hhh{
    @if 1 + 1 == 2 {
    	border: 4rpx solid pink;
    }
    @if 1 + 1 == 3 {
    	border: 10rpx dotted;
    }
    width: 300rpx;
    height: 50rpx;
}
```

![image-20210426193139217](https://gitee.com/zwh912/images/raw/master/imgs/20210426193139.png)

配套的还有@else命令：

```scss
.hhh{
    @if 1 + 1 == 3 {
    	border: 4rpx solid pink;
    }
    @else {
    	border: 10rpx dotted;
    }
    width: 300rpx;
    height: 50rpx;
}
```

![image-20210426194701656](https://gitee.com/zwh912/images/raw/master/imgs/20210426194701.png)

### 5.2 循环语句

SASS支持for循环：

```scss
@for $i from 1 to 10 {
　　　　.border-#{$i} {
　　　　　　border: #{$i}px solid blue;
　　　　}
　　}
```

也支持while循环：

```scss
$i: 6;
@while $i > 0 {
    .item-#{$i} { width: 2em * $i; }
    $i: $i - 2;
}
```

each命令，作用与for类似：

```scss
@each $member in a, b, c, d {
    .#{$member} {
    	background-image: url("/image/#{$member}.jpg");
    }
}
```

### 5.3 自定义函数

SASS允许用户编写自己的函数。

```scss
@function double($n) {
	@return $n * 2;
}
.hhh {
    width: double(10rpx);
    height: double(20rpx);
    background-color: pink;
}
```

![image-20210427091256781](https://gitee.com/zwh912/images/raw/master/imgs/20210427091256.png)

### 5.4 其他

#### 1. 颜色函数

sass包含很多操作颜色的函数。例如：`lighten()` 与 `darken()`函数可用于调亮或调暗颜色，`opacify()`函数使颜色透明度减少，`transparent()`函数使颜色透明度增加，`mix()`函数可用来混合两种颜色

```scss
div {
    padding: 20px;
    margin: 20px;
}
.one {
    background: red;
    }
.two {
    background: yellow;
}
.three {
    background: mix(red, yellow);
    }
.four {
    background: mix(red, yellow, 35%);
}
.five {
    background: mix(red, yellow, 65%);
}
```

![image-20210426200032331](https://gitee.com/zwh912/images/raw/master/imgs/20210426200032.png)

#### 2. 字符串函数

Sass有许多处理字符串的函数，比如向字符串添加引号的`quote()`、获取字符串长度的`string-length()`和将内容插入字符串给定位置的`string-insert()`。

#### 3. 数值函数

数值函数处理数值计算，例如：`percentage()`将无单元的数值转换为百分比，`round()`将数字四舍五入为最接近的整数，`min()`和`max()`获取几个数字中的最小值或最大值，`random()`返回一个随机数。

#### 4. List函数

List函数操作List，`length()`返回列表长度，`nth()`返回列表中的特定项，`join()`将两个列表连接在一起，`append()`在列表末尾添加一个值。