<!--
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 09:17:50
 * @Description:
-->
<template lang="pug">
commonPanel(title="节水智抓" :subTitle='subTitle' :height='284')
    template(#mainContent)
        .water-saving
            .saving-item
                .top
                    .text-item
                        .label 实际用水量
                        .value 2.9
                        .unit 亿m³
                .progress
                    grid-progress-bar(:value='55.7' checkColor='#F84439' defaultBoxBack="rgba(255, 255, 255, 0.1)"  baseLine='width' :gridWidth='2' :gridMid='1')
                    .target
                .control-item
                    .left
                        img(src='@/assets/images/waterControlCab/square.png')
                        .label 控制目标
                    .right
                        .value 5.2
                        .unit 亿m³
            .saving-item
                .top
                    .text-item
                        .label 万元GDP用水量
                        .value 13.6
                        .unit m³
                .progress
                    grid-progress-bar(:value='81' checkColor='#00DDFF' defaultBoxBack="rgba(255, 255, 255, 0.1)"  baseLine='width' :gridWidth='2' :gridMid='1')
                    .target
                .control-item
                    .left
                        img(src='@/assets/images/waterControlCab/square.png')
                        .label 控制目标
                    .right
                        .value 5.2
                        .unit m³
            .saving-item
                .top
                    .text-item
                        .label 万元工业增加值用水量
                        .value 10.1
                        .unit m³
                .progress
                    grid-progress-bar(:value='100' checkColor='#F84439' defaultBoxBack="rgba(255, 255, 255, 0.1)"  baseLine='width' :gridWidth='2' :gridMid='1')
                    .target(style='right: 24px;')
                .control-item
                    .left
                        img(src='@/assets/images/waterControlCab/square.png')
                        .label 控制目标
                    .right
                        .value 5.2
                        .unit m³
</template>

<script lang="ts" setup name="water-saving-wisdom">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const supplyData = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`
})
const { subTitle } = toRefs(supplyData)
</script>

<style lang="scss" scoped>
.right-title {
    font-family: TRENDS;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
}

.water-saving {
    padding: 12px 16px 0;

    .saving-item {
        width: 328px;
        margin-bottom: 12px;

        .top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .text-item {
                display: flex;

                .label {
                    margin-right: 8px;
                    font-family: TRENDS;
                    font-size: 14px;
                }

                .value {
                    font-family: Furore;
                    font-size: 16px;
                    color: #0df;
                }

                .unit {
                    margin-left: 8px;
                    font-family: TRENDS;
                    font-size: 14px;
                    color: #d8f1ff;
                }
            }
        }
    }

    .control-item {
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
            font-family: TRENDS;
            font-size: 14px;

            img {
                width: 16px;
                height: 16px;
                margin-right: 4px;
                transform: scale(2.6);
            }
        }

        .right {
            display: flex;

            .value {
                margin-right: 4px;
                font-family: Furore;
                font-size: 16px;
                color: #0febc6;
            }

            .unit {
                font-family: TRENDS;
                font-size: 14px;
                color: #d8f1ff;
            }
        }
    }

    .progress {
        width: 100%;
        height: 8px;
        margin-bottom: 8px;
        position: relative;

        .target {
            position: absolute;
            top: -2px;
            right: 0;
            width: 2px;
            height: 12px;
            background: #0febc6;
        }
    }
}
</style>
