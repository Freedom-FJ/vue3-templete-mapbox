<!--
 * @Author: mjh
 * @Date: 2022-08-29 14:07:55
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-25 17:42:30
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs(ref="letDom")
    commonPanel(title="环境现状" :subTitle='subTitle' panelBg='panel-big' :height='456' :bigBgTop="14" :style="{marginBottom: pxToRem(16)}")
        template(#mainContent)
            environmental-status
    commonPanel(title="重点关注"  panelBg='panel-big' :height='460' :bigBgTop="14")
        template(#mainContent)
            key-focus
        //- template(#rightTitle)
        //-     .btn-box
        //-         .item-btn(:class="[isToday ? 'item-btn-check' : '' ]" @click="isToday=true") 今日
        //-         .item-btn(:class="[!isToday ? 'item-btn-check' : '' ]" @click="isToday=false") 最近七天
</template>

<script lang="ts" setup name="water-quality-left-panel">
import { pxToRem } from '@/utils/tools'
const data = reactive({
    subTitle: '（2022）',
    letDom: ref(),
    isToday: true
})

onMounted(() => {
    //
})

const { subTitle, letDom, isToday } = toRefs(data)
</script>

<style lang="scss" scoped>
.left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .btn-box {
        display: flex;

        .item-btn {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            height: 22px;
            padding: 5px 10px;
            margin-left: 4px;
            font-family: TRENDS;
            font-size: 12px;
            font-weight: normal;
            line-height: 12px;
            color: #fff;
            letter-spacing: 0;
            cursor: pointer;
            background: #023057;
            border: 1px solid #286c9d;
            border-radius: 4px;
        }

        .item-btn-check {
            background: #008dce;
            border: 1px solid #00e5ff;
        }
    }
}
</style>
