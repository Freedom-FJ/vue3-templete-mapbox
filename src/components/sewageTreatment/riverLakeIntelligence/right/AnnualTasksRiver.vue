<template lang="pug">
commonPanel(title="年度任务" :height='240')
    template(#mainContent)
        .warn-content
            .rolling-box(ref="rollingBody")
                .rolling-item(v-for="(item,index) in list" :key="index")
                    .rolling-title.text-14 {{item.name}}
                    .rolling-charts(:ref="el=> item.chart=el")
</template>

<script lang="ts" setup name="annual-tasks">
import { globalKey } from '@/symbols'
import { getYearTaskOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    list: [
        {
            name: '“工业园区”污水零直排',
            chart: ref(),
            count: 18,
            dataList: [
                { name: '以建设', value: 5, rate: '37%' },
                { name: '建设中', value: 1, rate: '12%' }
            ]
        },
        {
            name: '生活小区污水零直排',
            value: 87,
            count: 18,
            chart: ref(),
            dataList: [
                { name: '以建设', value: 5, rate: '37%' },
                { name: '建设中', value: 1, rate: '12%' }
            ]
        },
    ],

})
onMounted(() => {
    getChartData()
})

const getChartData = () => {
    data.list.forEach((item) => {
        const dom = item.chart
        if (!dom) return
        const count = item.dataList.reduce((pre, curr) => {
            return pre + curr.value
        }, 0)
        const chartChance = global?.echarts.init(dom)
        chartChance.setOption(getYearTaskOption(item.dataList, count))
    })
}

const getOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#2AC94F', '#FFB443'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            left: '15%',
            top: '65%',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                return `{name|${name}}{num1|${pieData[0].value}}{rate|${pieData[0].rate}}`
            },
            textStyle: {
                rich: {
                    name: {
                        width: 40,
                        fontSize: 14,
                        color: 'rgba(255,255,255,.5)',
                        fontFamily: 'TRENDS'
                    },
                    num1: {
                        fontSize: 12,
                        color: '#00DDFF',
                        width: 40,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,1)',
                        width: 15,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: 'center', // center不行 因为会飞到整个div的中间
                top: '26%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Oswald'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['50%', '33%'],
                radius: ['35%', '50%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    .rolling-box {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;

        .rolling-item {
            display: flex;
            flex: none;
            flex-direction: column;
            align-items: center;
            width: 174px;
            height: 166px;

            .rolling-title {
                margin-bottom: 8px;
            }

            .rolling-charts {
                width: 100%;
                height: 142px;
            }
        }
    }
}
</style>
