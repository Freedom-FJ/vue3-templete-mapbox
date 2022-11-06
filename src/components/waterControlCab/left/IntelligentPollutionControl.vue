<!--
 * @Author: mjh
 * @Date: 2022-08-29 14:17:56
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:23:14
 * @Description:
-->
<template lang="pug">
commonPanel(title="污水智治" :subTitle='subTitle' panelBg='panel-big' :height='936' :bigBgTop="14" :style="{marginBottom: pxToRem(16)}")
        template(#mainContent)
            .container
                .top-title.mgb8
                    span.title.text-16 水质预警
                    span.unit-14 （2022）
                .quality-warning
                    .warning-one(v-for='item, index in dataList' :key='index' :class="[popStore.getCurrentPop === 'waterQualityPop' && !index ? 'panel-checked' : '']" @click="checkPop(index)")
                        .top {{item.name}}
                        .circle-content
                            .circle-inner
                            .circle-pos
                            .text {{item.rate}}%
                        .bottom
                            span {{item.warn}}
                            span /{{item.total}}
</template>

<script lang="ts" setup>
import { pxToRem } from '@/utils/tools'
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()

const data = reactive({
    subTitle: '（2022）',
    dataList: [
        { name: '点击出现弹框', rate: 66, total: 3, warn: 2 },
        { name: '--', rate: 75, total: 20, warn: 12 },
        { name: '--', rate: 75, total: 20, warn: 12 },
    ]
})

onMounted(() => {
})

const checkPop = (index: number) => {
    if (!index && popStore.getCurrentPop !== 'waterQualityPop') popStore.upDatePopup({ currentPop: 'waterQualityPop' })
    else popStore.initPop()
}
const { subTitle, dataList } = toRefs(data)
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    padding: 26px 10px 0;

    .quality-warning {
        display: flex;
        justify-content: space-between;
        padding: 10px 8px 0;

        .warning-one {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 110px;

            .top {
                margin-bottom: 6px;
                font-family: TRENDS;
                font-size: 14px;
            }

            .circle-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 64px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;

                .circle-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 58px;
                    height: 58px;
                    background: conic-gradient(from 90deg at 50% 50%, #0ef 0deg, rgba(0, 238, 255, 0) 273deg, rgba(0, 238, 255, 0) 360deg);
                    border-radius: 50%;
                    -webkit-mask: radial-gradient(transparent, transparent 22px, #000 22px);
                    mask: radial-gradient(transparent 22px, #000 22px);
                }

                .circle-pos {
                    position: absolute;
                    z-index: 999;
                    width: 46px;
                    height: 46px;
                    background: url(@/assets/images/waterControlCab/circle.svg) no-repeat;
                    background-size: 100% 100%;
                }

                .text {
                    position: absolute;
                    z-index: 999;
                    font-family: Furore;
                    font-size: 16px;
                    color: transparent;
                    text-shadow: 0 2px 4px 0 #000;
                    background: linear-gradient(to bottom, #fff, #92f4ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                }
            }

            .bottom {
                margin-top: 6px;

                span:nth-child(1) {
                    font-family: Furore;
                    font-size: 18px;
                    color: #0df;
                }

                span:nth-child(2) {
                    font-family: Furore;
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }
    }
}
</style>
