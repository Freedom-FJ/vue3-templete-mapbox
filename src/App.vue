<!--
 * @Author: Tian
 * @Date: 2022-05-08 18:13:26
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:33:10
 * @Description:
-->

<template lang="pug">
el-config-provider(:locale="locale")
    #mainApp
        .shadingBg
            component(v-for="layout in layouts" :key="layout.name" :is="layout")
            camera-dialog
            router-view(v-if="isRouterAlive")
</template>

<script setup lang="ts">
import mitt from 'mitt'
import dayjs from 'dayjs'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { ElConfigProvider } from 'element-plus'
import { useRouter } from 'vue-router'
import layouts from './layouts'
import { preloadImage } from './utils/map/mapPoint'
import echarts from '@/utils/echarts'
import service from '@/service/api'
import { changeHangZhouKey, globalKey, hangZhouKey, serviceKey } from '@/symbols'
import { useCommonStore, } from '@/store/common'
import { useRouterControlStore } from '@/store/routerControl'
const commonStore = useCommonStore()
const routerControlStore = useRouterControlStore()
const emitter = mitt()
const router = useRouter()
const locale = zhCn
provide(serviceKey, service)
provide(globalKey, {
    dayjs,
    echarts,
    emitter
})
const closeStore = reactive({
    token: '',
    authorization: ''
})
// 杭州用户信息存放位置
provide(hangZhouKey, closeStore)
provide(changeHangZhouKey, (val: { token: string; authorization: string }) => {
    Object.assign(closeStore, val)
})
const isRouterAlive = ref(true)
watch(() => routerControlStore.getRouter, (val) => {
    router.push({ path: val.path, query: val.data })
})

// 地图模式切换刷新router
watch(() => commonStore.getMapStyle, (val) => {
    if (router.currentRoute.value.path === '/sewageTreatment/ParkDetail') return
    isRouterAlive.value = false
    setTimeout(() => {
        isRouterAlive.value = true
    }, 100)
})
onMounted(() => {
    window.glMap.on('load', () => {
        preloadImage()
    })
    preloadImage()
})

window.addEventListener(
    'resize',
    (e: any) => {
        const commonStore = useCommonStore()
        commonStore.setWindowHeight(e?.target?.innerHeight ?? 0)
    },
    false
)
</script>

<style lang="scss">
@import url("./styles/base.scss");
@import url("./styles/map.scss");
@import url("./styles/common.scss");
@import url("./assets/font/font.css");

#mainApp {
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
    background: url("./assets/images/layouts/bg.png") no-repeat;
    background-position: center;
    background-size: 100% 100%;

    .shadingBg {
        position: absolute;
        z-index: 9;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: url("./assets/images/layouts/shading.svg") no-repeat;
        background-size: cover;
    }
}

.water-control {
    padding: 0 32px;
}
</style>
