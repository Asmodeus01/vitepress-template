# 安装依赖

`基础包`

`yarn add bpmn-js `

`npm install bpmn-js`



`bpmn-js-properties-panel面板插件`

`yarn add bpmn-js-properties-panel `

`yarn add camunda-bpmn-moddle `

`npm install bpmn-js-properties-panel `

`npm install camunda-bpmn-moddle`



# 基本功能实现



``` vue
<template>
  <div class="containers">
    <!-- canvas div 用来绑定建模器 -->  
    <div class="canvas"
         ref="canvas"></div>
    <!-- 右侧属性面板 需要自己操作style放置它位置 -->
    <div class="rightTool-box">
      <!-- id="js-properties-panel" 这个div用来绑定右侧属性面板 -->
      <div class="bpmn-js-properties-panel"
           id="js-properties-panel">
      </div>
    </div>
  </div>
</template>

<script>
// 引入建模器
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 引入默认模板 （一个bpmn文件字符串）
import bpmnTemplate from './pizza-collaboration.js'

// 引入属性面板相关的插件(还需要在main.js引入相关样式)
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import propertiesPanelModule from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

export default {
  data () {
    //这里存放数据
    return {
      // bpmn建模器
      bpmnModeler: null
    };
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    // 页面挂载完成时初始化建模器  
    this.initModeler()
  },
  //方法集合
  methods: {
    // 初始化Bpmn建模器
    initModeler () {
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas
	  // 创建建模器对象
      this.bpmnModeler = new BpmnModeler({
        // 指定dom元素
        container: canvas,
        // 添加右侧属性面板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 右侧属性面板
          propertiesProviderModule,
          propertiesPanelModule
        ],
        // 模块拓展
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })
      // 初始化的时候 创建默认流程图模板
      this.createNewDiagram(bpmnTemplate)
    },
    // 创建流程图
    createNewDiagram (bpmn) {
      this.bpmnModeler.importXML(bpmn, (err) => {
        if (err) {
          console.log("err", err);
        } else {
          console.log("success");
        }
      })
    }
  },
}
```



# 左侧工具栏

`左侧工具栏只要引入相关样式`

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 以下为bpmn工作流绘图工具的样式
// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css' 
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 右边属性面板样式
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' 

new Vue({
  render: h => h(App),
}).$mount('#app')

```



# 实现新建、导入，导出bpmn、导出svg操作

``` vue
<template>
  <div class="containers">
    <!-- 导入、新建、导出bpmn、导出svg 4个操作按钮 -->  
    <div class="tools-box">
      <el-button icon="el-icon-folder-opened"
                 @click="openBpmn"></el-button>
      <el-button class="new"
                 icon="el-icon-circle-plus"
                 @click="newDiagram"></el-button>
      <el-button icon="el-icon-download"
                 @click="downloadBpmn"></el-button>
      <el-button icon="el-icon-picture"
                 @click="downloadSvg"></el-button>
    </div>
    <!-- 隐藏的 a 标签，用于下载 bpmn -->
    <a hidden
       ref="downloadLink"></a>
  </div>
</template>
<script>
export default {
  //方法集合
  methods: {
    // 创建流程图
    createNewDiagram (bpmn) {
      this.bpmnModeler.importXML(bpmn, (err) => {
        if (err) {
          console.error("error", err);
        } else {
          console.log("success");
        }
      })
    },
    // 导入bpmn图片
    openBpmn () {
      // 创建input标签用来选择文件  
      var inputObj = document.createElement('input')
      inputObj.setAttribute('id', 'file');
      inputObj.setAttribute('type', 'file');
      inputObj.setAttribute('name', 'file');
      inputObj.setAttribute('accept', '.bpmn');
      inputObj.setAttribute("style", 'visibility:hidden');
      document.body.appendChild(inputObj);
      // 点击选择文件
      inputObj.click();
      inputObj.addEventListener('change', e => {
        const file = e.target.files[0]
        const reader = new FileReader();
        // 读取File对象中的文本信息，编码格式为UTF-8
        reader.readAsText(file, "utf-8");
        reader.onload = () => {
          //读取完毕后将文本信息导入到Bpmn建模器
          this.createNewDiagram(reader.result);
        }
      })
    },
    // 导出svg
    downloadSvg () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.svg`;

          // 从建模器画布中提取svg图形标签
          let context = "";
          const djsGroupAll = this.$refs.canvas.querySelectorAll(".djs-group");
          for (let item of djsGroupAll) {
            context += item.innerHTML;
          }
          // 获取svg的基本数据，长宽高 
          const viewport = this.$refs.canvas
            .querySelector(".viewport")
            .getBBox();

          // 将标签和数据拼接成一个完整正常的svg图形
          const svg = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="${viewport.width}"
          height="${viewport.height}"
          viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
          version="1.1"
          >
          ${context}
        </svg>
      `;
          // 将文件名以及数据交给下载函数
          this.download({ name: name, data: svg });
        }
      });
    },
    // 点击下载按钮 导出bpmn文件
    downloadBpmn () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.bpmn`;
          // 将文件名以及数据交给下载函数
          this.download({ name: name, data: xml });
        }
      });
    },
    // 下载操作
    download ({ name = "diagram.bpmn", data }) {
      // 获取之前设置的隐藏a链接
      const downloadLink = this.$refs.downloadLink;
      // 把数据转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);
      if (data) {
        // 将数据给到链接
        downloadLink.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        // 设置文件名
        downloadLink.download = name;
        // 触发点击事件开始下载
        downloadLink.click();
      }
    },
    // 获取文件名 拿模型ID作为文件名
    getFilename (xml) {
      let start = xml.indexOf("process");
      let filename = xml.substr(start, xml.indexOf(">"));
      filename = filename.substr(filename.indexOf("id") + 4);
      filename = filename.substr(0, filename.indexOf('"'));
      return filename;
    },
    // 新建按钮 就是设置默认模板
    newDiagram () {
      this.createNewDiagram(bpmnTemplate);
    },
  },
}
</script>
```



# 事件监听



``` vue
// 创建流程图
createNewDiagram (bpmn) {
  this.bpmnModeler.importXML(bpmn, (err) => {
    if (err) {
      console.error("流程图创建 error", err);
    } else {
      console.log("流程图创建 success");
	  // 流程图创建成功后进行事件监听
      this.addModelerListener()
    }
  })
},
// 监听 modeler 事件
addModelerListener () {
  // 给modeler上添加要绑定的事件 需要给 modeler 绑定
  const events = ['shape.added', 'shape.move.end', 'shape.removed', 'connect.end', 'connect.move']
  events.forEach(event => {
    this.bpmnModeler.on(event, e => {
      console.log("event, e", event, e)
      var elementRegistry = this.bpmnModeler.get('elementRegistry')
      var shape = e.element ? elementRegistry.get(e.element.id) : e.shape
      console.log("shape", shape)
    })
  })
},
```



# 全部事件列表

|      |                                                        |                                                              |                                          |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------- |
| 序号 | 事件名                                                 | 说明                                                         | callback参数                             |
| 0    | "diagram.destroy"                                      | 流程编辑器销毁                                               | event:InternalEvent                      |
| 1    | "render.shape"                                         | 调用GraphicsFactory.drawShape时触发，开始渲染形状            |                                          |
| 2    | "render.connection"                                    | 调用GraphicsFactory.drawConnection时触发，开始渲染连线       |                                          |
| 3    | "render.getShapePath"                                  | 调用GraphicsFactory.getShapePath时触发，开始获取形状路径     |                                          |
| 4    | "render.getConnectionPath"                             | 调用GraphicsFactory.getConnectionPath时触发                  |                                          |
| 5    | "diagram.init"                                         | 指示画布已准备好在其上进行绘制                               |                                          |
| 6    | "shape.added"                                          | 已更新到xml内，触发渲染方法，返回值为插入的新元素            | event:InternalEvent, element: Element    |
| 7    | "connection.added"                                     | 已更新到xml内，触发渲染方法，返回值为插入的新元素            | event:InternalEvent, element: Element    |
| 8    | "shape.removed"                                        | 形状移除完成，返回值为被移除元素                             | event:InternalEvent, element: Element    |
| 9    | "connection.removed"                                   | 连线移除完成，返回值为被移除元素                             |                                          |
| 10   | "elements.changed"                                     | 元素发生改变并更改完成                                       | event: InternalEvent, element: Elements  |
| 11   | "diagram.clear"                                        | 流程编辑器元素及画布已清空                                   | event:InternalEvent                      |
| 12   | "canvas.destroy"                                       | 画布销毁                                                     | event:InternalEvent                      |
| 13   | "canvas.init"                                          | 画布初始化完成                                               |                                          |
| 14   | "shape.changed"                                        | 形状属性更新，返回当前元素                                   | event:InternalEvent, element: Element    |
| 15   | "connection.changed"                                   | 连线属性更新，返回当前元素                                   | event:InternalEvent, element: Element    |
| 16   | "interactionEvents.createHit"                          | shape.added,connection.added之后触发                         |                                          |
| 17   | "interactionEvents.updateHit"                          | shape.changed,connection.changed之后触发                     |                                          |
| 18   | "shape.remove"                                         | 形状被选中移除，返回被移除的元素对象                         | event:InternalEvent, element: Element    |
| 19   | "connection.remove"                                    | 连线被选中移除                                               | event:InternalEvent, element: Element    |
| 20   | "element.hover"                                        | 鼠标移动到元素上，返回鼠标位置处元素对象                     | event:InternalEvent, element: Element    |
| 21   | "element.out"                                          | 鼠标移出元素，返回鼠标最近移入的元素对象                     | event:InternalEvent, element: Element    |
| 22   | "selection.changed"                                    | 选中元素变化时，返回新选中的元素对象                         | event:InternalEvent, element: Element    |
| 23   | "create.end"                                           | 从palette中新建的元素创建完成（不清楚为什么有两个相同的参数） | event:InternalEvent, event:InternalEvent |
| 24   | "connect.end"                                          | 从palette中或者从选中节点中新建的连线元素创建完成（不清楚为什么有两个相同的参数） | event:InternalEvent, event:InternalEvent |
| 25   | "shape.move.end"                                       | 形状元素移动结束后                                           | event:InternalEvent, element: Element    |
| 26   | "element.click"                                        | 元素单击事件                                                 | event:InternalEvent, element: Element    |
| 27   | "canvas.viewbox.changing"                              | 视图缩放过程中                                               | event:InternalEvent                      |
| 28   | "canvas.viewbox.changed"                               | 视图缩放完成                                                 | event:InternalEvent, viewbox: Viewbox    |
| 29   | "element.changed"                                      | 元素发生改变时触发，返回发生改变的元素                       | event:InternalEvent, element: Element    |
| 30   | "element.marker.update"                                | 元素标识更新时触发                                           |                                          |
| 31   | "attach"                                               | 画布或者根节点重新挂载时                                     |                                          |
| 32   | "detach"                                               | 画布或者根节点移除挂载时                                     |                                          |
| 33   | "editorActions.init"                                   | 流程编辑模块加载完成                                         |                                          |
| 34   | "keyboard.keydown"                                     | 键盘按键按下                                                 |                                          |
| 35   | "element.mousedown"                                    | 鼠标在元素上按下时触发                                       | event:InternalEvent, element: Element    |
| 36   | "commandStack.connection.start.canExecute"             | 连线开始时检测是否可以创建连线，点击创建连线的按钮时触发     |                                          |
| 37   | "commandStack.connection.create.canExecute"            | 连线开始时检测是否可以创建连线，                             |                                          |
| 38   | "commandStack.connection.reconnect.canExecute"         | 检测连线是否可以修改                                         |                                          |
| 39   | "commandStack.connection.updateWaypoints.canExecute"   | 检测是否可以更新连线拐点                                     |                                          |
| 40   | "commandStack.shape.resize.canExecute"                 | 检测形状是否可以更改大小                                     |                                          |
| 41   | "commandStack.elements.create.canExecute"              | 检测是否可以创建元素                                         |                                          |
| 42   | "commandStack.elements.move.canExecute"                | 检测是否可以移动元素                                         |                                          |
| 43   | "commandStack.shape.create.canExecute"                 | 检测是否可以创建形状                                         |                                          |
| 44   | "commandStack.shape.attach.canExecute"                 | 检测元素是否可以挂载到目标上                                 |                                          |
| 45   | "commandStack.element.copy.canExecute"                 | 检测元素是否可以被复制                                       |                                          |
| 46   | "shape.move.start"                                     | 形状开始移动                                                 | event:InternalEvent, element: Element    |
| 47   | "shape.move.move"                                      | 形状移动过程中                                               | event:InternalEvent, element: Element    |
| 48   | "elements.delete"                                      | 元素被删除，返回被删除的元素                                 | event:InternalEvent, element: Element    |
| 49   | "tool-manager.update"                                  |                                                              |                                          |
| 50   | "i18n.changed"                                         |                                                              |                                          |
| 51   | "drag.move"                                            | 元素拖拽过程中                                               | event:InternalEvent, event:InternalEvent |
| 52   | "contextPad.create"                                    | 当contextPad出现的时候触发                                   | event:InternalEvent, element: Element    |
| 53   | "palette.create"                                       | 左侧palette开始创建                                          |                                          |
| 54   | "autoPlace.end"                                        | 自动对齐结束                                                 |                                          |
| 55   | "autoPlace"                                            | 触发自动对齐方法时                                           |                                          |
| 56   | "drag.start"                                           | 元素拖拽开始                                                 | event:InternalEvent, event:InternalEvent |
| 57   | "drag.init"                                            | 点击了元素即将进行拖拽（包括点击palette和画布内的元素）      | event:InternalEvent, event:InternalEvent |
| 58   | "drag.cleanup"                                         | 元素拖拽结束                                                 | event:InternalEvent, event:InternalEvent |
| 59   | "commandStack.shape.create.postExecuted"               | 当创建形节点的时候触发                                       | event:InternalEvent, event:InternalEvent |
| 60   | "commandStack.elements.move.postExecuted"              | 当元素移动的时候触发                                         | event:InternalEvent, event:InternalEvent |
| 61   | "commandStack.shape.toggleCollapse.postExecuted"       | 当可折叠的节点展开/折叠的时候触发                            | event:InternalEvent, event:InternalEvent |
| 62   | "commandStack.shape.resize.postExecuted"               | 当节点大小发生改变的时候触发                                 | event:InternalEvent, event:InternalEvent |
| 63   | "commandStack.element.autoResize.canExecute"           | 当节点大小发生自动调整的时候触发                             | event:InternalEvent, event:InternalEvent |
| 64   | "bendpoint.move.hover"                                 | 鼠标点击连线折点并进行移动时触发                             | event:InternalEvent, event:InternalEvent |
| 65   | "bendpoint.move.out"                                   | 返回时间不定，可能在拖动时触发，也可能在拖动过程中           | event:InternalEvent, event:InternalEvent |
| 66   | "bendpoint.move.cleanup"                               | 鼠标点击连线折点时或者移动折点完成                           | event:InternalEvent, event:InternalEvent |
| 67   | "bendpoint.move.end"                                   | 鼠标点击连线折点并移动完成                                   | event:InternalEvent, event:InternalEvent |
| 68   | "connectionSegment.move.start"                         | 鼠标选中连线进行拖动开始                                     | event:InternalEvent, event:InternalEvent |
| 69   | "connectionSegment.move.move"                          | 鼠标选中连线进行拖动过程中                                   | event:InternalEvent, event:InternalEvent |
| 70   | "connectionSegment.move.hover"                         | 鼠标选中连线进行拖动开始                                     | event:InternalEvent, event:InternalEvent |
| 71   | "connectionSegment.move.out"                           | 鼠标选中连线，按下鼠标时                                     | event:InternalEvent, event:InternalEvent |
| 72   | "connectionSegment.move.cleanup"                       | 鼠标选中连线后放开鼠标时                                     | event:InternalEvent, event:InternalEvent |
| 73   | "connectionSegment.move.cancel"                        | 选中连线之后取消连接                                         | event:InternalEvent, event:InternalEvent |
| 74   | "connectionSegment.move.end"                           | 选中连线并拖拽结束                                           | event:InternalEvent, event:InternalEvent |
| 75   | "element.mousemove"                                    | 鼠标移除元素后                                               |                                          |
| 76   | "element.updateId"                                     | 更新元素id时触发                                             |                                          |
| 77   | "bendpoint.move.move"                                  | 连线上的拐点被拖拽移动时触发                                 |                                          |
| 78   | "bendpoint.move.start"                                 | 连线上的拐点被拖拽移动开始时触发                             |                                          |
| 79   | "bendpoint.move.cancel"                                | 连线上的拐点被点击并取消拖拽                                 |                                          |
| 80   | "connect.move"                                         | 连线被移动时                                                 |                                          |
| 81   | "connect.hover"                                        |                                                              |                                          |
| 82   | "connect.out"                                          |                                                              |                                          |
| 83   | "connect.cleanup"                                      |                                                              |                                          |
| 84   | "create.move"                                          |                                                              |                                          |
| 85   | "create.hover"                                         |                                                              |                                          |
| 86   | "create.out"                                           |                                                              |                                          |
| 87   | "create.cleanup"                                       |                                                              |                                          |
| 88   | "create.init"                                          |                                                              |                                          |
| 89   | "copyPaste.copyElement"                                |                                                              |                                          |
| 90   | "copyPaste.pasteElements"                              |                                                              |                                          |
| 91   | "moddleCopy.canCopyProperties"                         |                                                              |                                          |
| 92   | "moddleCopy.canCopyProperty"                           |                                                              |                                          |
| 93   | "moddleCopy.canSetCopiedProperty"                      |                                                              |                                          |
| 94   | "copyPaste.pasteElement"                               |                                                              |                                          |
| 95   | "popupMenu.getProviders.bpmn-replace"                  |                                                              |                                          |
| 96   | "contextPad.getProviders"                              |                                                              |                                          |
| 97   | "resize.move"                                          |                                                              |                                          |
| 98   | "resize.end"                                           |                                                              |                                          |
| 99   | "commandStack.shape.resize.preExecute"                 |                                                              |                                          |
| 100  | "spaceTool.move"                                       |                                                              |                                          |
| 101  | "spaceTool.end"                                        |                                                              |                                          |
| 102  | "create.start"                                         |                                                              |                                          |
| 103  | "commandStack.connection.create.postExecuted"          |                                                              |                                          |
| 104  | "commandStack.connection.layout.postExecuted"          |                                                              |                                          |
| 105  | "shape.move.init"                                      |                                                              |                                          |
| 106  | "resize.start"                                         |                                                              |                                          |
| 107  | "resize.cleanup"                                       |                                                              |                                          |
| 108  | "directEditing.activate"                               |                                                              |                                          |
| 109  | "directEditing.resize"                                 |                                                              |                                          |
| 110  | "directEditing.complete"                               |                                                              |                                          |
| 111  | "directEditing.cancel"                                 |                                                              |                                          |
| 112  | "commandStack.connection.updateWaypoints.postExecuted" |                                                              |                                          |
| 113  | "commandStack.label.create.postExecuted"               |                                                              |                                          |
| 114  | "commandStack.elements.create.postExecuted"            |                                                              |                                          |
| 115  | "commandStack.shape.append.preExecute"                 |                                                              |                                          |
| 116  | "commandStack.shape.move.postExecute"                  |                                                              |                                          |
| 117  | "commandStack.elements.move.preExecute"                |                                                              |                                          |
| 118  | "commandStack.connection.create.postExecute"           |                                                              |                                          |
| 119  | "commandStack.connection.reconnect.postExecute"        |                                                              |                                          |
| 120  | "commandStack.shape.create.executed"                   |                                                              |                                          |
| 121  | "commandStack.shape.create.reverted"                   |                                                              |                                          |
| 122  | "commandStack.shape.create.preExecute"                 |                                                              |                                          |
| 123  | "shape.move.hover"                                     |                                                              |                                          |
| 124  | "global-connect.hover"                                 |                                                              |                                          |
| 125  | "global-connect.out"                                   |                                                              |                                          |
| 126  | "global-connect.end"                                   |                                                              |                                          |
| 127  | "global-connect.cleanup"                               |                                                              |                                          |
| 128  | "connect.start"                                        |                                                              |                                          |
| 129  | "commandStack.shape.create.execute"                    |                                                              |                                          |
| 130  | "commandStack.shape.create.revert"                     |                                                              |                                          |
| 131  | "commandStack.shape.create.postExecute"                |                                                              |                                          |
| 132  | "commandStack.elements.create.preExecute"              |                                                              |                                          |
| 133  | "commandStack.elements.create.revert"                  |                                                              |                                          |
| 134  | "commandStack.elements.create.postExecute"             |                                                              |                                          |
| 135  | "commandStack.connection.layout.executed"              |                                                              |                                          |
| 136  | "commandStack.connection.create.executed"              |                                                              |                                          |
| 137  | "commandStack.connection.layout.reverted"              |                                                              |                                          |
| 138  | "commandStack.shape.move.executed"                     |                                                              |                                          |
| 139  | "commandStack.shape.delete.executed"                   |                                                              |                                          |
| 140  | "commandStack.connection.move.executed"                |                                                              |                                          |
| 141  | "commandStack.connection.delete.executed"              |                                                              |                                          |
| 142  | "commandStack.shape.move.reverted"                     |                                                              |                                          |
| 143  | "commandStack.shape.delete.reverted"                   |                                                              |                                          |
| 144  | "commandStack.connection.create.reverted"              |                                                              |                                          |
| 145  | "commandStack.connection.move.reverted"                |                                                              |                                          |
| 146  | "commandStack.connection.delete.reverted"              |                                                              |                                          |
| 147  | "commandStack.canvas.updateRoot.executed"              |                                                              |                                          |
| 148  | "commandStack.canvas.updateRoot.reverted"              |                                                              |                                          |
| 149  | "commandStack.shape.resize.executed"                   |                                                              |                                          |
| 150  | "commandStack.shape.resize.reverted"                   |                                                              |                                          |
| 151  | "commandStack.connection.reconnect.executed"           |                                                              |                                          |
| 152  | "commandStack.connection.reconnect.reverted"           |                                                              |                                          |
| 153  | "commandStack.connection.updateWaypoints.executed"     |                                                              |                                          |
| 154  | "commandStack.connection.updateWaypoints.reverted"     |                                                              |                                          |
| 155  | "commandStack.element.updateAttachment.executed"       |                                                              |                                          |
| 156  | "commandStack.element.updateAttachment.reverted"       |                                                              |                                          |
| 157  | "commandStack.shape.delete.postExecute"                |                                                              |                                          |
| 158  | "commandStack.canvas.updateRoot.postExecute"           |                                                              |                                          |
| 159  | "spaceTool.selection.init"                             |                                                              |                                          |
| 160  | "spaceTool.selection.ended"                            |                                                              |                                          |
| 161  | "spaceTool.selection.canceled"                         |                                                              |                                          |
| 162  | "spaceTool.ended"                                      |                                                              |                                          |
| 163  | "spaceTool.canceled"                                   |                                                              |                                          |
| 164  | "spaceTool.selection.end"                              |                                                              |                                          |
| 165  | "commandStack.shape.delete.postExecuted"               |                                                              |                                          |
| 166  | "commandStack.connection.create.preExecuted"           |                                                              |                                          |
| 167  | "commandStack.shape.replace.preExecuted"               |                                                              |                                          |
| 168  | "bpmnElement.added"                                    |                                                              |                                          |
| 169  | "commandStack.element.updateProperties.postExecute"    |                                                              |                                          |
| 170  | "commandStack或者.label.create.postExecute"            |                                                              |                                          |
| 171  | "commandStack.connection.layout.postExecute"           |                                                              |                                          |
| 172  | "commandStack.connection.updateWaypoints.postExecute"  |                                                              |                                          |
| 173  | "commandStack.shape.replace.postExecute"               |                                                              |                                          |
| 174  | "commandStack.shape.resize.postExecute"                |                                                              |                                          |
| 175  | "shape.move.rejected"                                  |                                                              |                                          |
| 176  | "create.rejected"                                      |                                                              |                                          |
| 177  | "elements.paste.rejected"                              |                                                              |                                          |
| 178  | "commandStack.shape.delete.preExecute"                 |                                                              |                                          |
| 179  | "commandStack.connection.reconnect.preExecute"         |                                                              |                                          |
| 180  | "commandStack.element.updateProperties.postExecuted"   |                                                              |                                          |
| 181  | "commandStack.shape.replace.postExecuted"              |                                                              |                                          |
| 182  | "commandStack.shape.toggleCollapse.executed"           |                                                              |                                          |
| 183  | "commandStack.shape.toggleCollapse.reverted"           |                                                              |                                          |
| 184  | "spaceTool.getMinDimensions"                           |                                                              |                                          |
| 185  | "commandStack.connection.delete.preExecute"            |                                                              |                                          |
| 186  | "commandStack.canvas.updateRoot.preExecute"            |                                                              |                                          |
| 187  | "commandStack.spaceTool.preExecute"                    |                                                              |                                          |
| 188  | "commandStack.lane.add.preExecute"                     |                                                              |                                          |
| 189  | "commandStack.lane.resize.preExecute"                  |                                                              |                                          |
| 190  | "commandStack.lane.split.preExecute"                   |                                                              |                                          |
| 191  | "commandStack.elements.delete.preExecute"              |                                                              |                                          |
| 192  | "commandStack.shape.move.preExecute"                   |                                                              |                                          |
| 193  | "commandStack.spaceTool.postExecuted"                  |                                                              |                                          |
| 194  | "commandStack.lane.add.postExecuted"                   |                                                              |                                          |
| 195  | "commandStack.lane.resize.postExecuted"                |                                                              |                                          |
| 196  | "commandStack.lane.split.postExecuted"                 |                                                              |                                          |
| 197  | "commandStack.elements.delete.postExecuted"            |                                                              |                                          |
| 198  | "commandStack.shape.move.postExecuted"                 |                                                              |                                          |
| 199  | "saveXML.start"                                        |                                                              |                                          |
| 200  | "commandStack.connection.create.preExecute"            |                                                              |                                          |
| 201  | "commandStack.connection.move.preExecute"              |                                                              |                                          |
| 202  | "shape.move.out"                                       |                                                              |                                          |
| 203  | "shape.move.cleanup"                                   |                                                              |                                          |
| 204  | "commandStack.elements.move.preExecuted"               |                                                              |                                          |
| 205  | "commandStack.shape.delete.execute"                    |                                                              |                                          |
| 206  | "commandStack.shape.delete.revert"                     |                                                              |                                          |
| 207  | "spaceTool.selection.start"                            |                                                              |                                          |
| 208  | "spaceTool.selection.move"                             |                                                              |                                          |
| 209  | "spaceTool.selection.cleanup"                          |                                                              |                                          |
| 210  | "spaceTool.cleanup"                                    |                                                              |                                          |
| 211  | "lasso.selection.init"                                 |                                                              |                                          |
| 212  | "lasso.selection.ended"                                |                                                              |                                          |
| 213  | "lasso.selection.canceled"                             |                                                              |                                          |
| 214  | "lasso.ended"                                          |                                                              |                                          |
| 215  | "lasso.canceled"                                       |                                                              |                                          |
| 216  | "lasso.selection.end"                                  |                                                              |                                          |
| 217  | "lasso.end"                                            |                                                              |                                          |
| 218  | "lasso.start"                                          |                                                              |                                          |
| 219  | "lasso.move"                                           |                                                              |                                          |
| 220  | "lasso.cleanup"                                        |                                                              |                                          |
| 221  | "hand.init"                                            |                                                              |                                          |
| 222  | "hand.ended"                                           |                                                              |                                          |
| 223  | "hand.canceled"                                        |                                                              |                                          |
| 224  | "hand.move.ended"                                      |                                                              |                                          |
| 225  | "hand.move.canceled"                                   |                                                              |                                          |
| 226  | "hand.end"                                             |                                                              |                                          |
| 227  | "hand.move.move"                                       |                                                              |                                          |
| 228  | "hand.move.end"                                        |                                                              |                                          |
| 229  | "global-connect.init"                                  |                                                              |                                          |
| 230  | "global-connect.ended"                                 |                                                              |                                          |
| 231  | "global-connect.canceled"                              |                                                              |                                          |
| 232  | "global-connect.drag.ended"                            |                                                              |                                          |
| 233  | "global-connect.drag.canceled"                         |                                                              |                                          |
| 234  | "palette.getProviders"                                 |                                                              |                                          |
| 235  | "propertiesPanel.isEntryVisible"                       |                                                              |                                          |
| 236  | "propertiesPanel.isPropertyEditable"                   |                                                              |                                          |
| 237  | "root.added"                                           |                                                              |                                          |
| 238  | "propertiesPanel.changed"                              |                                                              |                                          |
| 239  | "propertiesPanel.resized"                              |                                                              |                                          |
| 240  | "elementTemplates.changed"                             |                                                              |                                          |
| 241  | "canvas.resized"                                       |                                                              |                                          |
| 242  | "import.parse.complete"                                | 读取模型（xml）完成                                          |                                          |
| 243  | "commandStack.changed"                                 | 发生任意可撤销/恢复操作时触发，可用来实时更新xml             |                                          |



# 自定义Palette 、Renderer

`自定义左侧工具栏Palette节点样式,但拖到页面上还是'裸体状态',所以还要自定义`

## 在默认的Palette、Renderer基础上修改



`建立文件目录`

- `custom`
  - `CustomPalette.js`
  - `CustomRenderer.js`
  - `index.js`



`CustomPalette.js`

```js
export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    // 在类中使用palette.registerProvider(this)指定这是一个 palette
    palette.registerProvider(this);
  }
  // 这个函数就是绘制palette的核心
  getPaletteEntries () {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;
    // 利用bpmn.js提供的一些方法创建shape然后将其添加到画布上
    function createTask () {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:Task'); // 其实这个也可以不要
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject
        });
        console.log(shape) // 只在拖动或者点击时触发
        create.start(event, shape);
      }
    }

    return {
      'create.lindaidai-task': {
        // 属于哪个分组, 比如tools、event、gateway、activity等等,用于分类
        group: 'model',
        // bpmn-icon-task 这个类名是默认样式, color-style是自定义的类可用于改颜色
        // className: 'bpmn-icon-task color-style',
        // 完全自定义类名
        className: 'icon-custom lindaidai-task',
        // 鼠标移动到元素上面给出的提示信息
        title: translate('创建一个类型为lindaidai-task的任务节点'),
        // 用户操作时会触发的事件
        action: {
          dragstart: createTask(),
          click: createTask()
        }
      }
    }
  }

}

// 使用 $inject 注入一些需要的变量
CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
]
```

`CustomRenderer.js`

```js
// 引入默认的renderer
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg'
import { customElements, customConfig } from '@/utils/bpmnUtils'
// 最高优先级 HIGH_PRIORITY不能够去掉, 否则不会执行下面的drawShpe函数
const HIGH_PRIORITY = 1500
// 继承 BaseRenderer
export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)
    this.bpmnRenderer = bpmnRenderer
  }

  canRender (element) {
    // ignore labels
    return !element.labelTarget
  }
  // 核心函数就是绘制shape
  drawShape (parentNode, element) {
    // 获取到类型
    const type = element.type
    if (customElements.includes(type)) { // or customConfig[type]
      const { url, attr } = customConfig[type]
      const customIcon = svgCreate('image', { // 在这里创建了一个image
        ...attr,
        href: url
      })
      element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
      element['height'] = attr.height
      svgAppend(parentNode, customIcon)
      return customIcon
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element)
    return shape
  }

  getShapePath (shape) {
    return this.bpmnRenderer.getShapePath(shape)
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer']
```

`utils/bpmnUtils.js`

```js
// 自定义元素的类型 因为创建的 lindaidai-task 的类型就是 bpmn:Task 类型的.
// 这个数组的作用就是用来放哪些类型是需要我们自定义的, 从而在渲染的时候就可以与不需要自定义的元素作区分.
const customElements = ['bpmn:Task']
// 自定义元素的配置(后面会用到)
const customConfig = {
  'bpmn:Task': {
    'url': 'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png',
    'attr': { x: 0, y: 0, width: 48, height: 48 }
  }
}

export { customElements, customConfig }
```

`index.js`

```js
import CustomPalette from "./CustomPalette";

export default {
  // __init__ 后面的名字 必须是 customPalette ！！！
  __init__: ['customPalette'],
  // 下面的key也必须是 customPalette
  customPalette: ['type', CustomPalette]
}
```

`创建样式文件bpmn.css 然后在main.js引入`

```css
/* 写自定义样式时选择器 .必要类名.自定义 类名
    中间不能有空格
*/

/* bpmn-icon-task 这个默认类会加上默认样式 （黑色边框） */
.bpmn-icon-task.color-style{
  color: blue;
}

/* 如果想自定义图片则不需要默认样式 */
/* 定义一个公共的类名 */
.icon-custom {
  border-radius: 50%;
  background-size: 65%;
  background-repeat: no-repeat;
  background-position: center;
}
/* 加上背景图 */
.icon-custom.lindaidai-task {
  background-image: url('https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png');
}
```

`最后使用自定义 palette`

```js
// 导入自定义 palette
import customModule from "./custom/index";

this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [
          // 自定义的palette节点
          customModule
        ]
      })
    },
```



## 完全自定义Palette、Renderer

`重写BpmnModeler这个类了, 实现自己独有的一套modeler.`

`目录结构`
- `customModeler`
  - `custom `
    - `CustomPalette.js`
    - `CustomRender.js`
    - `index.js`
  - `index.js`

`custom/CustomPalette.js`

```js
// 在这里是直接重写了PaletteProvider这个类, 同时覆盖了其原型上的getPaletteEntries方法, 从而达到覆盖原有的工具栏的效果.
export default function PaletteProvider (palette, create, elementFactory, globalConnect) {
  this.create = create
  this.elementFactory = elementFactory
  this.globalConnect = globalConnect

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect'
]

PaletteProvider.prototype.getPaletteEntries = function () { // 此方法和上面案例的一样
  const {
    create,
    elementFactory
  } = this;

  function createTask () {
    return function (event) {
      const shape = elementFactory.createShape({
        type: 'bpmn:Task'
      });
      console.log(shape) // 只在拖动或者点击时触发
      create.start(event, shape);
    }
  }

  return {
    'create.lindaidai-task': {
      group: 'model',
      className: 'icon-custom lindaidai-task',
      title: '创建一个类型为lindaidai-task的任务节点',
      action: {
        dragstart: createTask(),
        click: createTask()
      }
    }
  }
}
```

`CustomRender.js`

```js
import inherits from 'inherits'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg'

import { customElements, customConfig } from '@/utils/bpmnUtils.js'
/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer (eventBus) {
  BaseRenderer.call(this, eventBus, 2000)
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles']

CustomRenderer.prototype.canRender = function (element) {
  // ignore labels
  return !element.labelTarget;
}

CustomRenderer.prototype.drawShape = function (parentNode, element) {
  const type = element.type // 获取到类型
  if (customElements.includes(type)) { // or customConfig[type]
    const { url, attr } = customConfig[type]
    const customIcon = svgCreate('image', {
      ...attr,
      href: url
    })
    element['width'] = attr.width // 这里我是取了巧, 直接修改了元素的宽高
    element['height'] = attr.height
    svgAppend(parentNode, customIcon)
    console.log("element", element, !customElements.includes(type) && element.businessObject.name);
    // 判断是否有name属性来决定是否要渲染出label
    if (customElements.includes(type) && element.businessObject.name) {
      const text = svgCreate('text', {
        x: attr.x,
        y: attr.y + attr.height + 10, // y取的是父元素的y+height+20
        "font-size": "10",
        "fill": "#000"
      })
      text.innerHTML = element.businessObject.name
      svgAppend(parentNode, text)
      console.log(text)
    }
    return customIcon
  }
}

CustomRenderer.prototype.getShapePath = function (shape) {
  console.log(shape)
}
```

`custom/index.js`

```js
import CustomPalette from "./CustomPalette";
import CustomRenderer from "./CustomRender";

export default {
  // __init__ 后面的名字 必须是 paletteProvider ！！！
  __init__: ['paletteProvider', 'customRenderer'],
  // 下面的key也必须是 paletteProvider
  paletteProvider: ['type', CustomPalette],
  customRenderer: ['type', CustomRenderer]
}
```

`customModeler/index.js`

```js
import Modeler from 'bpmn-js/lib/Modeler'

import inherits from 'inherits'

import CustomModule from './custom'

export default function CustomModeler (options) {
  Modeler.call(this, options)

  this._customElements = []
}

inherits(CustomModeler, Modeler)

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [CustomModule]
)
```

`使用完全自定义的工具栏`

```js
import CustomModeler from './customModeler'
// 原本是用BpmnModeler
this.bpmnModeler = new CustomModeler({ 
    additionalModules: [] // 可以不用引用任何东西
})
```



# 汉化

`目录结构`

- `zh`
  - `zh.js`
  - `index.js`



`zh.js`

```js
// 该文件定义了一个中英文对应的对象
export default {
  'Activate the global connect tool': '激活全局连接工具',
  'Append {type}': '添加 {type}',
  'Add Lane above': '在上面添加道',
  'Divide into two Lanes': '分割成两个道',
  'Divide into three Lanes': '分割成三个道'
  ...
  // 翻译文件可以到github或码云直接粘贴大佬翻译好的
}
```

`index.js`

```js
// 直接使用 cv 大法
import translations from "./zh";

export default function customTranslate (template, replacements) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    let str = replacements[key];
    if (
      translations[replacements[key]] !== null &&
      translations[replacements[key]] !== "undefined"
    ) {
      // eslint-disable-next-line no-mixed-spaces-and-tabs
      str = translations[replacements[key]];
      // eslint-disable-next-line no-mixed-spaces-and-tabs
    }
    return str || "{" + key + "}";
  });
}
```

`使用`

```js
// 导入汉化模块
import zh from "@/resource/zh";

this.bpmnModeler = new BpmnModeler({
  container: canvas,
  additionalModules: [
    // 汉化
    { translate: ["value", zh] }
  ]
})
```









