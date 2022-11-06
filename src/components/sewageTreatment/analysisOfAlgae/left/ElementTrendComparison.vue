<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-10 09:59:21
 * @Description:
-->
<template lang="pug">
commonPanel(title="要素趋势对比" panelBg='panel-1' :height='240')
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .chart(ref='elementChart')
</template>

<script setup lang="ts">
import type { AlgaeFactorGroupRes } from '../type'
import { useAnalysisStore } from '@/store/analysis'
import service from '@/service/api'
import { algaeLineChartOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
const global = inject(globalKey)
const elementChart = ref('')
const analysisStore = useAnalysisStore()
const data = reactive({
    toggleList: [
        { name: '最近7天', value: global?.dayjs(analysisStore.getAnalysisData.data.time).subtract(6, 'days').startOf('day').valueOf() },
        { name: '最近30天', value: global?.dayjs(analysisStore.getAnalysisData.data.time).subtract(29, 'days').startOf('day').valueOf() }
    ],
    activeIndex: 0,
    factorMap: [] as Record<string, any>[],
})
const seriesData = [] as Record<string, any>[]
/**
 * 日期切换
 * @param index 索引
 */
const changeNav = (index: number) => {
    data.activeIndex = index
    drawChart()
}
onMounted(async () => {
    // 获取因子组 自动和手工
    const groupCode = analysisStore.getAnalysisData.data.isHandle ? 'algae' : 'algaeAutomatic'
    const list = await getFactorGroupList(groupCode) as AlgaeFactorGroupRes
    data.factorMap = list.factors
    // 构造seriesData
    data.factorMap.forEach((item) => {
        const obj = {
            name: item.factorIndexName,
            type: 'line',
            symbolSize: 0,
            yAxisIndex: item.id === '75' ? 1 : item.id === '23' ? 2 : 0,
            data: []
        }
        seriesData.push(obj)
    })
    nextTick()
    drawChart()
})
const getChlorophylATrentChange = async (factorId: string) => {
    return await service<{
        dates: {
            level: null | number
            value?: null | number
        }[]
        times: string[]
    }, true>('drinkingWaterSource/wgmsStationDataChange1', {
        beginTime: data.toggleList[data.activeIndex].value,
        endTime: global?.dayjs(analysisStore.getAnalysisData.data.time).add(1, 'days').startOf('day').valueOf(),
        factorFlag: false,
        siteId: analysisStore.getAnalysisData.data.siteId,
        dataTimeType: analysisStore.getAnalysisData.data.isHandle ? 1440 : 60,
        queryTimeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : 'hour',
        factor: factorId
    })
}
const drawChart = async () => {
    let xData = [] as string[]
    data.factorMap.forEach(async (item, index) => {
        const res = await getChlorophylATrentChange(item.id)
        const timesList = res?.times ?? []
        const valueList = res?.dates ?? []
        xData = timesList.map((item) => {
            return item && item.substring(5, 11)
        })
        seriesData[index].data = valueList.map((item) => {
            return item?.value ?? null
        })
    })
    const chart = global?.echarts.init(elementChart.value)
    setTimeout(async () => {
        // 绘制
        const lineOptions = algaeLineChartOptions(xData, seriesData)
        chart.setOption(lineOptions)
    }, 1500)
}
const { toggleList, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        height: 22px;
        padding: 0 10px;
        margin-left: 4px;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .active {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.chart {
    width: 100%;
    height: 200px;
}
</style>
