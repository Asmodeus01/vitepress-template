# 使用showdown实现markdown转HTML

所需环境：

- [showdown.js](https://github.com/showdownjs/showdown)
- markdown.css (转换后的HTML只给每个标签添加了class，需要再引入样式文件)
- [highlight.js](https://highlightjs.org/) （转化后的代码并不会高亮，所以需要使用highlight将代码高亮）



## 安装依赖

#### 安装showdown

```
npm install showdown
```

示例：

```js
var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    text      = '# hello, markdown!',
    html      = converter.makeHtml(text);
```

使用showdown转换后的HTML代码并不会高亮，我们会发现代码块被pre、code标签包裹，里面没有其他标签了，所以我们使用highlight给code标签下的代码添加标签和class，他会自动识别语言。最后引入highlight的样式文件就可以高亮显示了。

#### 安装highlight.js

```
npm install highlight.js
# or
yarn add highlight.js
```

示例：

```js
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
});
```



## 在vue中使用

#### 目录结构

├─public
│  └─blogs
│          如何使用showdown.md
└─src
    ├─components
    │      MarkdownExhibition.vue
    ├─config
    │      showdownConfig.js
    ├─styles
    │      markdown.css



####  MarkdownExhibition.vue

```html
<template>
  <div class="markdown-body">
    <div v-html="html"></div>
  </div>
</template>
```

```js
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// 引入showdown
const showdown = require('showdown')
// 引入showdown配置
import showdownConfig from "@/config/showdownConfig";
// 引入markdown样式文件
import '@/styles/markdown.css';
// 引入代码高亮
import hljs from 'highlight.js';
// 引入代码高亮 主题文件
import 'highlight.js/styles/github.css'
import $axios from "axios";
export default {
  data () {
    //这里存放数据
    return {
      html: '',
    };
  },
  //方法集合
  methods: {
    markdownToHTML () {
      // 获取markdown文件
      $axios.get('/blogs/如何使用showdown.md').then(res => {
        let blogs = res.data
        let converter = new showdown.Converter(showdownConfig)
        // 获取到HTML字符串
        this.html = converter.makeHtml(blogs)
        // 下面要进行dom操作，所以要等this.html插入到页面后再执行代码高亮操作
        this.$nextTick(() => {
          // 代码高亮
          this.codeHighlight()
        })
      }).catch(err => {
        console.error("博客读取失败！", err);
      })
    },
    // 代码高亮
    codeHighlight () {
      // 获取页面上所有代码部分
      let code = document.querySelectorAll('pre code')
      // 给所有代码块添加高亮
      code.forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  },
}
</script>
```

#### showdownConfig.js showdown配置文件

```js
export default {
    "omitExtraWLInCodeBlocks": true,
    "noHeaderId": false,
    "prefixHeaderId": "",
    "ghCompatibleHeaderId": true,
    "headerLevelStart": 1,
    "parseImgDimensions": true,
    "simplifiedAutoLink": true,
    "excludeTrailingPunctuationFromURLs": false,
    "literalMidWordUnderscores": true,
    "strikethrough": true,
    "tables": true,
    "tablesHeaderId": false,
    "ghCodeBlocks": true,
    "tasklists": true,
    "smoothLivePreview": true,
    "smartIndentationFix": false,
    "disableForced4SpacesIndentedSublists": false,
    "simpleLineBreaks": false,
    "requireSpaceBeforeHeadingText": false,
    "ghMentions": false,
    "extensions": [],
    "sanitize": false
}
```

#### markdown.css

```css
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word
}

ol {
  list-style: decimal
}

ul {
  list-style: square
}

.markdown-body>*:first-child {
  margin-top: 0 !important
}

.markdown-body>*:last-child {
  margin-bottom: 0 !important
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none
}

.markdown-body .absent {
  color: #c00
}

.markdown-body .anchor {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  padding-right: 6px;
  padding-left: 30px;
  margin-left: -30px
}

.markdown-body .anchor:focus {
  outline: none
}

.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
  position: relative;
  margin-top: 1em;
  margin-bottom: 16px;
  font-weight: bold;
  line-height: 1.4;
}

.markdown-body h1 .octicon-link, .markdown-body h2 .octicon-link, .markdown-body h3 .octicon-link, .markdown-body h4 .octicon-link, .markdown-body h5 .octicon-link, .markdown-body h6 .octicon-link {
  display: none;
  color: #000;
  vertical-align: middle
}

.markdown-body h1:hover .anchor, .markdown-body h2:hover .anchor, .markdown-body h3:hover .anchor, .markdown-body h4:hover .anchor, .markdown-body h5:hover .anchor, .markdown-body h6:hover .anchor {
  padding-left: 8px;
  margin-left: -30px;
  text-decoration: none
}

.markdown-body h1:hover .anchor .octicon-link, .markdown-body h2:hover .anchor .octicon-link, .markdown-body h3:hover .anchor .octicon-link, .markdown-body h4:hover .anchor .octicon-link, .markdown-body h5:hover .anchor .octicon-link, .markdown-body h6:hover .anchor .octicon-link {
  display: inline-block
}

.markdown-body h1 tt, .markdown-body h1 code, .markdown-body h2 tt, .markdown-body h2 code, .markdown-body h3 tt, .markdown-body h3 code, .markdown-body h4 tt, .markdown-body h4 code, .markdown-body h5 tt, .markdown-body h5 code, .markdown-body h6 tt, .markdown-body h6 code {
  font-size: inherit
}

.markdown-body h1 {
  padding-bottom: 0.3em;
  font-size: 2.25em;
  line-height: 1.2;
  border-bottom: 1px solid #eee
}

.markdown-body h1 .anchor {
  line-height: 1
}

.markdown-body h2 {
  padding-bottom: 0.3em;
  font-size: 1.75em;
  line-height: 1.225;
  border-bottom: 1px solid #eee
}

.markdown-body h2 .anchor {
  line-height: 1
}

.markdown-body h3 {
  font-size: 1.5em;
  line-height: 1.43
}

.markdown-body h3 .anchor {
  line-height: 1.2
}

.markdown-body h4 {
  font-size: 1.25em
}

.markdown-body h4 .anchor {
  line-height: 1.2
}

.markdown-body h5 {
  font-size: 1em
}

.markdown-body h5 .anchor {
  line-height: 1.1
}

.markdown-body h6 {
  font-size: 1em;
  color: #777
}

.markdown-body h6 .anchor {
  line-height: 1.1
}

.markdown-body p, .markdown-body blockquote, .markdown-body ul, .markdown-body ol, .markdown-body dl, .markdown-body pre {
  margin-top: 0;
  margin-bottom: 16px
}

.markdown-body hr {
  height: 4px;
  padding: 0;
  margin: 16px 0;
  background-color: #e7e7e7;
  border: 0 none
}

.markdown-body ul, .markdown-body ol {
  padding-left: 2em
}

.markdown-body ul.no-list, .markdown-body ol.no-list {
  padding: 0;
  list-style-type: none
}

.markdown-body ul ul, .markdown-body ul ol, .markdown-body ol ol, .markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0
}

.markdown-body li>p {
  margin-top: 16px
}

.markdown-body dl {
  padding: 0
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: bold
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px
}

.markdown-body blockquote {
  padding: 0 15px;
  color: #777;
  border-left: 4px solid #ddd;
  font-size: 14px;
}

.markdown-body blockquote> :first-child {
  margin-top: 0
}

.markdown-body blockquote> :last-child {
  margin-bottom: 0
}

.markdown-body .table-bordered>thead>tr>th {
  border-bottom-width: 0;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
  word-break: normal;
  word-break: keep-all
}

.markdown-body table th {
  font-weight: bold;
  background: #ededed;
}

.markdown-body table th, .markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #ddd
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #ccc
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f8f8f8
}

.markdown-body img {
  max-width: 100%;
  box-sizing: border-box
}

.markdown-body .emoji {
  max-width: none
}

.markdown-body span.frame {
  display: block;
  overflow: hidden
}

.markdown-body span.frame>span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid #ddd
}

.markdown-body span.frame span img {
  display: block;
  float: left
}

.markdown-body span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: #333
}

.markdown-body span.align-center {
  display: block;
  overflow: hidden;
  clear: both
}

.markdown-body span.align-center>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center
}

.markdown-body span.align-center span img {
  margin: 0 auto;
  text-align: center
}

.markdown-body span.align-right {
  display: block;
  overflow: hidden;
  clear: both
}

.markdown-body span.align-right>span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right
}

.markdown-body span.align-right span img {
  margin: 0;
  text-align: right
}

.markdown-body span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden
}

.markdown-body span.float-left span {
  margin: 13px 0 0
}

.markdown-body span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden
}

.markdown-body span.float-right>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right
}

.markdown-body code, .markdown-body tt {
  padding: 0;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 3px
}

.markdown-body code:before, .markdown-body code:after, .markdown-body tt:before, .markdown-body tt:after {
  letter-spacing: -0.2em;
  content: "\00a0"
}

.markdown-body code br, .markdown-body tt br {
  display: none
}

.markdown-body del code {
  text-decoration: inherit
}

.markdown-body pre>code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 16px
}

.markdown-body .highlight pre, .markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal
}

.markdown-body pre {
  word-wrap: normal
}


.markdown-body pre code, .markdown-body pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  font-size: 100%;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body pre code:before, .markdown-body pre code:after, .markdown-body pre tt:before, .markdown-body pre tt:after {
  content: normal
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font-size: 11px;
  line-height: 10px;
  color: #555;
  vertical-align: middle;
  background-color: #fcfcfc;
  border: solid 1px #ccc;
  border-bottom-color: #bbb;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #bbb
}

.markdown-body ul {
  list-style: disc
}

.markdown-body ul ul, markdown-body ol ul {
  list-style: circle
}
```
