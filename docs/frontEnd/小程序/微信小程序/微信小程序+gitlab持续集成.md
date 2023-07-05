# 微信小程序+gitlab持续集成

[[toc]]

实现自动化部署我们需要微信提供的包 [miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci)

官方文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html



## 准备阶段

1. 下载依赖

```shell
npm install miniprogram-ci --save
```

2. 获取AppID

打开微信公众平台-开发-开发管理-开发设置-开发中ID-AppID(小程序ID)

3. 下载小程序代码上传密钥

打开微信公众平台-开发-开发管理-开发设置-小程序代码上传-小程序代码上传密钥

4. 配置IP白名单

打开微信公众平台-开发-开发管理-开发设置-小程序代码上传-IP白名单，将自己的公网IP设置上去



## 修改项目结构

小程序的代码包最大为2M所以不能将CI脚本及miniprogram-ci依赖打包进小程序的代码中

我们把小程序的代码和CI的代码分别放入两个独立文件夹中

.

├── ci（CI代码）

│  ├── build

│  │  └── private.wx.key（把下载的密钥粘贴到该文件）

│  └── packNpmUpload.wx.js（微信小程序CI脚本文件）

├── myApp（微信小程序代码）

│  ├── package.json（小程序的npm依赖）

├── .gitlab-ci.yml（gitlab CI脚本文件）

└── package.json（CI脚本的npm依赖）



## .gitlab-ci.yml文件编写

因为CI脚本需要依赖，微信小程序myApp项目中也需要npm依赖，所以需要在根目录和myApp中npm install两次

```yml
stages:
    - production-env
    
cache:
  key: ${CI_BUILD_REF_NAME}
  paths:
    # 需要缓存的文件夹，将npm依赖和小程序构建后的包缓存下来
    - node_modules/
    - good-reading/node_modules/
    - good-reading/miniprogram_npm/

test:
    stage: production-env
    only:
    		# 上传到master分支时触发脚本
        - master
    script:
        - echo "begin"
        # 下载CI脚本依赖
        - npm install
        - cd ./good-reading
        # 下载小程序npm依赖
        - npm install
        - cd ..
        # 执行上传脚本
        - node ./ci/packNpmUpload.wx.js
        - echo "end"
```

## packNpmUpload.wx.js文件编写

```js
const ci = require('miniprogram-ci')

// 创建项目对象
const project = new ci.Project({
  // 合法的小程序/小游戏 appid
  appid: 'wx1ae03755aa5a4e68',
  // 显示指明当前的项目类型, 默认为 miniProgram，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin
  type: 'miniProgram',
  // 项目的路径，即 project.config.json 所在的目录
  projectPath: process.cwd() + '/myApp',
  // 密钥文件位置
  privateKeyPath: process.cwd() + '/ci/build/private.wx.key',
  // 指定需要排除的规则
  ignores: ['node_modules/**/*'],
})
// 打包后上传
packNpm()


// 构建npm,如果小程序依赖了npm包需要先构建npm
function packNpm () {
  ci.packNpm(
    // project项目对象
    project,{
      // 指定构建npm需要排除的规则
      ignores: ['pack_npm_ignore_list'],
      // 构建回调信息
      reporter: (infos) => { console.log(infos) }
    }).then(res => {
    console.log('npm构建成功，开始上传');
    console.log(res);
    // 调用上传方法
    upload()
  }).catch(error => {
    console.log('npm构建失败')
    console.log(error);
    process.exit(-1)
  })
}


function upload () {
  // 获取版本号和描述
  let {
    version: version,
    description: description
  } = require('../good-reading/package.json')
  if (!version) version = '1.0.0'
  if (!description) description = new Date() + '上传'

  ci.upload({
    // 项目对象
    project,
    // 自定义版本号
    version,
    // 自定义备注
    desc: description,
    // 编译设置
    setting: {
      es6: true,
      minify: true,
    },
    // 进度更新监听函数
    onProgressUpdate: console.log,
    // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
    robot: 30
  }).then(res => {
    console.log(res)
    console.log('上传成功，请前往微信公众平台-小程序-版本管理-开发版本，查看“ci机器人30”提交的版本进行提交审核')
  }).catch(error => {
    if (error.errCode == -1) {
      console.log('上传成功，请前往微信公众平台-小程序-版本管理-开发版本，查看“ci机器人30”提交的版本进行提交审核')
    }
    console.log(error)
    console.log('上传失败')
    process.exit(-1)
  })
}
```

执行完成后在小程序的版本管理中就可以看到ci机器人提交的版本了



