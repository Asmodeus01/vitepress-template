# 使用echarts+amap在vue里实现迁移图



###### 下载依赖

`npm install --s echarts  `

`npm install -s echarts-amap`

###### main.js 引入echarts

```js
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts;
```

###### index.html 引入高德地图

```html
<script src="https://webapi.amap.com/maps?v=1.4.15&key=...&plugin=AMap.ControlBar,AMap.CustomLayer,AMap.MarkerClusterer"></script>
```

###### 组件内容

最重要的是引入echarts-amap

`require('echarts-amap')`

```vue
<template>
  <div style="width:100%;height:100%"
       id="map"></div>
</template>

<script>
require('echarts-amap')
export default {
  //父往子传值
  props: {
    echartsData: {
      type: Object,
      required: true
    }
      // echartsData内容
      // echartsData: {
      //   //流线数组
      //   flyLine: [
      //     { coords: [[118.797137, 32.087181], [118.70837, 31.739363]] },
      //     { coords: [[118.797137, 32.087181], [118.82837, 32.059363]] },
      //     { coords: [[118.797137, 32.087181], [118.72837, 32.089363]] },
      //     { coords: [[118.797137, 32.087181], [118.76837, 31.329363]] },
      //     { coords: [[118.797137, 32.087181], [118.70837, 31.739363]] },

      //     { coords: [[118.797137, 32.087181], [118.78837, 32.319363]] },
      //     { coords: [[118.797137, 32.087181], [118.71837, 31.909363]] },
      //     { coords: [[118.797137, 32.087181], [118.74837, 31.719363]] },
      //     { coords: [[118.797137, 32.087181], [118.72837, 32.089363]] },
      //     { coords: [[118.797137, 32.087181], [118.78837, 32.329363]] },
      //   ],
      //   goals: [
      //     [118.70837, 31.739363],
      //     [118.82837, 32.059363],
      //     [118.72837, 32.089363],
      //     [118.76837, 31.329363],
      //     [118.78837, 32.319363],

      //     [118.78837, 32.319363],
      //     [118.71837, 31.909363],
      //     [118.74837, 31.719363],
      //     [118.72837, 32.089363],
      //     [118.78837, 32.329363],
      //   ]
      // }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.init()
  },
  //方法集合
  methods: {
    init () {
      var myChart = echarts.init(document.getElementById('map'));
      myChart.setOption({
        // 使用高德地图作为地图
        amap: {
          center: [118.802422, 32.064653], //中心点
          zoom: 12,
          resizeEnable: true,
          mapStyle: "amap://styles/bfb1bb3feb0db7082367abca96b8d214", //地图主题
        },
        tooltip: {
          trigger: 'item',
          show: false
        },
        animation: false,
        series: [
          // 流线
          {
            coordinateSystem: "amap", // 该系列使用的坐标系是高德地图的坐标系
            type: "lines", // 该类型用于地图上路线的绘制
            zlevel: 1, // 相当于z-index
            effect: { // 线特效的配置
              show: true,  // 是否显示特效
              period: 5, // 特效动画的时间
              trailLength: 0.05, // 特效尾迹的长度 0-1
              color: "#3437ff", // 特效的颜色
              symbolSize: 10 // 特效的大小
            },
            lineStyle: { // 线的颜色
              normal: {
                // color: "rgba(47,68,200,0.5)",
                color: "rgba(5,39,175,0.5)",
                // color: "#fc00ff",
                width: 5,
                curveness: 0.2
              }
            },
            data: this.echartsData.flyLine,
          },
          // 目标点
          {
            name: '目标点',
            zlevel: 2,//第二图层，位于第一层之上
            type: "effectScatter",
            rippleEffect: {//涟漪特效相关配置
              brushType: 'stroke'//波纹的绘制方式，可选 'stroke' 和 'fill'。
            },
            show: true,
            // 使用高德地图坐标系
            coordinateSystem: "amap",
            // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
            data: this.echartsData.goals,
            symbolSize: 20,
            encode: {
              value: 2
            },
            label: {
              normal: {
                formatter: '{a}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                // color: 'rgba(98,122,200,0.78)'
                color: '#cc3366'
              }
            }
          }
        ]
      });
    }
  }
}
</script>
<style scoped>
</style>
```

