<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 17:15:35
 * @Description:
-->
<template lang="pug">
commonPanel(title="山洪预警"   :height='152' )
    template(#mainContent)
        .main-box
            .top-header.flex-son-1.flex-c.t-son-c.mgb10
                .top-item.unit-14 预警总数
                .top-item.text-14.red 未处置
                .top-item.text-14.yellow 处置中
                .top-item.text-14.green 已处置
                .top-item.text-14.blue 处置率
            .top-value-line.flex-son-1.flex-c.t-son-c.mgb14
                .top-item.num-18 25
                .top-item.num-18.red 5
                .top-item.num-18.yellow 5
                .top-item.num-18.green 15
                .top-item.num-18.blue 75%
            .bar-box.flex-c.mg-a
                .done-bar.bgc-green.mgr1(:style="{flex: 15}")
                .doneIng-bar.bgc-yellow.mgr1(:style="{flex: 5}")
                .unDone-bar.bgc-red(:style="{flex: 5}")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    chartPieDom: ref(),
    barDom: ref(),
    chartPieData: [
        { name: '未处理', value: 4, rate: '1.4%' },
        { name: '已处理', value: 180, rate: '98.6%' },
    ]
})

const { chartPieDom, barDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 4px 8px;

    .top-header {
        width: 100%;
        height: 32px;
        background: rgba(78, 149, 255, 0.1);
    }

    .bar-box {
        width: 90%;
        height: 8px;

        & > div {
            height: 100%;
        }
    }
}
</style>

