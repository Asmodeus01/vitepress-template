# 使用Vite创建vue3

#### 安装

```shell
npm install -g create-vite-app
```

#### 创建vue3

```shell
create-vite-app projectName
```

#### 安装依赖运行项目

```shell
npm install

npm run dev
```

# 组合Api基础

```html
<template>
    <button @click="myFn">count is: {{ count }}</button>
</template>
```

```typescript
<script>
import { ref } from "vue";
export default {
  name: 'HelloWorld',
  // 第二个参数提供了一个上下文对象，该对象暴露了以前在 this 上暴露的 property 的选择列表：
  setup (props, context) {
   const {myFn1, myFn2} = fnfn()
  // 组合API中定义的变量/方法，必须return {xxx,xxx}暴露出去
   return { myFn1, myFn2n }
 },
}
// 将相同的业务逻辑放在一起
// 也可以将代码单独抽出放在一个文件里
function fnfn () {
 // 定义 count 默认值 0
 let count = ref(0)
 // 定义函数
  function myFn1 () {
    count.value += 1;
  }
  function myFn2 () {
    count.value -= 1;
  }
  return { myFn1, myFn2 }
}
</script>
```

#### setup 执行时机

beforeCreate

setup

create

在执行setup时还没有执行create，所有setup无法使用this

vue为了避免错误使用，直接将setup的this改成了undefined

#### setup 的中的生命周期

直接导入 onXXX 一族的函数来注册生命周期钩子：与 2.x 版本生命周期相对应

1、beforeCreate -> 使用 setup()

2、created -> 使用 setup()

3、beforeMount -> onBeforeMount

4、mounted -> onMounted

5、beforeUpdate -> onBeforeUpdate

6、updated -> onUpdated

7、beforeDestroy -> onBeforeUnmount

8、destroyed -> onUnmounted

9、errorCaptured -> onErrorCaptured

```typescript
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

setup () {
    console.log('setup!')
    onBeforeMount(() => {
      console.log('onBeforeMount!')
    })
    onMounted(() => {
      console.log('mounted!')
    })
    onBeforeUnmount(() => {
      console.log('onBeforeUnmount!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  },
```



## router的使用

#### 下载

```shell
npm install vue-router -s
```

`router.ts`

```typescript
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '@/views/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/homeIndex',
    children: [
      {
        path: '/homeIndex',
        name: 'HomeIndex',
        component: () => import('@/views/homeIndex/index.vue')
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/index.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
```

`main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from "./plugins/router";

let app = createApp(App)

app.use(router)

app.mount('#app')
```

#### router 和 route 的使用

```typescript
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log('监听route'+route.query);
router.push({path: '/test'， query:{id:"dsd"}}});
```



## props和emit的使用

setup第一个参数就是props，不要尝试去解构它，否则会失去响应式

第二个参数context是上下文对象

```typescript
export default defineComponent({
  props: {
    name: String,
    age: String
  },
  setup(props, context) {
    console.log('子组件', props, context)
    console.log(`props` + props.name, props.age)
    function aaa(): void {
      context.emit('add')
    }
    return {
      props,
      aaa
    }
  }
})
```

script-setup 语法糖中的使用

```html
<template>
  <div class='about-test'>about test
    <div>name: {{name}}</div>
    <div>props.sex: {{props.sex}}</div>
    <div>age: {{age}}</div>
    <el-button @click="emitEV">emit</el-button>
  </div>
</template>
```

```typescript
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    default: 'yxx'
  },
  sex: {
    type: String,
    default: '男'
  },
  age: {
    type: Number,
    default: 0
  }
})
const age = computed(() => props.age + '岁')
// defineEmits参数时事件名列表
const emit = defineEmits(['emitEV'])
function emitEV() {
  emit('emitEV', 'emitEV 参数')  })
}
</script>
```

#### vue3组件的props和event批量传递

**v-bind="$props"**: 可以将父组件的所有props下发给它的子组件,子组件需要在其props:{} 中定义要接受的props。

**v-bind="$attrs"**: 将调用组件时的组件标签上绑定的**非props的特性**(class和style除外)向下传递。  

**v-on="$listeners"**: 已被vue3弃用，使用**v-bind="$attrs"代替**

```html
<template>
  <el-input v-model="myVal"
            v-bind="$props"
            // v-on="$listeners"
            v-bind="$attrs"></el-input>
</template>
```



## v-model的使用

vue3中v-model绑定的不再是value，而是modelValue，接收的方法也不再是input，而是update:modelValue。使用方法如下：

```typescript
export default defineComponent({
    name:"ValidateInput",
    props:{
        modelValue:String,   // v-model绑定的属性值
    },
    setup(){
        const updateValue = (e: KeyboardEvent) => {
          context.emit("update:modelValue",targetValue);   // 传递的方法
        }
    }
}
```

#### 更换v-model的参数

vue3中使用了modelValue来替代value，我们可以通过 v-model:xxx传递参数xxx，更改名称，而不是像vue2中使用model选项。使用方式如下：

```html
<ChildComponent v-model:title="title" />
```

那么在子组件中，就可以使用title代替modelValue。

```typescript
export default defineComponent({
    name:"ValidateInput",
    props:{
        // modelValue:String,
        title:String,   // title替代了modelValue
    },
    setup(){
        const updateValue = (e: KeyboardEvent) => {
        //   context.emit("update:modelValue",targetValue);   // 传递的方法
          context.emit("update:title",targetValue);   // 传递的方法
        }
    }
}
```



## refs的使用

`父组件`

```html
<template>
    <son ref="valueRef"></son>
</template>
```

```typescript
setup() {
    // 变量名必须和模板中ref的值一样
    const valueRef = ref('') 
    onMounted(()=>{
        // 调用子组件方法,必须挂在完成后
        valueRef.xxxFun()
    })
    return {
      // 必须return出去  
      valueRef
    }
}
```

#### script-setup 语法糖中的使用

`父组件`

```vue
<template>
    <son ref="valueRef"></son>
</template>
<script setup lang="ts">
// 变量名必须和模板中ref的值一样
const valueRef = ref('') 
onMounted(()=>{
    // 调用子组件方法,必须挂载完成后
    valueRef.xxxFun()
})
</script>
```

`子组件`

```vue
<script setup lang="ts">
// script-setup组件默认不会向外暴露属性，需要定义defineExpose
defineExpose({
  xxxFun
})
function xxxFun(){}
</script>
```



## computed的使用

```typescript
let count = ref(0)
// 仅 get
const counts = computed(() => {
    return count + '个'
})

// get set
const counts = computed({
    get() {
        return count.value + '个'
    },
    set() {
        count.value--
    }
})
return { hello, counts, countPlus }
```



## watch的使用

```typescript
import { watch } from 'vue'
export default defineComponent({
  components: {
    helloWorld
  },
  setup() {
    let count = ref(0)
    const userInfo = ref({
      name: 'yxx',
      age: 22
    })
    watch(count, (oldVlaue, newValue) => {
      console.log(oldVlaue, newValue, 'count 改变')
    })
    watch(userInfo, (oldVlaue, newValue) => {
      console.log(oldVlaue, newValue, 'userInfo 改变')
    },{
      deep: true // deep进行深度监听
    })
    // 结合computed对对象中的某个值监听
    watch(computed(()=>userInfo.name),(oldVlaue, newValue)=>{
      console.log(oldVlaue, newValue, 'name 改变')
    })

    return { count, name, myFn1, countPlus }
  }
})
```



## nextTick的使用

```typescript
import { nextTick } from 'vue'

nextTick(() => {
})
```



## 开发插件

而在Vue3.X中，组合式API没有this，不过新增了globalProperties属性，代替了Vue.prototype

`utils/index.js`

```typescript
import deepClone from "./deepClone.js"
import publicVar from "./publicVar.js"

const utils = {
  install: app => {
    app.config.globalProperties.$deepClone = deepClone
    app.config.globalProperties.$publicVar = publicVar
  }
}

export default utils
```

`main.js`

```typescript
import { createApp } from "vue";
import App from "./App.vue";

import utils from "./utils/index";

let app = createApp(App)
app.use(utils)
app.mount("#app");
```

也可以使用provide/inject来开发插件



## provide与inject 状态管理

provide状态只能向子孙组件传递，父辈和自己都不能使用inject获取该值

`store.js`

```typescript
import { inject, reactive, readonly } from "vue"
import type {App, InjectionKey} from "vue"

export type State = Record<string, string|number>

// 为了防止上下文类型丢失，使用InjectionKey来定义类型
const stateKey: InjectionKey<State> = Symbol()

// 创建全局状态
export function createState() {
  const _state: State = reactive({
      name: 'yxx',
      age: 18  
  })

  return {
    install(app: App) {
      app.provide(stateKey, _state)
    }
  }
}

// 使用全局状态
export function useState() {
  let state: State = inject(stateKey)!
  // 提供set方法来修改状态
  function setState(key: string, val: string|number): void {
    state[key] = val
  }

  return {
    state: readonly(state),
    setState
  }
}
```

`在main.ts注册`

```typescript
import { createApp, reactive } from 'vue'; 
import App from './App.vue'; 
import {createState } from './store'; 
const app = createApp(App); 
app.use(createState()); 
app.mount('#app');
```

使用

```typescript
<script setup> 
import { useState } from './state'; 
const {state,setState} = useState()
function ageAdd(){
    setState('age',state.age+1)
}
</script>
```



## script-setup语法糖

### 如何定义组件名 => name

script-setup 无法指定当前组件的名字，所以使用的时候以文件名为主

```vue
<script setup>
  // imported components are also directly usable in template
  import Foo from './Foo.vue'
</script>

<template>
  <Foo />
</template>
```

### 如何导入指令 => directive

导入指令的用法同 导入组件

```vue
<script setup>
  import { directive as clickOutside } from 'v-click-outside'
</script>

<template>
  <div v-click-outside />
</template>
```

### 如何获取 slots 和 attrs

```vue
<script setup>
    import { useSlots, useAttrs } from 'vue'
    
    const slots = useSlots()
    const attrs = useAttrs()
</script>
```

# 使用scss

```shell
npm i sass --save-dev
npm i sass-loader --save-dev
npm i node-sass --save-dev
```

# style 特性

## 深度选择器

处于 scoped 样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用 :deep() 这个伪类：

通过 v-html 创建的 DOM 内容不会被作用域样式影响，但仍然可以使用深度选择器来设置其样式。

```scss
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

## 插槽选择器

默认情况下，作用域样式不会影响到 渲染出来的内容，因为它们被认为是父组件所持有并传递进来的。使用 :slotted 伪类以确切地将插槽内容作为选择器的目标：

```scss
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

## 全局选择器

如果想让其中一个样式规则应用到全局，比起另外创建一个 

```scss
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

## style module

`<style module>` 标签会被编译为 CSS Modules 并且将生成的 CSS 类作为 $style 对象的键暴露给组件：

```scss
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

对生成的类做 hash 计算以避免冲突，实现了和 scope CSS 一样将 CSS 仅作用于当前组件的效果。

## 自定义注入名称

你可以通过给 module attribute 一个值来自定义注入的类对象的 property 键：

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

## 与组合式 API 一同使用

注入的类可以通过 [useCssModule](https://v3.cn.vuejs.org/api/global-api.html#usecssmodule) API 在 setup() 和 

```typescript
// 默认, 返回 <style module> 中的类
useCssModule()

// 命名, 返回 <style module="classes"> 中的类
useCssModule('classes')
```

## css v-bind

单文件组件的`<style>` 标签可以通过 v-bind 这一 CSS 函数将 CSS 的值关联到动态的组件状态上：

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```
