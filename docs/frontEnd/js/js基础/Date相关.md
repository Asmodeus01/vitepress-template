# Date相关技巧

## 取得当天零点时间

取得当天零点时间

```jsx
let midnight = new Date(new Date().setHours(0, 0, 0, 0))
```

取得当天23：59：59

```jsx
const midnight = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
```

用类似的方法可以获得某月，某日的时间（注意是从0开始算的）

```jsx
let oct = new Date(new Date().setMonth(9))
```

## 取得星期

```jsx
function getDay(date){
	  const l=['日','一','二','三','四','五','六']
	  return '星期'+l[date.getDay()]
}
```

## 时间格式化

然后在main.js处引用即可

```jsx
(function () {
  Date.prototype.Format = function (fmt) {
    const o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+':Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ''))
    }
    for (var k in o) {
      if (newRegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
})()

```
