<template lang="pug">
commonPanel(title="用水统计"  panelBg='panel-big' :height='400' :bigBgTop="14")
    template(#rightTitle)
        .right-unit 单位：万m³
    template(#mainContent)
        .environmental-status
            .top-charts
                .chart-body(ref="echartsPie")
            .bottom-count
                .count-line.flex-bw-c.mgb10.flex-son-1(v-for="(item, index) in countList" :key="index")
                    .label.text-14 {{item.name}}
                    .value-box.t-r.pdr10
                        span.value.num-18.blue-0.mgr8 {{item.value}}
                        span.unit-box.text-12 万m³
                    .tb-box.flex-c.flex-row-r
                        .tb-value-box.flex-c.flex-row-r
                            .arrow-red
                            .tb-value.num-14.mgr4(:class="[item.tb > 0 ? 'red' : 'green-3']") {{item.tb}}%
                        .tb-label.text-14.mgr8 同比
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
import { getWaterStatisticsOption } from '@/utils/echarts/echartsOptions'
import service from '@/service/api'
const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    countList: [
        { name: '工业用水', value: 2146, tb: 27.9, rate: '--' },
        { name: '农业用水', value: 14966, tb: 10.3, rate: '--' },
        { name: '居民生活用水', value: 5636, tb: 16.7, rate: '--' },
        { name: '服务业用水', value: 5154, tb: 42.0, rate: '--' },
        { name: '生态环境用水', value: 947, tb: -2.6, rate: '--' },
    ],
    echartsPie: ref()
})

onMounted(() => {
    getChartData()
})

/**
 * @name: 获取环境现状数据
 */
const getChartData = async () => {
    const count = data.countList.reduce((pre, curr) => {
        return pre + curr.value
    }, 0)
    data.countList.forEach((item) => {
        item.rate = `${((item.value / count) * 100).toFixed(1)}`
    })
    const dom = data.echartsPie
    if (!dom) return
    const chartChance = global?.echarts.init(dom)
    chartChance.setOption(getWaterStatisticsOption(data.countList, count))
}

const { echartsPie, countList } = toRefs(data)
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
    width: 95%;
    margin: 0 auto;

    .chart-body {
        width: 100%;
        height: 153px;
    }

    .arrow-red {
        width: 0;
        height: 0;
        border-top: 4px solid red;
        border-right: 4px solid transparent;
        border-bottom: 0 solid transparent;
        border-left: 4px solid transparent;
    }

    .count-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 344px;
        height: 26px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.08);
    }

    .tb-value-box {
        width: 55px;
    }
}
</style>
