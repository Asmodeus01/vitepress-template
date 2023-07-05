# vue项目如何实现新手引导功能

我们在登录一些网站时会出现“新手引导”操作，这可以帮助我们快速了解网站的各种操作和功能入口。下面我们来用js手动写一个新手引导。

- 获取需要引导的`dom`元素宽高和位置
- 绘制蒙版层
- 绘制信息窗口

### 一、获取需要引导的dom元素宽高和位置

假设我们要引导页面上一个class为 `guide-sczl-tab` 的div，使用 `getBoundingClientRect`方法获取元素信息

```js
// 获取元素位置，宽高
getDomPostion (stepItem) {
    let dom = document.getElementsByClassName('guide-sczl-tab')[0]
    let rect = dom.getBoundingClientRect()
    return rect
    // 将dom元素信息return
    // {
    //   bottom: 79
    //   height: 36
    //   left: 205
    //   right: 965
    //   top: 43
    //   width: 760
    //   x: 205
    //   y: 43
    // }
}
```

### 二、绘制遮罩层

新手引导的遮罩层一般是引导区域透明其他区域灰色，我们可以设置一个蒙版div，长宽位置都与被引导div一致，然后蒙版的边框设置灰色半透明且宽度覆盖整个网页。

```js
// 创建遮罩层
createShade (rect) {
    let top = rect.top
    let left = rect.left
    // 如果遮罩层存在则重新设置位置和内容
    let guideShade = document.getElementById('guide-shade')
    if (guideShade) {
        this.setStyle(guideShade, { rect, top, left }, this.shadeStyle)
    } else {
        let shade = document.createElement('div')
        // 设置id，方便对遮罩层的查找和删除
        shade.setAttribute('id', 'guide-shade')
        // 设置遮罩层样式
        this.setStyle(shade, { rect, top, left }, this.shadeStyle)
        // 插入到body中
        document.body.appendChild(shade)
    }
}
// 设置样式
setStyle (element, data, styleFun) {
    let styleObj = styleFun(data)
    for (const key in styleObj) {
        element.style[key] = styleObj[key]
    }
}
// 遮罩层样式
shadeStyle ({ rect, top, left }) {
    return {
        position: 'fixed',
        top: '0',
        left: '0',
        display: 'inline-block',
        width: rect.width + 'px',
        height: rect.height + 'px',
        borderTop: 'solid rgba(114, 114, 114, 0.8) ' + top + 'px',
        borderRight: 'solid rgba(114, 114, 114, 0.8) ' + 10000 + 'px',
        borderBottom: 'solid rgba(114, 114, 114, 0.8) ' + 10000 + 'px',
        borderLeft: 'solid rgba(114, 114, 114, 0.8) ' + left + 'px',
        boxSizing: 'content-box',
        zIndex: '2000',
        transitionProperty: 'border',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease-out',
    }
}
```

### 三、绘制信息窗口

信息窗口包含标题、内容、当前步骤、跳过按钮、下一步按钮、弹窗三角箭头

```js
// 创建信息窗口
createInfo (rect) {
    console.log(rect);
    // 创建信息窗口
    // 计算引导区域中心点
    let infoTop = rect.top + rect.height 
    let infoLeft = rect.left + rect.width / 2

    // 如果信息窗口存在则重新设置位置和内容
    let guideInfo = document.getElementById('guide-info')
    if (guideInfo) {
        guideInfo.style.top = infoTop + 'px'
        guideInfo.style.left = infoLeft + 'px'
        // 信息窗口标题
        let infoTitle = document.getElementById('guide-info-title')
        infoTitle.innerText = stepItem.title
        // 信息窗口内容
        let infoContent = document.getElementById('guide-info-content')
        infoContent.innerText = stepItem.content
        // 信息窗口步数
        let infoSkip = document.getElementById('guide-info-skip')
        infoSkip.innerText = `(${this.currentIndex + 1}/${this.currentPage.length})跳过`
        // 信息窗口按钮文字
        let infoNext = document.getElementById('guide-info-next')
        if (this.currentIndex + 1 < this.currentPage.length) {
            infoNext.innerText = '下一步'
        } else {
            infoNext.innerText = '完成引导'
        }

        let arrow = document.getElementById('guide-info-arrow')
        this.setStyle(arrow, { rect, stepItem }, this.arrowStyle)
    } else {
        // 创建信息窗口
        let infoWindow = document.createElement('div')
        infoWindow.setAttribute('id', 'guide-info')
        this.setStyle(infoWindow, { rect, top: infoTop, left: infoLeft }, this.infoWindowStyle)

        // 创建标题
        let title = document.createElement('div')
        title.setAttribute('id', 'guide-info-title')
        title.innerText = stepItem.title
        this.setStyle(title, {}, this.titleStyle)
        infoWindow.appendChild(title)

        // 创建内容
        let content = document.createElement('div')
        content.setAttribute('id', 'guide-info-content')
        content.innerText = stepItem.content
        this.setStyle(content, {}, this.contentStyle)
        infoWindow.appendChild(content)

        // 创建下一步按钮和跳过
        let operate = document.createElement('div')
        this.setStyle(operate, {}, this.operateStyle)
        // 创建跳过按钮
        let skip = document.createElement('div')
        skip.setAttribute('id', 'guide-info-skip')
        skip.innerText = `(${this.currentIndex + 1}/${this.currentPage.length})跳过`
        this.setStyle(skip, {}, this.skipStyle)
        // 绑定点击事件
        skip.addEventListener('click', () => {
            console.log("点击跳过");
            this.stop()
        })
        operate.appendChild(skip)
        // 创建下一步按钮
        let next = document.createElement('button')
        next.setAttribute('id', 'guide-info-next')
        if (this.currentIndex + 1 < this.currentPage.length) {
            next.innerText = '下一步'
        } else {
            next.innerText = '完成引导'
        }
        this.setStyle(next, {}, this.nextStyle)
        // 绑定点击事件
        next.addEventListener('click', () => {
            console.log("点击下一步");
            this.next()
        })

        operate.appendChild(next)
        infoWindow.appendChild(operate)

        // 创建弹窗三角箭头
        let arrow = document.createElement('div')
        arrow.setAttribute('id', 'guide-info-arrow')
        this.setStyle(arrow, { rect, stepItem }, this.arrowStyle)

        infoWindow.appendChild(arrow)

        document.body.appendChild(infoWindow)
    }
}
// 信息窗口样式
infoWindowStyle ({ top, left }) {
    return {
        position: 'fixed',
        top: top + 'px',
        left: left + 'px',
        width: '360' + 'px',
        minHeight: '100' + 'px',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '1px 1px 10px 5px rgba(114, 114, 114, 0.8)',
        zIndex: '3000',
        transitionProperty: 'top left',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease-out',
    }
}
titleStyle () {
    return {
        fontSize: '18px',
        fontWeight: 'bold',
        lineHeight: '21px',
        color: '#313131'
    }
}
contentStyle () {
    return {
        padding: '10px 0 20px 0',
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '21px',
        color: '#787878'
    }
}
operateStyle () {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}
skipStyle () {
    return {
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '21px',
        color: '#787878',
        cursor: 'pointer'
    }
}
nextStyle () {
    return {
        height: '25px',
        fontSize: '14px',
        fontFamily: 'PingFang SC',
        fontWeight: 'bold',
        lineHeight: '21px',
        color: '#ffffff',
        background: '#3B71C6',
        border: '1px solid #3B71C6',
        borderRadius: '4px',
        cursor: 'pointer'
    }
}
arrowStyle ({ rect, stepItem }) {
    let direction = stepItem.direction || 'top'
    let arrowTop = 0
    let arrowLeft = 0
    let border = {}
    // 箭头方向
    if (direction === 'top') {
        arrowTop = rect.top + rect.height + stepItem.offset.shade[0] + 20
        arrowLeft = rect.left + rect.width / 2 + stepItem.offset.shade[1] - 160
        border = {
            borderRight: '10px solid transparent',
            borderLeft: '10px solid transparent',
            borderTop: '0 solid #ffffff',
            borderBottom: '20px solid #ffffff',
        }
    } else if (direction === 'bottom') {
        arrowTop = rect.top - stepItem.offset.shade[0] - 20
        arrowLeft = rect.left + rect.width / 2 + stepItem.offset.shade[1] - 160
        border = {
            borderRight: '10px solid transparent',
            borderLeft: '10px solid transparent',
            borderTop: '20px solid #ffffff',
            borderBottom: '0 solid #ffffff',
        }
    }
    // 是否隐藏箭头
    let display = ''
    if (stepItem.hiddenArrow) {
        display = 'none'
    } else {
        display = ''
    }


    return {
        position: 'fixed',
        top: arrowTop - 12 + 'px',
        left: arrowLeft + 150 + 'px',
        display: display,
        width: '0',
        height: '0',
        ...border,
        transitionProperty: 'top left',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease-out'
    }
}
```

### 四、完整代码：

我们代码封装一下

```js

export default class StepGuide {
  // 需要引导的列表集合
  static guideList = {
    // 市场总览
    'sczl': [{
      title: '导航',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-sczl-tab')
        return doms.length ? doms[0] : null
      },
      content: '支持查看A股IPO、再融资、并购重组、精选层挂牌数据各个维度分析，在页面上方切换各个交易类型；',
      // 偏差,最终的位置=（原top+offset[0],原left+offset[1]） [top,left]
      offset: {
        // 遮罩层 位置偏移[top,left]
        shade: [0, 0],
        // 弹窗层 位置偏移[top,left]
        info: [0, 0]
      },
      // 展示前的额外函数
      showBefore: () => {
        let appMain = document.getElementsByClassName('app-main')[0]
        appMain.scrollTo(0, 0)
      }
    }, {
      title: '更多筛选条件',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-sczl-more')
        return doms.length ? doms[0] : null
      },
      content: '支持展开或者收起查看更多筛选条件，如企业性质、上市板块等；',
      offset: {
        shade: [0, 0],
        info: [0, 0]
      },
    }, {
      title: '项目阶段',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-sczl-xmjd')
        return doms.length ? doms[0] : null
      },
      content: '支持切换已完成（已上市、已发行），已过会（已过会待上市、已过会待发行）、在审、辅导/预案、被否、终止各个阶段查看数据；',
      offset: {
        shade: [0, 30],
        info: [0, 0]
      },
      // 展示前的额外函数
      showBefore: (page) => {
        page.$refs.searchForm.isFold = true
      }
    }, {
      title: '券商排行榜下载',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-sczl-download')
        return doms.length ? doms[0] : null
      },
      content: '查看筛选条件下券商排名情况，支持数据下载；',
      offset: {
        shade: [0, 0],
        info: [0, -140]
      },
    }, {
      title: '卡片框行业图形切换',
      getDom: () => {
        let doms = document.getElementsByClassName('tools-left')
        return doms.length ? doms[3] : null
      },
      content: '支持切换柱状体、饼状图、横向柱状图查看图形分布；',
      offset: {
        shade: [0, 0],
        info: [0, 0]
      },
      // 箭头方向，默认向上'top'，向下'bottom'
      // direction: 'bottom',
      // 展示前的额外函数
      showBefore: (page) => {
        page.$refs.searchForm.isFold = false
        let appMain = document.getElementsByClassName('app-main')[0]
        appMain.scrollTo(0, 550)
      }
    }],

    // 项目数据
    'xmsj': [{
      title: '项目列表',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-xmsj-projectList')
        return doms.length ? doms[0] : null
      },
      content: '支持字段库配置，筛选各个业务类型展示字段；',
      // 偏差,最终的位置=（原top+offset[0],原left+offset[1]） [top,left]
      offset: {
        shade: [0, 0],
        info: [-500, 0]
      },
      // 隐藏箭头？
      hiddenArrow: true,
      // 展示前的额外函数
      showBefore: () => {
        let appMain = document.getElementsByClassName('app-main')[0]
        appMain.scrollTo(0, 0)
      }
    }, {
      title: '项目详情',
      getDom: () => {
        let doms = document.getElementsByClassName('guide-xmsj-projectDetails')
        return doms.length ? doms[0] : null
      },
      content: '支持查看项目时间轴及项目发行情况总览；',
      // 偏差,最终的位置=（原top+offset[0],原left+offset[1]） [top,left]
      offset: {
        shade: [0, 0],
        info: [-200, 0],
      },
      // 箭头方向，默认向上'top'，向下'bottom'
      direction: 'bottom',
      // 展示前的额外函数
      showBefore: () => {
        let appMain = document.getElementsByClassName('app-main')[0]
        appMain.scrollTo(0, 550)
      }
    }
    ],
  }
  // 当前页面名
  pageName = ''
  // 当前页面的引导列表
  currentPage = []
  // 当前页面实例
  page = null
  // 当前引导步骤下标
  currentIndex = 0

  constructor(pageName, page) {
    this.pageName = pageName
    this.currentPage = StepGuide.guideList[pageName]
    this.page = page
  }

  // 开始引导
  start () {
    if (this.isFirst()) {
      this.currentIndex = 0
      let stepItem = this.currentPage[this.currentIndex]
      this.setGuide(stepItem)
    }
  }

  // 判断这个页面是否为第一次进入
  isFirst () {
    let first = localStorage.getItem('isFirst')
    first = JSON.parse(first)
    if (first && first[this.pageName]) {
      return false
    } else {
      // 是第一次，并存在缓存
      localStorage.setItem('isFirst', JSON.stringify({ ...first, [this.pageName]: true }))
      return true
    }
  }

  // 停止引导
  stop () {
    this.closeShade()
    this.closeInfo()
  }

  // 下一步引导 
  next () {
    if (this.currentIndex + 1 < this.currentPage.length) {
      this.currentIndex++
      let stepItem = this.currentPage[this.currentIndex]
      this.setGuide(stepItem)
    } else {
      this.stop()
    }
  }

  // 上一步引导
  back () {
    if (this.currentIndex > 0) {
      this.currentIndex--
      let stepItem = this.currentPage[this.currentIndex]
      this.setGuide(stepItem)
    }
  }
  // 设置引导
  setGuide (stepItem) {
    this.page.$nextTick(() => {
      // 执行展示前的回调函数
      if (stepItem.showBefore) {
        stepItem.showBefore(this.page)
      }
      // 获取元素位置，宽高
      let rect = this.getDomPostion(stepItem)
      // 创建元素
      if (rect) {
        console.log('rect', rect);
        // this.closeShade()
        // 创建遮罩层
        this.createShade(rect, stepItem)
        // 创建信息窗口
        this.createInfo(rect, stepItem)
      }
    })
  }

  // 获取元素位置，宽高
  getDomPostion (stepItem) {
    let dom = stepItem.getDom()
    if (dom) {
      let rect = dom.getBoundingClientRect()
      // {
      //   bottom: 79
      //   height: 36
      //   left: 205
      //   right: 965
      //   top: 43
      //   width: 760
      //   x: 205
      //   y: 43
      // }
      return rect
    } else {
      console.warn("未发现dom:", stepItem.title);
      return null
    }
  }

  // 创建遮罩层
  createShade (rect, stepItem) {
    let top = rect.top + stepItem.offset.shade[0]
    let left = rect.left + stepItem.offset.shade[1]
    // 如果遮罩层存在则重新设置位置和内容
    let guideShade = document.getElementById('guide-shade')
    if (guideShade) {
      this.setStyle(guideShade, { rect, top, left }, this.shadeStyle)
    } else {
      let shade = document.createElement('div')
      shade.setAttribute('id', 'guide-shade')
      this.setStyle(shade, { rect, top, left }, this.shadeStyle)
      // 插入到body中
      document.body.appendChild(shade)
    }
  }

  // 创建信息窗口
  createInfo (rect, stepItem) {
    console.log(rect);
    // 创建信息窗口
    // 计算引导区域中心点
    let infoTop = rect.top + rect.height + stepItem.offset.info[0] + 20
    let infoLeft = rect.left + rect.width / 2 + stepItem.offset.info[1] - 180

    // 如果信息窗口存在则重新设置位置和内容
    let guideInfo = document.getElementById('guide-info')
    if (guideInfo) {
      guideInfo.style.top = infoTop + 'px'
      guideInfo.style.left = infoLeft + 'px'
      // 信息窗口标题
      let infoTitle = document.getElementById('guide-info-title')
      infoTitle.innerText = stepItem.title
      // 信息窗口内容
      let infoContent = document.getElementById('guide-info-content')
      infoContent.innerText = stepItem.content
      // 信息窗口步数
      let infoSkip = document.getElementById('guide-info-skip')
      infoSkip.innerText = `(${this.currentIndex + 1}/${this.currentPage.length})跳过`
      // 信息窗口按钮文字
      let infoNext = document.getElementById('guide-info-next')
      if (this.currentIndex + 1 < this.currentPage.length) {
        infoNext.innerText = '下一步'
      } else {
        infoNext.innerText = '完成引导'
      }

      let arrow = document.getElementById('guide-info-arrow')
      this.setStyle(arrow, { rect, stepItem }, this.arrowStyle)
    } else {
      // 创建信息窗口
      let infoWindow = document.createElement('div')
      infoWindow.setAttribute('id', 'guide-info')
      this.setStyle(infoWindow, { rect, top: infoTop, left: infoLeft }, this.infoWindowStyle)

      // 创建标题
      let title = document.createElement('div')
      title.setAttribute('id', 'guide-info-title')
      title.innerText = stepItem.title
      this.setStyle(title, {}, this.titleStyle)
      infoWindow.appendChild(title)

      // 创建内容
      let content = document.createElement('div')
      content.setAttribute('id', 'guide-info-content')
      content.innerText = stepItem.content
      this.setStyle(content, {}, this.contentStyle)
      infoWindow.appendChild(content)

      // 创建下一步按钮和跳过
      let operate = document.createElement('div')
      this.setStyle(operate, {}, this.operateStyle)
      // 创建跳过按钮
      let skip = document.createElement('div')
      skip.setAttribute('id', 'guide-info-skip')
      skip.innerText = `(${this.currentIndex + 1}/${this.currentPage.length})跳过`
      this.setStyle(skip, {}, this.skipStyle)
      // 绑定点击事件
      skip.addEventListener('click', () => {
        console.log("点击跳过");
        this.stop()
      })
      operate.appendChild(skip)
      // 创建下一步按钮
      let next = document.createElement('button')
      next.setAttribute('id', 'guide-info-next')
      if (this.currentIndex + 1 < this.currentPage.length) {
        next.innerText = '下一步'
      } else {
        next.innerText = '完成引导'
      }
      this.setStyle(next, {}, this.nextStyle)
      // 绑定点击事件
      next.addEventListener('click', () => {
        console.log("点击下一步");
        this.next()
      })

      operate.appendChild(next)
      infoWindow.appendChild(operate)

      // 创建弹窗三角箭头
      let arrow = document.createElement('div')
      arrow.setAttribute('id', 'guide-info-arrow')
      this.setStyle(arrow, { rect, stepItem }, this.arrowStyle)

      infoWindow.appendChild(arrow)

      document.body.appendChild(infoWindow)
    }
  }
  // 关闭遮罩层
  closeShade () {
    let shade = document.getElementById('guide-shade')
    shade && document.body.removeChild(shade)
  }
  // 关闭信息窗口
  closeInfo () {
    let info = document.getElementById('guide-info')
    info && document.body.removeChild(info)
  }

  // 设置样式
  setStyle (element, data, styleFun) {
    let styleObj = styleFun(data)
    for (const key in styleObj) {
      element.style[key] = styleObj[key]
    }
  }

  // 遮罩层样式
  shadeStyle ({ rect, top, left }) {
    return {
      position: 'fixed',
      top: '0',
      left: '0',
      display: 'inline-block',
      width: rect.width + 'px',
      height: rect.height + 'px',
      borderTop: 'solid rgba(114, 114, 114, 0.8) ' + top + 'px',
      borderRight: 'solid rgba(114, 114, 114, 0.8) ' + 10000 + 'px',
      borderBottom: 'solid rgba(114, 114, 114, 0.8) ' + 10000 + 'px',
      borderLeft: 'solid rgba(114, 114, 114, 0.8) ' + left + 'px',
      boxSizing: 'content-box',
      zIndex: '2000',
      transitionProperty: 'border',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
    }
  }

  // 信息窗口样式
  infoWindowStyle ({ top, left }) {
    return {
      position: 'fixed',
      top: top + 'px',
      left: left + 'px',
      width: '360' + 'px',
      minHeight: '100' + 'px',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '4px',
      boxShadow: '1px 1px 10px 5px rgba(114, 114, 114, 0.8)',
      zIndex: '3000',
      transitionProperty: 'top left',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
    }
  }
  titleStyle () {
    return {
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '21px',
      color: '#313131'
    }
  }
  contentStyle () {
    return {
      padding: '10px 0 20px 0',
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '21px',
      color: '#787878'
    }
  }
  operateStyle () {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }
  skipStyle () {
    return {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '21px',
      color: '#787878',
      cursor: 'pointer'
    }
  }
  nextStyle () {
    return {
      height: '25px',
      fontSize: '14px',
      fontFamily: 'PingFang SC',
      fontWeight: 'bold',
      lineHeight: '21px',
      color: '#ffffff',
      background: '#3B71C6',
      border: '1px solid #3B71C6',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }
  arrowStyle ({ rect, stepItem }) {
    let direction = stepItem.direction || 'top'
    let arrowTop = 0
    let arrowLeft = 0
    let border = {}
    // 箭头方向
    if (direction === 'top') {
      arrowTop = rect.top + rect.height + stepItem.offset.shade[0] + 20
      arrowLeft = rect.left + rect.width / 2 + stepItem.offset.shade[1] - 160
      border = {
        borderRight: '10px solid transparent',
        borderLeft: '10px solid transparent',
        borderTop: '0 solid #ffffff',
        borderBottom: '20px solid #ffffff',
      }
    } else if (direction === 'bottom') {
      arrowTop = rect.top - stepItem.offset.shade[0] - 20
      arrowLeft = rect.left + rect.width / 2 + stepItem.offset.shade[1] - 160
      border = {
        borderRight: '10px solid transparent',
        borderLeft: '10px solid transparent',
        borderTop: '20px solid #ffffff',
        borderBottom: '0 solid #ffffff',
      }
    }
    // 是否隐藏箭头
    let display = ''
    if (stepItem.hiddenArrow) {
      display = 'none'
    } else {
      display = ''
    }


    return {
      position: 'fixed',
      top: arrowTop - 12 + 'px',
      left: arrowLeft + 150 + 'px',
      display: display,
      width: '0',
      height: '0',
      ...border,
      transitionProperty: 'top left',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out'
    }
  }
}
```

