# **display常用元素布局**

[[toc]]

#### **外部值**

外部值就是定义自身元素的外部表现，而不影响其内的子元素。

-将元素设置为块元素

`display: block;`

-将元素设置为行内元素

`display: inline;`



#### **内部值**

和外部值相反，内部值就是定义子元素的布局的。

-撑开浮动的元素高度，就是可以清除浮动效果。

`display：flow-root;`



#### **显示值**

-隐藏；元素渲染，但是不显示，相当于v-show的使用。

`display: none;`



#### **混合值**

-行内块元素

`display: inline-block; `

-行内表格元素

`display: inline-table;`

-即在行内网格布局

`display: inline-grid;`

-行内弹性布局

`display: inline-flex;`

flex: 本身作为一个块级元素，占据整行，`inline-flex`: 本身作为一个行内块元素，如果不设置宽度，则占据子元素撑开的宽度



#### **全局值**

-继承父元素的 display属性

`display: inherit;`

-不管父元素怎么设定，恢复到浏览器最初始时的 display属性

`display: initial;`

-unset混合了 inherit和 initial。如果父元素设值了，就用父元素的设定，如果父元素没设值，就用浏览器的缺省设定

`display: unset;`



#### **表格布局**

`display：table;`

```
table    { display: table }
tr       { display: table-row }
thead    { display: table-header-group }
tbody    { display: table-row-group }
tfoot    { display: table-footer-group }
col      { display: table-column }
colgroup { display: table-column-group }
td, th   { display: table-cell }
caption  { display: table-caption }
```

```
<div id="wrapper">
    <div id="main">
        <div id="nav">navigation column content…</div>
        <div id="extras">news headlines column content…</div>
        <div id="content">main article content…</div>
    </div>
</div>
```

```
#main {
    display: table;
    border-collapse: collapse;
}
#nav {
    display: table-cell;
    width: 180px;
    background-color: #e7dbcd;
}
#extras {
    display: table-cell;
    width: 180px;
    padding-left: 10px;
    border-right: 1px dotted #d7ad7b;
}
#content {
    display: table-cell;
    width: 380px;
    padding-left: 10px;
}
```



#### **弹性布局**

`display：flex;`

###### **设置子元素排列方式**

flex-direction: row;                    横向排列（默认）

flex-direction: column;               纵向排列

flex-direction: row-reverse;        横向倒序排列

flex-direction: column-reverse;   纵向倒序排列

**主轴对其方式**

justify-content: center;

**交叉轴对其方式**

align-items: center;

**对其方式的值**

- stretch               默认。各行将会伸展以占用剩余的空间。
- flex-start          开始对其
- flex-end            结束对其
- space-between  两端对其
- space-around    自动分配间隔
- space-evenly     每个flex子项两侧空白间距完全相等
- center               居中对其

**子元素一行放不下的话换行显示**

flex-wrap: wrap;

**在弹性容器内的元素没有占用交叉轴上所有可用的空间时对齐容器内的各项**

**（该属性只对** `flex-wrap: nowrap` **有效）**

align-content: center；

**弹性子元素属性**

```
1. order值越大元素越靠后，可以为负值
order: 1;

2. flex容器瓜分父容器剩余空间
// div1, div2将父元素剩余空间按 1:2 进行瓜分
div1{
    flex-grow: 1;
}
div2{
    flex-grow: 2;
}

3. flex-shrink父容器空间不足，子容器默认不会换行，会被收缩，
flex-shrink设置该子元素收缩的程度，1为默认
flex-shrink: 0.1;
为0则元素不会被压缩
flex-shrink: 0;
4. flex-basis定义了在分配剩余空间之前元素的默认大小
flex-basis: 50px;

5. flex复合写法
flex: flex-grow flex-shrink flex-basis;

6. align-self对单个子元素设置对齐方式
align-self: center;
```

**网格布局**

**display: grid;**

`CSS 网格布局`擅长于将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系（前提是HTML生成了这些区域）。

像表格一样，网格布局让我们能够按行或列来对齐元素。 然而在布局上，网格比表格更可能做到或更简单。 例如，网格容器的子元素可以自己定位，以便它们像`CSS`定位的元素一样，真正的有重叠和层次。

/* 横向排列规则，把宽度分为三等分 */

```
<div class="wrapper">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
    <div>Six</div>
    <div>Seven</div>
    <div>Eight</div>
</div>
```

```
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

