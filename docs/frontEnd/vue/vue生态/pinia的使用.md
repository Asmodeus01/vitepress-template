# Pinia使用笔记

Pinia是一个全新的Vue状态管理库，由 Vue.js团队成员开发。

对比vuex

1. pinia的模块更像一个hooks，不需要嵌套，模块之间可以互相引用，让代码组织更灵活
2. 符合Vue3 的 Composition api的风格，可以直接结合vue3的API定义状态
3. 没有mutations，只有 state、getters、actions，devtools同样可以追踪到状态的修改
4. vue2和vue3都可以支持
5. TypeScript类型推断

# 安装

```shell
yarn add pinia
# 或者使用 npm
npm install pinia
```

# 完整示例

首先需要在main.ts引入

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

## 定义状态

defineStore函数用来定义一个状态，返回一个使用状态的函数。

我们把状态定义在在/src/store/index.ts文件内，当然也可以定义在其他文件内，并且defineStore可以定义多个状态集合

```ts
import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
export const useCountStore = defineStore('count', {
  	// state：定义状态
    state: ()=>({
        count: 0
    }),
  	// getters：与vuex一致，类似于computer
    getters: {
        dbCount:(state)=>state.count*2
    },
  	// actions：与vuex一致，用于修改状态
    actions: {
        countPlus() {
            this.count++
        }
        
    }
})
```

defineStore第一个参数是应用程序中 store 的唯一 id，第二个参数是一个选项的对象，与Vuex类似不过没有Mutation字段

## 使用状态

调用useStore方法，返回store实例

```vue
<template>
  <div class='home'>
    <div>{{countStore.count}}</div>
    <button @click="countPlus">count++</button>
  </div>
</template>

<script setup lang="ts">
import {useCountStore} from "./useStore";

const countStore = useCountStore()
// 通过countStore可以直接访问到state、getters、actions中定义的状态和方法
countStore.count
countStore.dbCount
countStore.countPlus()


function countPlus(){
  // 可以直接修改 count
  countStore.count++
  // 也可以通过$state替换整个状态
  countStore.$state = {count: countStore.count+1}
  // 使用$patch修改状态
  countStore.$patch({
    count: countStore.count+1
  })
  // 调用actions中的方法
  countStore.countPlus()
}

</script>
```

# defineStore

## 使用配置定义状态

### State

定义状态

```ts
export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    })
})
```

访问/修改state

```ts
const countStore = useCountStore()
// 访问
countStore.count
countStore.$state.count

// 可以直接修改 count
countStore.count++
// 也可以通过$state替换整个状态
countStore.$state = {count: countStore.count+1}
// 使用$patch修改状态
countStore.$patch({
  count: countStore.count+1
})
```



### Getters

与计算属性一样，您可以组合多个 getter。 通过 `this` 访问任何其他 getter。

```ts
export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    }),
    getters: {
        // 回调函数的参数为state
        dbCount:(state)=>state.count*2,
        // this为该store实例，可以访问到其他的getters
        doubleCountPlusOne() {
          return this.doubleCount + 1
        }
    }
})
```

getter传递参数

```ts
export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    }),
    getters: {
      	// getters返回一个函数，并接受一个参数
        countFormat: (state) => {
          return (fmt) => state.count+fmt
        },
    }
})
```

访问其他 Store 的 getter

```ts
export const useUserStore = defineStore('user', {
    state: ()=>({
        name: 'yxx'
    }),
    getters: {
        countFormat: (state) => {
          return (fmt) => state.count+fmt
        },
    }
})

export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    }),
    getters: {
      	// getters返回一个函数，并接受一个参数
        userCount: (state) => {
          const userStore = useUserStore()
          return `${userStore.name}写了${state.count}个bug`
        },
    }
})
```

访问getters

```ts
const countStore = useCountStore()

countStore.dbCount
countStore.doubleCountPlusOne
countStore.countFormat('个')
countStore.userCount

```

### Actions

Actions 相当于组件中的 methods。 可以使用 `defineStore()` 中的 `actions` 属性定义

```ts
export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    }),
    actions: {
      // 与getters一样，可以通过this访问该store实例
      countPlus() {
        this.count++
      },
      // actions 可以是异步的
      async asyncCountPlus(){
        const res = await axios.get('xxxx')
        this.count = res.data
      }
        
    }
})
```

访问其他 Store 的 actions

```ts
export const useUserStore = defineStore('user', {
    state: ()=>({
        name: 'yxx'
    }),
    actions: {
        setName: () => {
          this.name = 'yxx'
        },
    }
})

export const useCountStore = defineStore('count', {
    state: ()=>({
        count: 0
    }),
    actions: {
        setUserName: (state) => {
          const userStore = useUserStore()
          userStore.setName()
        },
    }
})
```

 访问actions

```ts
const countStore = useCountStore()

countStore.countPlus()
countStore.asyncCountPlus()
countStore.setUserName()
```

## 使用组合式API语法定义状态

defineStore第二个参数也可以接收一个函数，函数可以返回一个响应式的变量和它的计算属性、修改方法等

```ts
import {defineStore} from "pinia";
import {ref, computed} from "vue";

export const useCountStore = defineStore('count', ()=>{
    const count = ref(0)
    const dbCount = computed(()=>count.value*2)
    const userInfo = reactive({
        name: 'yxx',
        age: 12
    })
    function countPlus(){
        count.value++
    }

    return {count, dbCount, userInfo, countPlus}
})
```

这种方法与第一种方法定义状态所返回的实例没有区别，访问属性和方法的方式也没有变化

使用ref或reactive定义的响应式变量等同于state中的状态

使用computed定义的计算属性等同于getters中的内容

return出来的其他方法等同于actions中的方法

```vue
<template>
  <div class="">
    <div>count: {{countStore.count}}</div>
    <div>dbCount: {{countStore.dbCount}}</div>
    <button @click="butClick">count++</button>
  </div>
</template>

<script setup lang="ts">
import {useCountStore} from "./useStore";

const countStore = useCountStore()
// 访问状态
countStore.count
// 或者
countStore.$state.count
// 访问计算属性  
countStore.dbCount

function butClick(){
  // 访问方法
  countStore.countPlus()
}
</script>
```

# store实例属性/方法

state、getters、actions中定义的状态和方法可以直接被store实例访问，除了这些还有以下属性/方法

- **$id** 定义状态时的id
- **$state** 全部状态
- **$patch** 修改状态
- **$reset** 重置状态
- **$subscribe** 订阅状态
- **$onAction** 订阅Action

### $id

$id为该store实例的ID，也就是defineStore的第一个参数

```ts
const countStore = useCountStore()
countStore.id // => 'count'
```

### $state

使用$state可以访问到全部状态，并且可以直接整个替换整个状态

```ts
const countStore = useCountStore()
countStore.$state = {count: countStore.count+1}
```

### $patch

$patch用来修改状态，可以直接传递个对象，也可以传递一个回调函数

```ts
const countStore = useCountStore()

// 传递对象
countStore.$patch({
  count: countStore.count+1
})
// 传递函数，函数第一个参数为state
countStore.$patch(state=>{
  state.count++
})
```

### $reset

$reset用来重置状态，调用它所有的状态都会重置为初始值 

```ts
const countStore = useCountStore()

countStore.$reset()
```

### $subscribe

$subscribe订阅状态

第一个参数接受一个回调函数，当状态被修改时会调用回调函数

第二个参数接受一个对象{ detached: true }，detached默认false，设为true时当组件销毁时订阅不会取消

```ts
const countStore = useCountStore()

countStore.$subscribe((mutation, state) => {
  console.log('mutation',mutation)
  // 修改数据的方式
  // 'direct': 通过countStore.count直接修改
  // 'patch object' 使用countStore.$patch({})修改的数据
  // 'patch function' 使用countStore.$patch((state)=>void)修改的数据
  mutation.type
  // 与 cartStore.$id 相同
  mutation.storeId // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload // 传递给$patch的对象
},{ detached: true })
```

### $onAction

$onAction订阅Action，接受一个回调函数，当Action被调用时会调用回调函数

```ts
const countStore = useCountStore()

countStore.$onAction(
    ({
      name, // action 的名字
      store, // store 实例
      args, // 调用这个 action 的参数
      after, // 在这个 action 执行完毕之后，执行这个函数
      onError, // 在这个 action 抛出异常的时候，执行这个函数
    })=>{
      console.log(name,store,args,after,onError)
      onError(()=>{
        console.log('action 抛出异常')
      })
})
```

## 工具方法

### storeToRefs

类似于toRefs，用于结构一个响应式对象，

`store` 是一个用`reactive` 包裹的对象，这意味着不需要在getter 之后写`.value`，但是，就像`setup` 中的`props` 一样，**我们不能对其进行解构**：

```ts
const countStore = useCountStore()
// 这不起作用，因为它会破坏响应式
// 这和从 props 解构是一样的
const { count, dbCount } = countStore
```

为了从 Store 中提取属性同时保持其响应式，您需要使用`storeToRefs()`。 它将为任何响应式属性创建 refs。 当您仅使用 store 中的状态但不调用任何操作时，这很有用：

```ts
const countStore = useCountStore()

const { count, dbCount } = storeToRefs(countStore)
// （试了一下，用toRefs也能实现同样的效果）
const { count, dbCount } = toRefs(countStore)
```
