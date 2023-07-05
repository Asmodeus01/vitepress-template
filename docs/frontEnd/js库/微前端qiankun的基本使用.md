## 什么是微前端

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** that can **ship features independently**. -- [Micro Frontends](https://micro-frontends.org/)
>
> 微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

微前端架构具备以下几个核心价值：

- 技术栈无关
  主框架不限制接入应用的技术栈，微应用具备完全自主权

- 独立开发、独立部署
  微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

- 增量升级

  在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略

- 独立运行时
  每个微应用之间状态隔离，运行时状态不共享

微前端架构旨在解决单体应用在一个相对长的时间跨度下，由于参与的人员、团队的增多、变迁，从一个普通应用演变成一个巨石应用([Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc))后，随之而来的应用不可维护的问题。这类问题在企业级 Web 应用中尤其常见。

更多关于微前端的相关介绍，推荐大家可以去看这几篇文章：

- [Micro Frontends](https://micro-frontends.org/)
- [Micro Frontends from martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)
- [可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028)
- [微前端的核心价值](https://zhuanlan.zhihu.com/p/95085796)



该文档使用`qiankun`场景为：一个项目的部分页面需要嵌入另一个项目的部分页面，使用`qiankun`代替`iframe`

## 主应用配置

环境安装

```
$ yarn add qiankun # 或者 npm i qiankun -S
```

1. 主应用基础配置

   参考官方网站

   `https://qiankun.umijs.org/zh/guide/tutorial#%E4%B8%BB%E5%BA%94%E7%94%A8`

2. 创建`Qiankun`类

   ```js
   import {
     registerMicroApps,
     start,
     setDefaultMountApp,
     runAfterFirstMounted
   } from 'qiankun';
   
   import app from "../main";
   
   export default class Qiankun {
   
     // 接入微应用的地址 
     static ENTRY = '//localhost:8081'
     // static ENTRY = 'http://192.168.1.173/qkvue/'
     // 微应用路由名称
     static APPNAME = 'app-vue'
     // 主应用根路由
     static BASEPAHT = '/qkmain'
   
   
     constructor({ pagePath, microPage, props, LifeCycles }) {
       console.log('[vue main] ', window.location);
       registerMicroApps([
         {
           name: Qiankun.APPNAME,
           entry: Qiankun.ENTRY,
           container: '#container',
           activeRule: `${Qiankun.BASEPAHT}${pagePath}/${Qiankun.APPNAME}`,
           props: {
             // 规定微应用的根路由
             baseUrl: `${Qiankun.BASEPAHT}${pagePath}/${Qiankun.APPNAME}`,
             // 微应用挂载完成后，微应用需要跳转的路由   
             microPage: microPage,
             // 将主应用的vue-bus传递给微应用，用来全局通信
             qkBus: app.$bus,
             // 其他参数
             ...props
           },
         },
       ], LifeCycles);
   
   
       // 启动 qiankun
       start({ singular: false, sandbox: { strictStyleIsolation: true } });
   
       // 设置主应用启动后默认进入的微应用。（表面上看就是改变地址栏路径）
       setDefaultMountApp(`${Qiankun.BASEPAHT}${pagePath}/${Qiankun.APPNAME}`);
       // 应用首次挂载完成
       runAfterFirstMounted(() => {
         console.log('[vue-main] runAfterFirstMounted');
       });
       // addGlobalUncaughtErrorHandler((event) => console.log('未捕获异常处理器', event));
     }
   
   ```

}
   ```
   
3. 主应用路由配置

   ```js
   const routes = [
     {
       // 需要嵌入微应用的页面路由使用通配符，匹配/home/开头的所有路由
       path: "/home/*",
       name: "Home",
       component: Home,
     },
   ];
   const router = new VueRouter({
       mode: "history",
       // 设置根路由
       base: '/qkmain/',
       routes,
   });
   ```

4. 主应用 `vue.config.js` 文件配置

   ```js
   module.exports = {
    	// 公共路径
       publicPath: '/qkmain/', //dist path
       outputDir: 'dist',
   };
   ```

   注意：`Qiankun.js`中的 `BASEPAHT`、`router.js`中的 `base`、`vue.config.js`中的 `publicPath`，这三个路径要保持一致

5. 在页面中调用`Qiankun.js`加载微应用

   ```js
   <script>
   import Qiankun from "@/qiankun/Qiankun";
   export default {
     name: "Home",
     mounted () {
       console.log('[vue main] home挂载完成');
       // 页面渲染完成后创建微应用
       this.$nextTick(() => {
         new Qiankun({
           // 传入当前页面路由
           pagePath: '/home',
           // 传入微应用要跳转的页面路由
           microPage: '/about',
         })
       })
     },
   };
   </script>
   ```

   

## 微应用配置

1. 微应用基础配置

参考官方网站

`https://qiankun.umijs.org/zh/guide/tutorial#vue-%E5%BE%AE%E5%BA%94%E7%94%A8`

2. 在 `src` 目录新增 `public-path.js`

```js
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

3. 微应用配合主应用只需要改造一下`main.js`

`main.js`

```js
import './public-path';
import Vue from "vue";
import App from "./App.vue";
import VueRouter from 'vue-router';
import routes from "./router";
import store from "./store";

Vue.config.productionTip = false;

let router = null
let instance = null
function render (props = {}) {
  const { container, baseUrl } = props
  router = new VueRouter({
    // 初始化微应用路由时，使用主应用分配的路由（baseUrl）
    base: window.__POWERED_BY_QIANKUN__ ? baseUrl : '/qkvue/',
    mode: 'history',
    routes,
  })
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时（window.__POWERED_BY_QIANKUN__用来判断微应用是在qiankun项目中运行还是独立运行）
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap () {
  console.log('[vue-app] vue app bootstraped');
}

export async function mount (props) {
  console.log('[vue-app] props from main framework vue-app1', props);
  // 获取主应用vue-bus实例，挂载在微应用全局,用于应用间通信
  Vue.prototype.$qkBus = props.qkBus
  // 主应用初始时传的参数
  Vue.prototype.$initData = props.initData
  // 将qiankun全局状态initGlobalState(state)的三个方法挂载到全局
  Vue.prototype.$onGlobalStateChange = props.onGlobalStateChange
  Vue.prototype.$setGlobalState = props.setGlobalState
  Vue.prototype.$offGlobalStateChange = props.offGlobalStateChange

  // 渲染微应用
  render(props)
  console.log("[vue-app] 渲染完成");
  // 微应用挂载完成后跳转主应用指定的路由
  router.push({ path: props.microPage })
}

export async function unmount () {
  console.log("[vue-app] 销毁");
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
```

4. 打包配置修改（`vue.config.js`）

   ```js
   const { name } = require('./package');
   module.exports = {
       devServer: {
           headers: {
               // 允许跨域
               'Access-Control-Allow-Origin': '*',
           },
       },
       configureWebpack: {
           output: {
               library: `${name}-[name]`,
               libraryTarget: 'umd', // 把微应用打包成 umd 库格式
               jsonpFunction: `webpackJsonp_${name}`,
           },
       },
   };
   ```



## 应用间通信

1. 使用`qiankun`提供的`initGlobalState(state)`管理全局状态

    使用方法见

   ​	`https://qiankun.umijs.org/zh/api#initglobalstatestate`

   ​	`page`

   ```js
   mounted(){
       // 监听qiankun全局状态变化
       this.$onGlobalStateChange((state, prev) => {
         // state: 变更后的状态; prev 变更前的状态
         console.log('监听qiankun全局状态变化', state, prev);
       }, true)
   }
   methods: {
       let state = {
           state1: xxx
       }
    	// 设置全局状态   
        this.$setGlobalState(state)
   },
   beforeDestroy(){
        this.$offGlobalStateChange()
   }
   ```

2. 使用`vue-bus`进行数据传递

   在以上步骤，主应用传递了一个`vue-bus`实例给微应用，微应用也将`vue-bus`挂载在自己的全局，下面我们将使用`vue-bus`进行数据传递

   （目前只试过在两个`vue`应用间使用`vue-bus`传值，如果`vue`应用和其他应用间使用`vue-bus`传值可能会翻车）

   ## **示例：**

   触发事件

   ```
   this.$qkBus.emit('sendUnitId', 
   {
       data: {
           id: item.id,
           type: item.type
       },
       success:()=>{},
       fail:()=>{}
   })
   ```

   监听事件

   ```
   mounted () {
       // 开始监听微应用事件
       this.$bus.on('sendUnitId', this.sendUnitId)
   },
   beforeDestroy () {
       // 页面销毁前一定要解除监听
       this.$bus.off('sendUnitId', this.sendUnitId)
   },
   methods: {
       sendUnitId ({ data, success, fail }) {
         // 使用数据请求接口
         axios({
           url: '',
           data: {id: data.id},
         }).then(res => {
           success(res)
         }).catch(err => {
           fail(err)
         })
       }
   }
   ```

   我们来约定下传参的规范

   | 参数    | 描述               | 是否必填 |
   | ------- | ------------------ | -------- |
   | data    | 传递的数据集合     | 否       |
   | success | 执行成功的回调函数 | 否       |
   | fail    | 执行失败的回调函数 | 否       |



## 部署

由于主应用和微应用的路由都是使用的`history`模式，所以在`nginx`配置文件需要进行相应的配置

如果主应用和微应用不是部署在同一域名下，微应用还需要配置允许跨域

1. 主应用

```nginx
location /qkmain/ {
    # history 模式相应的配置
    root         /usr/share/nginx/html/;
    try_files $uri $uri/ /qkmain/index.html;
}
```

2. 微应用

```nginx
location /qkvue/ {
    # 跨域配置
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,web-token,app-token,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Mx-ReqToken,X-Data-Type,X-Auth-Token,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # history 模式相应的配置
    root         /usr/share/nginx/html/;
    try_files $uri $uri/ /qkvue/index.html;
}
```

