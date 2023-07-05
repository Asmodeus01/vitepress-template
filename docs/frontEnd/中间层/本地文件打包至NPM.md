---
title: 本地文件打包至NPM
tags: npm
---

## 一、 进入自己的项目（或npm init创建）

可以使用npm init 创建也可以使用vue/cli搭建；<br/>在新项目中会有package.json 和入口文件（默认是 index.js）

```javascript
npm init
```



## 二、 登录NPM

* 执行命令 npm login  登陆，根据提示输入 *用户名* 、 *密码* 、 *邮箱*

```javascript
npm login  //登录npm账号
```

![登录成功](https://gitee.com/Asmodeus12/typora-table/raw/master/image/20211203135426.png)

<img src="https://gitee.com/Asmodeus12/typora-table/raw/master/image/20211203135423.png" alt="登录成功" />

* 可以通过 npm whoami 来查看当前登陆的用户名

```javascript
npm whoami //查看登录状态
```



## 三、 发布

* 执行 npm publish 来发布代码到npm上；**以后每次发布都需要修改版本号，否则会发布失败**

```javascript
npm publish  //将当前工程代码上传到npm上
```

* 出现加号代表发布成功

![发布成功](https://gitee.com/Asmodeus12/typora-table/raw/master/image/20211203135431.png)



## 四、 删除已经发布的包

删除一个已经发布的包是一件非常严肃的事情。 如果有别的包或用户对要删除的包有依赖，那会造成很大的问题<br/>命令行执行 npm unpublish ModuleName --force 删除包；npm unpublish ModuleName@a.b.c 来删除指定版本
**注意：**即使删除了已经发布的包，重新发布新的包时，新包的名字也不能和被删除的包的名称重复了；根据规范，只有在发包后的24小时内才允许删除这个包

```javascript
npm unpublish ${ModuleName} --force  //删除整个包  ModuleName:定义的文件包名
npm unpublish ${ModuleName}@${a.b.c}  //删除某个包的指定版本  ModuleName:定义的文件包名  a.b.c:删除的版本号
```



## 五、 常见问题

### 1. 账号邮箱没验证

![账号邮箱没验证](https://gitee.com/Asmodeus12/typora-table/raw/master/image/20211203135436.png)

* 登录npm官网进行邮箱验证

### 2. 包的命名过长

![包的命名过长](https://gitee.com/Asmodeus12/typora-table/raw/master/image/20211203135441.png)

* 修改命名长度

### 3. npm ERR! no_perms Private mode enable, only admin can publish this module

* 执行 npm config get registry 检查是否使用淘宝镜像 若是改为原本的地址

``` javascript
 npm config get registry  //检查当前设置的地址
 npm config set registry=http://registry.npmjs.org  //将NPM设置为原本的地址
```

* 改回淘宝镜像地址

```javascript
npm config set registry=https://registry.npm.taobao.org
```



### 4.包完全删除后24小时内不允许发布同一个包

* 包完全删除后24小时内不允许发布同一个包
