<!--
 * @Author: mjh
 * @Date: 2022-08-29 14:17:56
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 15:11:14
 * @Description:
-->
<template lang="pug">
commonPanel(title="水资源"  panelBg='panel-big' :height='296' :bigBgTop="14")
    template(#mainContent)
        .container
            .rate-box.flex-bw-c
                .left-box
                    .img-box
                        .title.text-20 水资源量
                .right-box
                    .top-line.mgb12
                        .top-unit.text-14.pdt14 亿m³
                        .top-value.num-32.blue-0.mgr4 9.96
                    .bottom-box.flex-bw-c
                        .left-label.text-12 同比
                        .right-value-box.flex-c
                            .value.num-14.red.mgr4 -19.4%
                            .arrow-red
            .river-level
                .river-box
                    .border
                    img.left-icon(src="@/assets/images/WaterSaving/rain-icon.svg")
                    .right-value
                        .top-title 降水量
                        .value-line.mgb8
                            span.value-num.mgr4 300
                            span.value-unit.unit-12 mm
                        .bottom-tb-line.flex-c
                            .tb-text 同比
                            .value-num-box.num-12.red.mgr4 -3.0%
                            .arrow-red
                .river-box-bad
                    .border(v-show="popStore.getCurrentPop !== 'BadVRiverPopup'")
                    img.left-icon(src="@/assets/images/WaterSaving/reservoir-icon.svg")
                    .right-value
                        .top-title 水库蓄水量
                        .value-line.mgb8
                            span.value-num-red.mgr4 6,194
                            span.value-unit.unit-12 mm
                        .bottom-tb-line.flex-c
                            .tb-text 同比
                            .value-num-box.num-12.red.mgr4 -3.4%
                            .arrow-red
</template>

<script lang="ts" setup>
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    completeRateDom: ref(),
})

onMounted(() => {
})

const { completeRateDom } = toRefs(data)
</script>

<style lang="scss" scoped>
/* stylelint-disable color-function-notation */
.container {
    width: 100%;
    height: 100%;
    padding: 20px 10px 0;

    .rate-box {
        display: flex;
        width: 100%;
        height: 95px;

        .img-box {
            position: relative;
            width: 112px;
            height: 96px;
            background-image: url(@/assets/images/WaterSaving/vortex.svg); // 当成背景引入
            background-repeat: no-repeat;
            background-size: 100% 100%;

            .title {
                width: 88px;
                padding-top: 10px;
                margin-left: 70px;
            }
        }

        .top-line {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            width: 144px;
            padding-bottom: 12px;
            border-bottom: 1px solid #004576;
        }
    }

    .river-level {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 72px;
        margin-top: 16px;
        cursor: pointer;

        .river-box,
        .river-box-bad {
            position: relative;
            display: flex;
            align-items: center;
            width: 164px;
            height: 88px;
            padding-left: 8px;
            background-color: #14232e;
            border-top: 1px solid #00a3ee;
            border-bottom: 1px solid #00a3ee;

            .left-icon {
                width: 52px;
                height: 52px;
                margin-right: 12px;
            }

            .right-value {
                .top-title {
                    margin-bottom: 8px;
                    font-family: TRENDS;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 14px;
                    color: #fff;
                    letter-spacing: 0;
                }

                .value-num {
                    font-family: Furore;
                    font-size: 24px;
                    font-weight: normal;
                    line-height: 24px;
                    color: transparent;
                    letter-spacing: 0;
                    background: linear-gradient(to bottom, rgb(255 255 255 / 1), #00a3ee);
                    -webkit-background-clip: text;
                    background-clip: text;
                }

                .value-num-red {
                    font-family: Furore;
                    font-size: 24px;
                    font-weight: normal;
                    line-height: 24px;
                    color: transparent;
                    letter-spacing: 0;
                    background: linear-gradient(to bottom, rgb(255 255 255 / 1), #fb8a00);
                    -webkit-background-clip: text;
                    background-clip: text;
                }
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 15px;
                content: "";
                background: linear-gradient(0deg, #00a3ee 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 15px;
                content: "";
                background: linear-gradient(0deg, #00a3ee 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 15px;
            content: "";
            background: linear-gradient(180deg, #00a3ee 0%, rgb(0 0 0 / 0) 100%);
        }

        .river-box::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 15px;
            content: "";
            background: linear-gradient(180deg, #00a3ee 0%, rgb(0 0 0 / 0) 100%);
        }

        .river-box-bad {
            background-color: #311a1a;
            border-top: 1px solid #ffaa4f;
            border-bottom: 1px solid #ffaa4f;

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 15px;
                content: "";
                background: linear-gradient(0deg, #ffaa4f 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 15px;
                content: "";
                background: linear-gradient(0deg, #ffaa4f 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box-bad::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 15px;
            content: "";
            background: linear-gradient(180deg, #ffaa4f 0%, rgb(0 0 0 / 0) 100%);
        }

        .river-box-bad::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 15px;
            content: "";
            background: linear-gradient(180deg, #ffaa4f 0%, rgb(0 0 0 / 0) 100%);
        }

        .tb-text {
            margin-right: 4px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: rgba(255, 255, 255, 0.7);
            text-align: right;
            letter-spacing: 0;
        }
    }

    .arrow-red {
        width: 0;
        height: 0;
        border-top: 4px solid red;
        border-right: 4px solid transparent;
        border-bottom: 0 solid transparent;
        border-left: 4px solid transparent;
    }

    .bottom-box {
        width: 144px;
        height: 22px;
        padding: 0 8px;
        background: rgba(255, 255, 255, 0.1);
    }
}
</style>
