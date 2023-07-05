# 自定义VUE脚手架

环境准备

- [commander](https://github.com/tj/commander.js)  编写指令和处理命令行

安装

```
npm install commander
```

- [inquirer](https://www.npmjs.com/package/inquirer)  一个强大的交互式命令行工具

  使用教程参考：https://blog.csdn.net/qq_26733915/article/details/80461257

安装

```
npm install inquirer
```

- [download-git-repo](https://www.npmjs.com/package/download-git-repo)

  使用教程参考：
  

安装

```
npm install download-git-repo
```

- [ora](https://github.com/sindresorhus/ora) 进度转轮 用于node的控制台进度美化

安装

```
npm install ora
```

- [chalk](https://www.npmjs.com/package/chalk) node终端样式库 修改控制台输出内容样式

安装

```
npm install chalk
```




# npm link 用法

文件 会根据`package.json`上的配置，被链接到全局

```
"bin": {
    "yang": "bin/yang"
}
```

根目录下执行`npm link`，yang命令会被挂载到全局，输入yang命令就会执行bin/yang文件

`npm unlink`解绑全局命令







