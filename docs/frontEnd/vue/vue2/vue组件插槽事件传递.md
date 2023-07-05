# vue组件插槽事件传递

我们在用element-ui组件时一定会用到form表单组件，基本的使用方法如下

```html
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
</el-form>
```

`el-form-item`组件是放到`el-form`组件的插槽中的，当`el-form-item`组件中的表单发生change事件就会把数据同步到`el-form`组件中

我们自己来实现下el-form组件

```html
<div class="el-form">
    <slot></slot>
</div>
```

然后发现slot插槽无法触发事件，找了很多方法也没有实现想要的效果，直到我翻了element的源码发现了`emitter.js`这个文件

```js
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```

dispatch方法是向上递归寻找组件名为 `componentName` 的父组件，并使改组件触发`eventName`事件，传递`params`参数

broadcast方法同样是使用递归的方法向下寻找子组件，并使该子组件触发一个事件

下面我们看看el-form-item组件中几个核心的方法

```js
import emitter from 'element-ui/src/mixins/emitter';

export default {
    name: 'ElFormItem',
	// 定义componentName对应上面方法的componentName
    componentName: 'ElFormItem',
    // 使用混入的方式将方法引入
    mixins: [emitter],
    
    beforeDestroy() {
      // 这里form-item组件销毁时向ElForm组件传递了一个el.form.removeField事件，告诉父组件我销毁了，看事件名应该是移出表单校验
      this.dispatch('ElForm', 'el.form.removeField', [this]);
    }
}
```

el-form组件怎么监听这个事件呢，观察emitter中的函数，是调用了组件的$emit方法，所以我们调用$on方法就可以监听到

```js

export default {
    name: 'ElForm',
	// 定义componentName对应上面方法的componentName
    componentName: 'ElForm',
    
    created() {
      // 使用$on监听事件
      this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
}
```

这样插槽中的子组件就可以向父组件触发事件传参了，父组件向子组件传参调用broadcast方法即可，要注意的是emitter中的方法是通过`componentName`寻找组件的，所以组件内别忘了定义`componentName`

我们写自己的组件时就可以直接把emitter文件拿来用了