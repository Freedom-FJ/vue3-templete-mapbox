import type { RouteRecordRaw } from 'vue-router'
function getModules() {
    const components = import.meta.glob('../views/**/*.vue')
    return components
}
// 自动注册路由
export const vueRouters = function (): Array<RouteRecordRaw> {
    const routerList: Array<RouteRecordRaw> = []
    const modules = getModules()
    Object.keys(modules).forEach((key) => {
        const name = key.replace(/(\...views\/|\.vue)/g, '')
        const pathName = name.slice(0, 1).toLowerCase() + name.slice(1)
        routerList.push({
            path: `/${pathName}`,
            name,
            component: modules[key]
        })
    })
    return routerList
}
