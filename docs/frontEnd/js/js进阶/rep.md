# 正则表达式

## element的rules使用正则

```jsx
{
    pattern: /^1[34578]\d{9}$/,
        message: "请填写正确的手机号码", trigger: "blur"
}
```

## 前端模糊查询实现

原理：使用用户输入值生成正则表达式（`i`代表不区分大小写）

```jsx
function search(query,array){
    const reg=new RegExp(escapeRegexpString(query), 'i')
    return array.filter(val=>reg.test(val))
}
```

escapeRegexpString是用于处理搜索字符串带有正则相关的符号

```jsx
function escapeRegexpString(value = ''){
    return String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

//e.g.
escapeRegexpString('[abc](')   //输出：'\\[abc\\]\\('
```


💡 ‘$&’是replace替换字符串的特殊变量，代表插入匹配的子串。
[**MDN文档**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)



## 驼峰式转烤串式

```jsx
export const kebabCase = function(str) {
    const hyphenateRE = /([^-])([A-Z])/g;
    return str
        .replace(hyphenateRE, '$1-$2')
        .replace(hyphenateRE, '$1-$2')
        .toLowerCase();
};
```

原理：`/([^-])([A-Z])/g`会匹配前面不是 `-` 的大写字符

`$1-$2` 是`replace`的特殊变量，`$n`代表正则第n个变量匹配的子串

`str.replace(hyphenateRE, '$1-$2')`则会在匹配的字符之间插入`-`

```jsx
let reg=/([^-])([A-Z])/g;
console.log('handleClickAAss'.match(reg))  //输出：['eC', 'kA']
```

## 正则截取子串

```jsx
let a='abcde'

// 截取以bc开头的字符串
a.match(/bc(\S*)/)  //['bcde', 'de']

// 截取以bc结尾的字符串
a.match(/(\S*)bc/)  //['abc', 'a']
```

