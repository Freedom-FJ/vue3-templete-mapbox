<!--
 * @Author: Tian
 * @Date: 2022-09-13 13:48:56
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-12 18:07:16
 * @Description:
-->
<template lang="pug">
.inspect-content
    .title-box
        .name 排口
        img.close(src='@/assets/images/map/close.png' @click='closePop')
    .main
        el-carousel(height="128px" indicator-position="outside")
            el-carousel-item
                el-image(:src='getAssetsFile("map/boat/pic.png")' style="width: 100%; height: 128px" :preview-teleported='true' :initial-index="0" :preview-src-list="srcList")
            el-carousel-item
                el-image(:src='getAssetsFile("map/boat/sn.png")' :preview-teleported='true' :initial-index="1" :preview-src-list="srcList")
    div.flex-c-c
        .btn.mgr4 派发任务
        .btn(@click="goToAnalysis") 分析溯源
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getAssetsFile } from '@/utils/tools'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const closePop = () => {
    window.inspectPopup.remove()
}
const srcList = [getAssetsFile('map/boat/pic.png'), getAssetsFile('map/boat/sn.png')]
const goToAnalysis = () => {
    analysisStore.startTraceability({
        type: 'OutletAnalysis',
        distance: 10000,
        dateTime: [dayjs().add(-6, 'days').valueOf(), dayjs().valueOf()],
        data: {
            analysisType: 1,
            siteName: '污染源测试排口'
        }
    })
}
</script>

<style lang="scss" scoped>
:deep(.el-carousel__button) {
    width: 6px;
    height: 6px;
    background: #f5f7f9;
    border-radius: 50%;
}

:deep(.el-carousel__indicator.is-active button) {
    background: #0df;
}

.inspect-content {
    width: 280px;
    padding-bottom: 8px;
    background: #0a1824;
    border: 1px solid #286c9d;

    .title-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 24px;
        padding-left: 12px;

        .name {
            font-family: TRENDS;
            font-size: 14px;
        }

        .close {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
    }

    .main {
        padding: 0 4px;

        // img {
        //     width: 100%;
        //     height: 128px;
        // }
    }

    .btn {
        width: 76px;
        height: 24px;
        font-family: TRENDS;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        background: #008dce;
        border: 1px solid #00e5ff;
        border-radius: 4px;
    }
}
</style>
