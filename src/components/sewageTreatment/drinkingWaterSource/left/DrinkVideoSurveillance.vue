<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:24:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 14:18:47
 * @Description:
-->
<template lang="pug">
commonPanel(title="视频监控" panelBg='panel-big' :height='272' :bigBgTop="14" :style="{marginBottom: pxToRem(16)}")
    template(#mainContent)
        img(src='@/assets/images/sewageTreatment/video.png' @click="checkVedio()")
</template>

<script setup lang="ts">
import { pxToRem } from '@/utils/tools'
import { useMapStore } from '@/store/map'
const checkVedio = () => {
    useMapStore().setMapVideoParams({
        deviceId: '33010000002006000005',
        channelId: '33011068001321121456',
        skip: 'skip116',
        url: null,
        cameraCode: ''
    })
}
</script>

<style scoped lang="scss">
    img {
        width: 100%;
        padding: 16px 4px;
    }
</style>
