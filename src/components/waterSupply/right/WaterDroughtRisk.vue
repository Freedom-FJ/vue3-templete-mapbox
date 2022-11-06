<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-10 16:13:08
 * @Description:
-->
<template lang="pug">
commonPanel(title="旱情风险" panelBg='panel-big' :height='160' :bigBgTop="14")
    template(#mainContent)
        .supply-content
            .supply-one
                .text 影响村数/人口
                .progress
                    grid-progress-bar(:value='50' checkColor='#06F7A1' defaultColor='#555555' :gridWidth='1' :gridMid='3' baseLine='width' :gridRotate='30')
                .rate
                    span.value 0
                    span.unit 个
                    span.split /
                    span.value 0.0
                    span.unit 万人
            .supply-one
                .text 饮水困难发生率
                .progress
                    grid-progress-bar(:value='50' checkColor='#00DDFF' defaultColor='#555555' :gridWidth='1' :gridMid='3' baseLine='width' :gridRotate='30')
                .rate(style='height: 20px;')
                    .value(style='color: #00DDFF') 0%
                    .circle
                        el-progress(type="circle" :percentage="80" :show-text='false' :width='16' :stroke-width='3' color='#00DDFF')
            .supply-one
                .text 旱情预警
                .progress
                    grid-progress-bar(:value='50' checkColor='#F7C706' defaultColor='#555555' :gridWidth='1' :gridMid='3' baseLine='width' :gridRotate='30')
                .rate
                    .value(style='color: #F7C706') 120
                    img(src='@/assets/images/waterControlCab/hq.svg')
</template>

<script lang="ts" setup>
const chartDom = ref()
const data = reactive({
    subTitle: '（最新）'
})
const { subTitle } = toRefs(data)
</script>

<style lang="scss" scoped>
:deep(.el-progress) {
    width: 16px;
    height: 16px;
    margin-top: -10px;
}
.supply-content {
    display: flex;
    justify-content: space-between;
    padding: 6px 16px 0 16px;
    .supply-one {
        // flex: 1;
        padding: 10px 0px;
        .text {
            font-family: TRENDS;
            font-size: 12px;
            margin-bottom: 8px;
        }
        .progress {
            width: 84px;
            height: 7px;
            margin-top: 8px;
            margin-bottom: 10px;
        }
        .rate {
            display: flex;
            align-items: center;
            .value {
                font-family: Furore;
                font-size: 20px;
                color: #06F7A1;
            }
            .unit {
                font-family: TRENDS;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
            }
            .split {
                font-family: Furore;
                font-size: 20px;
                color: rgba(255, 255, 255, 0.5);
            }
            .circle {
                margin-left: 8px;

            }
            img {
                margin-left: 8px;
                width: 16px;
            }
        }
    }
}
</style>

