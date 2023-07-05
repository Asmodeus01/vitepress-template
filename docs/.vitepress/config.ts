import {defineConfig, DefaultTheme} from 'vitepress'
import fs from 'fs'
import path from 'path'

function getChildren(root, url) {
    // const fs = require('fs') // 1. 引入 fs 模块
    const join = path.join // 2. 引入 path 模块
    // console.log(typeof  path,'join的类型')
    let files = fs.readdirSync(join(__dirname, root, url)) // 3. 读取../node-study目录下的文件

    const children = files.filter(item => (!item.startsWith('.')||item=='index.md')).map(item => `${url}/${item}`)
    // console.log(files,'获取子级',children)
    return children
}
// 获取侧边栏
function getSidebar(root, path) {
    const files = getChildren(root, path),
    sidebar = {}
    files.forEach(key => {
        const group = getChildren(root, key)
        // console.log(group,'获取到的group',group.filter(r => !r.endsWith('.md')))
        sidebar[`/${key}/`]=[]
        group.forEach((item, idx) => {
            const len=item.split('/').length
            // console.log(item,'循环的')
            if(!item.endsWith('index.md')){
                if(item.endsWith('.md')){
                    sidebar[`/${key}/`].push({
                        text:item.split('/')[len-1].replace('.md',''),
                        link:`/${item}`
                    })
                    // return {
                    //     text:item.split('/')[len-1].replace('.md',''),
                    //     link:`/${item}`
                    // }
                }else{
                    const title = item.split('/')[2],
                        items=[]
                    // console.log(getChildren(`${root}/${item}`, '').map(r => `${title}${r}`), '获取到的')
                    getChildren(`${root}/${item}`, '').map(r => `${title}${r}`).forEach((data, idx) => {
                        const len=data.split('/').length,
                            dataList=data.split('/')
                        items.push({
                            text:data.split('/')[len-1].replace('.md',''),
                            link:`/${item}/${data.replace(`${dataList[0]}/`,'')}`
                        })
                    })

                    sidebar[`/${key}/`].push({
                        text: title,
                        // collapsable: false,
                        // sidebarDepth: 1,
                        items
                    })

                }
            }
        })


    })
    return sidebar
}

const sidebar =  {...getSidebar('../../docs', 'frontEnd')}
fs.writeFile('./logs.json', JSON.stringify(sidebar),function(err) {
    if (!err) {
        console.log('文件写入完毕');
    }
})

export default defineConfig({
    title: '得塔知识库',
    description: '施工中',
    lang: 'cn-ZH',
    // base:'/',
    lastUpdated: true,
    themeConfig: {
        // nav,
        nav: [
            {
                text: '前端',
                items: [
                    {
                        text: '语言基础', items: [
                            {text: 'html', link: '/frontEnd/html/'},
                            {text: 'js', link: '/frontEnd/js/'},
                            {text: 'css', link: '/frontEnd/css/'},
                            {text: 'ts', link: '/frontEnd/ts/'},
                        ]
                    },
                    {
                        text: '框架', items: [
                            {text: 'vue', link: '/frontEnd/vue/'},
                            {text: 'react', link: '/frontEnd/react/'},
                        ]
                    },
                    {
                        text: '解决方案', items: [
                            {text: 'PC端', link: '/frontEnd/pc/'},
                            {text: '移动端', link: '/frontEnd/app/'},
                            {text: '小程序', link: '/frontEnd/小程序/'},

                        ]
                    },
                    {
                        text: '工具', items: [
                            {text: 'UI库', link: '/frontEnd/ui库/'},
                            {text: 'JS库', link: '/frontEnd/js库/'},
                            {text: '中间层', link: '/frontEnd/中间层/'},
                            {text: 'GIS', link: '/frontEnd/gis/'},
                            {text: 'WebGL', link: '/frontEnd/webgl/'},
                            {text: 'docker', link: '/frontEnd/docker/'},
                            {text: 'dcp-view-3d', link: '/frontEnd/dcp-view-3d/'},
                        ]
                    },

                ]
            }, {
                text: '后端',
                ariaLabel: '后端 Menu',
                items: [
                    {text: 'Java', link: '/backEnd/'},
                ]
            }, {
                text: '测试',
                ariaLabel: '测试 Menu',
                items: [
                    {text: '测试', link: '/test/'},
                ]
            },
            {text: '编写指南', link: '/guide/'},
        ],
        //

        // sidebar
        //侧边栏配置
        sidebar: {...getSidebar('../../docs', 'frontEnd')}
    }

})
