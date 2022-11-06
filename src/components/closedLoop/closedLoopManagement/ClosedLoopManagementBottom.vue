<!--
 * @Author: mjh
 * @Date: 2022-09-08 15:54:29
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 14:02:29
 * @Description:
-->
<template>
    <div class="abo-main">
        <CommonPanel title="下级处置状况" :height="200" :width="1000">
            <template #rightTitle>
                <div>
                    <SelectPanel :option="selectList" is-show-back />
                </div>
            </template>
            <template #mainContent>
                <div ref="chartDom" class="chart-box mg-a" />
            </template>
        </CommonPanel>
    </div>
</template>

<script lang="ts" setup>
import { globalKey } from '@/symbols'
import { getChartCloseBarWaterQualityOption } from '@/utils/echarts/echartsOptions'

const global = inject(globalKey)
const data = reactive({
    selectList: [
        {
            value: 'more',
            label: '全部类型统计'
        }
    ],
    chartDom: ref<null | HTMLElement>()
})
onMounted(() => {
    getChartData()
})

const getChartData = () => {
    const xData = ['仁和街道', '良渚街道', '五常街道', '仓前街道', '余杭街道', '闲林街道', '中泰街道', '瓶窑镇', '径山镇', '黄湖镇', '鸬鸟镇']
    const yData = [
        { value: 120, done: 120, unDone: 0 },
        { value: 110, done: 70, unDone: 0 },
        { value: 80, done: 50, unDone: 30 },
        { value: 65, done: 40, unDone: 25 },
        { value: 63, done: 30, unDone: 25 },
        { value: 60, done: 40, unDone: 25 },
        { value: 55, done: 30, unDone: 25 },
        { value: 45, done: 30, unDone: 25 },
        { value: 35, done: 20, unDone: 25 },
        { value: 25, done: 10, unDone: 25 },
        { value: 20, done: 10, unDone: 25 },
    ]
    yData.forEach((item) => {
        item.unDone = item.value - item.done
    })
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getChartCloseBarWaterQualityOption(xData, yData))
}
const { selectList, chartDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.abo-main {
    position: absolute;
    right: 50%;
    bottom: 32px;
    z-index: 9;
    width: 1000px;
    width: fit-content;
    height: 200px;
    transform: translateX(50%);
}

.chart-box {
    width: 100%;
    height: 140px;
    margin-top: 5px;
}
</style>
