# css修改滚动条样式

###### 

```html
<div class="scroll-box" style="height:200px;overflow: auto;">
  <div style="height:500px;"></div>
</div>
```

```css
// 滚动条最底部样式
.scroll-box::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
// 滚动条背景条样式
.scroll-box::-webkit-scrollbar-track {
  border-radius: 4px;
}
// 滚动条上层可滑动的条样式
.scroll-box::-webkit-scrollbar-thumb {
  background: #d2d2d2;
  border-radius: 4px;
}
// 滚动条上层可滑动的条样式:hover样式
.scroll-box::-webkit-scrollbar-thumb:hover {
  background: #b9b9b9;
}

// 滚动条隐藏,将宽高设为0
.scroll-box-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
```

也可以不指定类名，直接设置全部滚动条

```css
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  // background: #ffffff;
}

...
```



适配火狐浏览器

```css
*{
  scrollbar-width: thin;
  /*
  	scrollbar-width: auto | thin | none | <width>;
  */
}
.scroll-bar-hidden{
  scrollbar-width: none;
}
```





