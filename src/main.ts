/*
 * @Author: Tian
 * @Date: 2022-06-24 15:29:09
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-13 22:16:33
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import dayjs from 'dayjs'
import App from '@/App.vue'
import router from '@/router'
import { verifyAuth } from '@/utils/auth/SystemAuth'
import 'amfe-flexible'
// 引入Elmessage的css样式文件  解决element按需引入bug
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-table.css'
import 'echarts-gl'

import 'dayjs/locale/zh-cn' // 设置周的周一为一周的开始
const pinia = createPinia()
pinia.use(piniaPersist)
dayjs.locale('zh-cn')

verifyAuth().then(() => {
    const app = createApp(App)
    app.config.errorHandler = (err, vm, info) => {
        console.log('[全局异常]：', err, vm, info)
    }
    for (const [key, component] of Object.entries(ElementPlusIconsVue))
        app.component(key, component as any)

    app.use(router).use(pinia)
    app.mount('#app')
})
