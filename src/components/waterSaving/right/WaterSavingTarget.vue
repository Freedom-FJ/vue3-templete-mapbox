<!--
 * @Author: mjh
 * @Date: 2022-10-10 15:19:49
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 16:03:39
 * @Description:
-->
<template lang="pug">
commonPanel(title="节水目标"  panelBg='panel-big' :height='400' :bigBgTop="14")
    template(#mainContent)
        .environmental-status
            .item-box.flex
                .left-box.mgr16
                    img.left-img(src="@/assets/images/WaterSaving/water-icon.svg")
                .right-box
                    .right-top-line.mgb12
                        span.right-top-label.text-14.mgr16 实际用水量
                        span.right-top-value.num-16.mgr4.red 2.9
                        span.right-top-unit 亿m³
                    .mid-bar.mgb12
                        grid-progress-bar(:value='81' checkColor='rgba(248, 68, 57, 1)'  style="height: 8px" baseLine='width' :gridWidth='2' :gridMid='1')
                        .mid-target(:style="{left: '100%'}")
                    .bottom-line.flex-bw-c
                        .bottom-left.flex
                            .bottom-icon.mgr4
                            .bottom-label.text-14 控制目标
                        .bottom-right
                            span.bottom-right-value.num-16.green-0  5.2
                            span.bottom-right-unit.unit-14  亿m³
            .item-box.flex.mgr16
                .left-box
                    img.left-img(src="@/assets/images/WaterSaving/GDP.svg" style="width: 45px")
                .right-box
                    .right-top-line.mgb12
                        span.right-top-label.text-14.mgr16 万元GDP用水量
                        span.right-top-value.num-16.mgr4.red 13.6
                        span.right-top-unit m³
                    .mid-bar.mgb12
                        grid-progress-bar(:value='81' checkColor='#00DDFF'  style="height: 8px" baseLine='width' :gridWidth='2' :gridMid='1')
                        .mid-target(:style="{left: '100%'}")
                    .bottom-line.flex-bw-c
                        .bottom-left.flex
                            .bottom-icon.mgr4
                            .bottom-label.text-14 控制目标
                        .bottom-right
                            span.bottom-right-value.num-16.green-0  16.8
                            span.bottom-right-unit.unit-14  m³
            .item-box.flex.mgr16
                .left-box
                    img.left-img(src="@/assets/images/WaterSaving/build-icon.svg")
                .right-box
                    .right-top-line.mgb12
                        span.right-top-label.text-14.mgr16 万元GDP用水量
                        span.right-top-value.num-16.mgr4.red 10.1
                        span.right-top-unit m³
                    .mid-bar.mgb12
                        grid-progress-bar(:value='99' checkColor='rgba(248, 68, 57, 1)'  style="height: 8px" baseLine='width' :gridWidth='2' :gridMid='1')
                        .mid-target(:style="{left: '80%'}")
                    .bottom-line.flex-bw-c
                        .bottom-left.flex
                            .bottom-icon.mgr4
                            .bottom-label.text-14 万元工业增加值用水量
                        .bottom-right
                            span.bottom-right-value.num-16.green-0  9.9
                            span.bottom-right-unit.unit-14  m³
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'

const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    echartsPie: ref(),
})

onMounted(() => {
    //
})

const { echartsPie } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-unit {
    font-family: TRENDS;
    font-size: 14px;
    font-weight: normal;
    line-height: 14px;
    color: #d8f1ff;
}

.environmental-status {
    position: relative;
    width: 95%;
    margin: 0 auto;

    .item-box:first-child {
        border-top: 0 !important;
    }

    .item-box {
        width: 100%;
        height: 112px;
        padding-top: 22px;
        border-top: 1px solid #004576;
    }

    .left-box {
        display: flex;
        justify-content: center;
        width: 100px;
        height: 75px;
        background-image: url(@/assets/images/sewageTreatment/delivery-1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .left-img {
            width: 30px;
            height: 40px;
            margin: 0 auto;
            transform: translateY(-10px);
        }
    }

    .right-top-unit {
        font-family: TRENDS;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;
        color: rgba(216, 241, 255, 0.6);
        text-align: center;
    }

    .mid-bar {
        position: relative;
        display: flex;
        align-items: center;
        width: 256px;
        height: 12px;
        padding: 0;
        background: rgba(15, 235, 198, 0.1);
    }

    .mid-target {
        position: absolute;
        top: 0;
        left: 100%;
        width: 2px;
        height: 100%;
        background: #0febc6;
    }

    .bottom-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        border: 1px solid rgba(62, 220, 255, 0.4);
        border-radius: 1px;
        transform: rotate(45deg) scale(0.6);

        &::after {
            box-sizing: border-box;
            width: 9px;
            height: 9px;
            content: "";
            background: rgba(62, 220, 255, 0.5);
            border: 1px solid #3edcff;
            border-radius: 1px;
            box-shadow: 0 0 8px 0 rgba(62, 220, 255, 0.8);
        }
    }
}
</style>

