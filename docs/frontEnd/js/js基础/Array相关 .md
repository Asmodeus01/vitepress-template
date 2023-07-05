# Array相关技巧

## 生成序列数组

1. 方法1

```jsx
*const* hours = Array.from({length: 24}, (a, i) => i);
```

1. 方法2

```jsx
[...new Array(24).keys()]
```

原理：new Array(n)可以生成长度为n，每一项为undefined的数组，但是其keys()返回的是其下标，是可解构的

## 生成随机数组

```jsx
function randArray(len, min, max) {
	return Array.from({length:len}, v=> Math.floor(Math.random()*(max-min))+min);
}

function randArray2(len, min, max) {
	return Array(len).fill(1).map(v=> Math.floor(Math.random()*(max-min))+min);
}
```
