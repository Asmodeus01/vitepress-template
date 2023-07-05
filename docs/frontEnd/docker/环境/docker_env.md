# vue镜像接受环境变量

::: tip
平常开发时，环境变量都是作为在.env文件内进行配置，这样如果换了个环境则需要重新打包部署。
然而将环境变量改为镜像层面接受则可以避免这个问题的出现
:::

## 思路

* 在html标签上印上传来的环境变量
* 根据场景选择接受的方式
  ::: details .vue文件内使用
    * main.js获取html印上的环境变量并保存为全局
    * 页面接收参数
  :::
  ::: details .js文件内使用
    * 直接获取html印上的环境变量并使用
  :::
* 使用的地方获取到相应变量后进行业务处理

## 在html标签上印上传来的环境变量

dockerfile文件内配上相应的变量，这里以多变量的场景举例：
```dockerfile
FROM nginx

COPY ./dist /usr/share/nginx/html
# ENV_AUTH_PAGE_URL: 统一认证平台跳转地址
# ENV_AUTH_CLIENT_ID： ClientId
# /usr/share/nginx/html/为 nginx 默认的启动文件夹
CMD ["/bin/bash", "-c", "sed -i \"s@<html@<html ENV_AUTH_PAGE_URL=\"$ENV_AUTH_PAGE_URL\" ENV_AUTH_CLIENT_ID=\"$ENV_AUTH_CLIENT_ID\" @\" /usr/share/nginx/html/index.html; nginx -g \"daemon off;\""]
```
关键处：

`ENV_AUTH_PAGE_URL=\"$ENV_AUTH_PAGE_URL\" ENV_AUTH_CLIENT_ID=\"$ENV_AUTH_CLIENT_ID\"`

启动命令

`"sed -i \"s@<html@<html ENV_AUTH_PAGE_URL=\"$ENV_AUTH_PAGE_URL\" ENV_AUTH_CLIENT_ID=\"$ENV_AUTH_CLIENT_ID\" @\" /usr/share/nginx/html/index.html;"`

这行代码是指将 `/usr/share/nginx/html/index.html` 中的`<html` 替换成

`<html ENV_AUTH_PAGE_URL=\"$ENV_AUTH_PAGE_URL\ ENV_AUTH_CLIENT_ID=\"$ENV_AUTH_CLIENT_ID\"`

也就是说，当docker run 时，index.html中的html标签就添加了这样一个属性

## 根据场景选择接受的方式
#### .vue页面使用
1. main.js获取html印上的环境变量并保存为全局
2. 
* VUE3+TS:
```js
const app = createApp(App),
      ENV_AUTH_CLIENT_ID = document.querySelector("html").getAttribute("ENV_AUTH_CLIENT_ID")
// 获取html标签的ENV_AUTH_CLIENT_ID属性值
if (ENV_AUTH_PAGE_URL) {
// 配置全局变量 页面中使用 inject 接收
  app.provide('ENV',{
    $ENV_AUTH_CLIENT_ID:ENV_AUTH_CLIENT_ID
  })
}
```

* VUE2:
```js
const ENV_AUTH_CLIENT_ID = document.querySelector("html").getAttribute("ENV_AUTH_CLIENT_ID");
// 获取html标签的ENV_AUTH_CLIENT_ID属性值
if (ENV_AUTH_CLIENT_ID) {Vue.prototype.$ENV_AUTH_CLIENT_ID = `${ENV_AUTH_CLIENT_ID}`;// 将$ENV_AUTH_CLIENT_ID设置为vue全局变量
}
```
2. 页面使用

* VUE3+TS:
```js
import {inject} from 'vue'
// 获取全局对象
const $ENV:any = inject('ENV')
console.log($ENV.$ENV_AUTH_PAGE_URL,'globalglobal')

```

* VUE2:
  在app.vue中的export default添加如下代码
```js
  created() {
    console.log(this.$ENV_AUTH_CLIENT_ID);
  }
  // 打印出 this.ENV_AUTH_CLIENT_ID ，主要是为测试能否获取到这个变量
```

#### .js内使用
```js
const ENV_AUTH_CLIENT_ID = document.querySelector("html").getAttribute("ENV_AUTH_CLIENT_ID"); //直接获取到即可
```
