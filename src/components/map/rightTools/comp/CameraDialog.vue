<!--
 * @Author: Tian
 * @Date: 2022-09-23 11:20:31
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 14:10:15
 * @Description:
-->
<template lang="pug">
.camara-content
    el-dialog(v-model='dialogVisible' width='800px', height='525px' @close="dialogClosed")
        el-icon(@click="dialogClosed" :size='20')
            Close
        .video-content(v-if='!isShowIframe' style='width: 800px;height: 500px;')
            live-player(:video-url='videoUrl', live='true', muted='true', stretch='false')
        .video-content(v-if='isShowIframe' style='width: 800px;height: 500px;padding-top: 30px;' )
            iframe(:src='videoIframeUrl' frameBorder="0" style="height:470px;")
</template>

<script setup lang="ts" name="camera-dislog">
import type { PlayVideoParams, VideoUrl } from './types'
import service from '@/service/api'
import { useMapStore } from '@/store/map'
const mapStore = useMapStore()
const camaraData = reactive({
    dialogVisible: false,
    isShowIframe: false,
    videoUrl: '',
    videoIframeUrl: '/bmp-video-control-web/#/videoPlayer?id=50f3f7323adb4834975bf9d331513d3d&hideMenus=true'
})
const getVideo = async (params: PlayVideoParams) => {
    // 获取视频流
    const { data } = await service<VideoUrl, true>('common/getVideoUrl', {
        serial: params.deviceId,
        code: params.channelId,
        videoAddress: params.skip
    })
    if (data.FLV)
        camaraData.videoUrl = data.FLV
}
/**
 * 关闭视频播放弹框
 */
const dialogClosed = () => {
    // 清空参数
    camaraData.videoUrl = ''
    mapStore.setMapVideoParams({
        deviceId: '',
        channelId: '',
        skip: '',
        url: '',
        cameraCode: ''
    })
    camaraData.dialogVisible = false
}

watch(() => mapStore.getVideoParams, (val: PlayVideoParams) => {
    // 添加判断，余杭塘河直接嵌入iframe
    if (val.deviceId || val.cameraCode) {
        camaraData.dialogVisible = true
        if (val.deviceId) {
            getVideo(val)
            camaraData.isShowIframe = false
        }
        else {
            camaraData.isShowIframe = true
            camaraData.videoIframeUrl = `/bmp-video-control-web/#/videoPlayer?id=${val.cameraCode}&hideMenus=true`
        }
    }
}, { deep: true })
const { dialogVisible, videoUrl, videoIframeUrl, isShowIframe } = toRefs(camaraData)
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
    display: none;
}

:deep(.el-dialog__body) {
    padding: 0 !important;
    background: #000;
}

.el-icon {
    position: absolute;
    top: 6px;
    right: 20px;
    z-index: 99;
    color: #fff;
    cursor: pointer;
}

.video-content {
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
