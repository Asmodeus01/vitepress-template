# flex和grid布局的区别



在css中，grid布局指的是“网格布局”，是一个二维系统，可以同时处理行和列，可以通过将css规则用于父元素和该元素的子元素来使用网格布局；而flex布局指的是“弹性布局”，是一个一维系统，用来为盒状模型提供最大的灵活性。

#### 一、 flex布局简介

flex是flexible box（弹性布局）的简介，是一个一维系统，用来为盒状模型提供最大的灵活性。

使用：任何容器（行内元素可设置为display:inline-block）;

特点：空间分布在行中进行，而非整体

#### 二、 grid布局简介

Gird Layout(css网格布局)是css中最强大的布局系统，是一个二维系统，可以同时处理行和列，可以通过将css规则用于父元素（网格容器）和该元素的子元素（网格元素）来使用网格布局。

使用：对父元素设置dispay：grid;grid-template-colums和grid-template-rows来设置几行几列，然后对子元素设置占据几行几列

特点：二维网格结构，十分便于操作

#### 三、 适用场景

##### 3.1 grid布局的适用场景

Grid能够布局两个方向的元素。实际上，Grid总是想要布局在两个方向上，你无法使用它做交错布局，它总是同时考虑行和列，它会想要调整你的网格，同时考虑两个方向发生的事。

![image-20210316150648406](https://gitee.com/zwh912/images/raw/master/imgs/20210316160237.png)

这张图显示了是一个使用grid布局，来排列两个方向的东西。

##### 3.2 flex布局的适用场景

如果我们只想要往一个方向布局，Flexbox就很有用。你可以把它想成一大堆盒子排在一条无限长的线上，但它并不是无限的长，实际上是有限的空间。盒子可能会跳行，可能不会，跳行与否，浏览器每次都只会考虑一个纬度，浏览器不会跨行做计算，它只会计算一个方向。

![image-20210316150835720](https://gitee.com/zwh912/images/raw/master/imgs/20210316160246.png)



这张图显示了在Flexbox时，计算是按每一行计算的，一次一行，不管其它行的事，你可以看到东西并没有对齐，它依赖于内容的大小，页面上东西的大小。

##### 3.3 重叠元素

有一件情况，Grid可以做但是Flexbox无法做到的是“重叠元素”，如果你的情况是两者都能做到，但是你想要重叠元素，那你肯定想要使用Grid。

demo：

```vue
<template>
  <div class="allArea" style="width: 100%; height: 100%">
    <div class="area">
      <img class="img" :src="imageUrl" />
      <span class="text">xxx</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: require("../assets/111.jpg"),
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style>
/* .allArea {
  
} */
.area {
  display: grid;
  width: 500px;
  height: 500px;
}
.img {
  grid-area: 1 /2;
  width: 500px;
  height: 500px;
}
.text {
  grid-area: 1 /2;
  align-self: end;
  text-align: center;
  background: red;
  color: #fff;
  line-height: 2;
}
</style>
```

![image-20210316172726402](https://gitee.com/zwh912/images/raw/master/imgs/20210316172726.png)

##### 3.4 全局页面定位

如果所有主要的全局容器元素都==同级分布==，因为这时元素呈二维分布，推荐考虑用CSS Grid；

你也可以使用Flexbox，但是使用Flexbox情况可能会有些复杂，因为Flexbox只能在一个方向上布局，为了达到效果，这时候你需要将元素进行嵌套，用一次或两次Flexbox布局才能达到相同的效果。

==我们可以根据元素是一维分布还是二维分布，来选择CSS Grid或Flexbox。==

如APP和小程序这样只是一列或一行，推荐先Flex整体布局，再用Grid控制局部布局。而网页端是推荐全部使用Grid布局，如果你想用Flex也可以，它们是可以相互嵌套的。

##### 3.5 对齐元素

Flexbox的对齐方式写法比较简洁一些，而CSS Grid则显得有些复杂，推荐使用Flexbox

##### 3.6 响应式页面设计

需要根据你原先使用的布局确定。保持整体布局和响应式布局一致，这样会比较清晰明了，一致的写法会简单很多。

##### 3.7 兼容性

**(1) grid**

PC端：Chrome57+，Opera44+，Firefox52+，IE11+，Safari10.1，Edge16+

移动端：iOS10.3，Android67，Android69，Android Firefox62

**(2) flex**

Chrome20，Safari3.1+，Firefox2-21，IE10，Android2.1+，iOS3.2+



#### 四、 个人总结

1. 感觉grid布局适合做页面的大框架，定好页面布局
2. grid对于已知晓内容的元素来说更合适，对于由后端返回的未知数来说并不友好，flex的自适应性更好
3. 可以使用grid和flex进行混合开发
4. 感觉grid写起来要比flex稍微麻烦一点，需要计算行列格子，没有flex好上手

