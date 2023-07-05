function getChildren(root,path) {
    const fs = require('fs') // 1. 引入 fs 模块
    const join = require('path').join // 2. 引入 path 模块
    let files = fs.readdirSync(join(__dirname, root, path)) // 3. 读取../node-study目录下的文件
    const children = files.filter(item => !item.startsWith('.')).map(item =>`${path}/${item}`)
    return children
}

function getSidebar(root,path){
    const files= getChildren(root,path)
    const sidebar = {}
    files.forEach(item => {
        const group=getChildren(root,item)
        sidebar[`/${item}/`]=group.filter(r => !r.endsWith('.md')).map(item => {
            const title = item.split('/')[2]
            return {
                title: title,
                collapsable: false,
                sidebarDepth: 1,
                children: getChildren(`${root}/${item}`, '').map(r => `${title}${r}`)
            }
        })
    })
    return sidebar
}

module.exports = {
    title: '得塔知识库',
    description: '施工中',
    themeConfig: {
        logo: '/logo.png',
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

        //侧边栏配置
        sidebar: {...getSidebar('../../docs', 'frontEnd')}
    }


}
