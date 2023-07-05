---
title: IndexedDB入门
tags: npm
---
# IndexedDB入门

> 随着浏览器的功能不断增强，越来越多的网站开始考虑，将大量数据储存在客户端，这样可以减少从服务器获取数据，直接从本地获取数据。

> 通俗地讲，IndexedDB 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。这些都是 LocalStorage 所不具备的。就数据库类型而言，IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

## IndexedDB浏览器兼容

Desktop

| Feature                  | Chrome                                                       | Edge   | Firefox (Gecko)                                              | Internet Explorer | Opera  | Safari (WebKit) |
| :----------------------- | :----------------------------------------------------------- | :----- | :----------------------------------------------------------- | :---------------- | :----- | :-------------- |
| 基础支持                 | 23 [webkit](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Prefixes)24 (unprefixed) 38 (prefixes deprecated) 57 (prefixes removed) | 支持   | [10.0](https://developer.mozilla.org/en-US/Firefox/Releases/10) (10.0) [moz](https://developer.mozilla.org/en-US/docs/Web/Guide/Prefixes) [16.0](https://developer.mozilla.org/en-US/Firefox/Releases/16) (16.0) | 10                | 15     | 7.1, partial 10 |
| worker中是否支持         | (支持) (unprefixed) 38 (prefixes deprecated) 57 (prefixes removed) | 支持   | [37.0](https://developer.mozilla.org/en-US/Firefox/Releases/37) [37.0](1) | 支持              | 支持   | 10              |
| 隐私模式中是否支持[3]    | 支持                                                         | 不支持 | 不支持                                                       | 不支持            | 不支持 | 不支持          |
| `IDBLocaleAwareKeyRange` | 不支持                                                       | 不支持 | [43.0](https://developer.mozilla.org/en-US/Firefox/Releases/43) [43.0](2) | 不支持            | 不支持 | 不支持          |
| Indexed Database 2.0     | 58                                                           | ？     | ？                                                           | ？                | 45     |                 |

Mobile

| Feature  | Android | Firefox Mobile (Gecko)                                       | IE Phone | Opera Mobile | Safari Mobile |
| :------- | :------ | :----------------------------------------------------------- | :------- | :----------- | :------------ |
| 异步 API | 未实现  | [6.0](https://developer.mozilla.org/en-US/Firefox/Releases/6) (6.0) [moz](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Prefixes) | 未实现   | 未实现       | 未实现        |

## 使用步骤

1. 创建/打开数据库
2. 在数据库中创建一个对象仓库（object store）
3. 启动一个业务(如:增、删、改、查)
4. 通过监听指定的事件以等待操作完成.
5. 数据库操作完毕后进行接下来业务操作

### 一、创建/打开数据库

#####

```javascript
 // 初始设置IndexedDB 各个浏览器的IndexedDB名不相同
  mounted () {
  this.idb = window.indexedDB || // Use the standard DB API
               window.mozIndexedDB || // Or Firefox's early version of it
              window.webkitIndexedDB // Or Chrome's early version
    this.init()
  },
  methods:{
   // 初始化
    init () {
     // 设置要打开的indexedDB
      // this.idb.open(${要打开的数据库名},${数据库版本})
      this.reqDb = this.idb.open('test')
      
     // 打开数据库完毕的回调
      this.reqDb.onsuccess = (e) => {
     // 打开完毕后返回一个IDBRequest对象
        this.db = this.reqDb.result
      // 调用创建对象仓库的方法
        this.initDb({ dbName: 'downLoad' })
      }
      // 打开数据库失败的回调
      this.reqDb.onerror = (event) => {
      }
      // 数据库更新的回调(第一次打开因为涉及到创建数据库所以必然触发)
      this.reqDb.onupgradeneeded = (event) => {
      // 存储数据库实例
        this.db = event.target.result
      // 调用创建对象仓库的方法
        this.initDb({ dbName: 'downLoad' })
      }
    },
  }
```

> 每次修改对象仓库结构时都务必要升级数据库版本( **window.indexedDB.open({要打开的数据库名},{最新的数据库版本必须大于之前的版本}**))

### 二、在数据库中创建一个对象仓库（object store）

``` javascript
    initDb ({ dbName }) {
      var objectStore
      // 判断该对象仓库是否存在,若不存在的话则创建
      if (!this.db.objectStoreNames.contains(dbName)) {
      // @params {String} dbName 对象仓库名
      // @params {String} keyPath 唯一标识
        objectStore = this.db.createObjectStore(dbName, { keyPath: 'id' })
        
        objectStore.createIndex('info', 'info', { unique: false })
      } 
    },
```

### 三、启动一个业务



#### (一)、插入数据

``` javascript
    insetIdxDb ({dbName}) {
       
      // 根据传入的对象仓库名返回一个对事务对象; indexDB数据库只有 readwrite 和 readonly 两个状态
      var request = this.db.transaction([dbName], 'readwrite');
      // objectStore方法返回指定的对象仓库
      var store = request.objectStore(dbName);
      // 要添加的单条数据 之前创建对象仓库时候的唯一标识必传且必须唯一
      var params={
        id:new Date().getTime(),
        name:'测试数据name',
        info:'添加测试数据'
      }
      // 插入单条数据
      store.add(params)
      // 插入完成后的回调
      request.onsuccess = (event) => {
      }
      // 插入失败的回调用
      request.onerror = function (event) {
      }
    },
```



#### (二)、删除数据

``` javascript
    delIdxDb ({dbName,key}) {
       
      // 根据传入的对象仓库名返回一个对事务对象; indexDB数据库只有 readwrite 和 readonly 两个状态
      var request = this.db.transaction([dbName], 'readwrite');
      // objectStore方法返回指定的对象仓库
      var store = request.objectStore(dbName);
      // 根据传过来的key匹配上相应的唯一标识来删除
      store.delete(key)
      // 删除完成后的回调
      store.onsuccess = (event) => {
      }
      // 删除失败的回调用
      store.onerror = function (event) {
      }
    },
```



#### (三)、删除全部

``` javascript
    delIdxDb ({dbName,key}) {
       
      // 根据传入的对象仓库名找到相应的仓库来触发清除方法进行全部删除; indexDB数据库只有 readwrite 和 readonly 两个状态
      var request = this.db.transaction([type], 'readwrite').objectStore(type).clear()
      // 删除完成后的回调
      store.onsuccess = (event) => {
      }
      // 删除失败的回调用
      store.onerror = function (event) {
      }
    },
```

#### (四)、修改数据

``` javascript
    upDateIdxDb ({dbName}) {
       
      // 根据传入的对象仓库名返回一个对事务对象; indexDB数据库只有 readwrite 和 readonly 两个状态
      var request = this.db.transaction([dbName], 'readwrite');
      // objectStore方法返回指定的对象仓库
      var store = request.objectStore(dbName);
      // 要修改的单条数据 之前创建对象仓库时候的唯一标识必传且必须唯一
      var params={
        id:1644803130544,  //要修改的信息其keyPath
        name:'修改测试数据名',
        info:'修改Info'
      }
      // 修改单条数据
      store.put(params)
      // 插入完成后的回调
      request.onsuccess = (event) => {
      }
      // 插入失败的回调用
      request.onerror = function (event) {
      }
    },
```



#### (五)、查询数据

``` javascript
    getList ({ dbName }) {
      const list = []
      // 获取要操作的对象仓库
      var objectStore = this.db.transaction(dbName).objectStore(dbName)
      // 触发数据库遍历方法 会对该对象仓库进行遍历,将每一条数据都逐个读取
      let cur = objectStore.openCursor();
      // 每一条遍历成功后的回调
      cur.onsuccess = (event) => {
      // 每一条遍历出来的信息
        var cursor = event.target.result
        if (cursor) {
      // 将遍历出来的单条信息push进整体
          list.push(cursor.value)
      // 继续下一条信息的遍历
          cursor.continue()
      // 若信息不存在的话说明已经遍历完成,将查到的所有信息传回去
        } else {
      // 将查到的list传回去
          this[dbName] = list
          console.log('没有更多数据了！')
        }
      }
    },
```
