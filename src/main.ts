/*
 * @Author: Tian
 * @Date: 2022-06-24 15:29:09
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 14:32:47
 * @Description:
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入sentry进行报错日志监控
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
const pinia = createPinia()
pinia.use(piniaPersist)

import App from '@/App.vue'
import router from '@/router'
import { verifyAuth } from '@/utils/auth/SystemAuth'
import 'amfe-flexible'
// 引入Elmessage的css样式文件  解决element按需引入bug
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-table.css'
import 'echarts-gl'


import 'dayjs/locale/zh-cn'; // 设置周的周一为一周的开始
import dayjs from 'dayjs';
dayjs.locale('zh-cn'); 

verifyAuth().then(() => {
    const app = createApp(App)
    // Sentry.init({
    //     app,
    //     dsn: "https://18d91880400f446b95c94f77ce1edf00@o1413686.ingest.sentry.io/6753509",
    //     integrations: [
    //       new BrowserTracing({
    //         routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    //         tracingOrigins: ["localhost", "my-site-url.com", /^\//],
    //       }),
    //     ],
    //     // Set tracesSampleRate to 1.0 to capture 100%
    //     // of transactions for performance monitoring.
    //     // We recommend adjusting this value in production
    //     tracesSampleRate: 1.0,
    // })
    app.config.errorHandler = (err, vm, info) => {
        console.log('[全局异常]：', err, vm, info)
    }
    for (const [key, component] of Object.entries(ElementPlusIconsVue))
        app.component(key, component as any)

    app.use(router).use(pinia)
    app.mount('#app')
})
