<template lang="pug">
commonPanel(title="年度任务" :height='176')
    template(#mainContent)
        .warn-content
            .rolling-box(ref="rollingBody")
                .rolling-item(v-for="(item,index) in list" :key="index")
                    .rolling-title.text-14 {{item.name}}
                    .rolling-charts(:ref="el=> item.chart=el")
                .rolling-item(v-for="(item,index) in listClone" :key="index")
                    .rolling-title.text-14 {{item.name}}
                    .rolling-charts(:ref="el=> item.chart=el")
</template>

<script lang="ts" setup name="annual-tasks">
import { globalKey } from '@/symbols'
import service from '@/service/api'
const global = inject(globalKey)
const data = reactive({
    isHandle: true,
    list: [
        {
            name: '工业园区（工业集聚区）污水零直排建设',
            chart: ref(),
            count: 4,
            dataList: [
                { name: '以建设', value: 4, rate: '100%' },
                { name: '建设中', value: 0, rate: '0%' }
            ]
        },
        {
            name: '生活小区污水零直排建设',
            value: 87,
            count: 23,
            dataList: [
                { name: '以建设', value: 23, rate: '100%' },
                { name: '建设中', value: 0, rate: '0%' }
            ]
        },
        {
            name: '镇（街道）污水零直排区建设',
            value: 87,
            count: 2,
            dataList: [
                { name: '以建设', value: 2, rate: '100%' },
                { name: '建设中', value: 0, rate: '0%' }
            ]
        },
    ],
    listClone: [
        {
            name: '国控断面环境状况排查分析',
            chart: ref(),
            count: 2,
            dataList: [
                { name: '以建设', value: 2, rate: '100%' },
                { name: '建设中', value: 0, rate: '0%' }
            ]
        },
        {
            name: '饮用水水源保护区巡查和有机污染物全指标分析',
            value: 87,
            count: 2,
            dataList: [
                { name: '以建设', value: 2, rate: '100%' },
                { name: '建设中', value: 0, rate: '0%' }
            ]
        }
    ],
    rollingBody: ref()
})
onMounted(() => {
    getChartData()
    startAnimation()
})

const startAnimation = () => {
    const dom = data.rollingBody
    if (!dom) return
    const num = data.list.length
    const style = document.styleSheets[0]
    const styleArray = [].slice.call(style.cssRules) // 将伪数组变成数组
    const index = styleArray.findIndex((item: { name: string }) => item.name === 'rollingsAnnualTasks')
    if (index !== -1) style.deleteRule(index) // 如果有此动画就先删除
    dom.setAttribute('style', `animation: rollingsAnnualTasks ${4 * num}s linear  infinite; `)
    dom.style.animationPlayState = '' // 继续动画
    const widths = num * 254
    style.insertRule(`@keyframes rollingsAnnualTasks {0%{ transform: translateX(0%);}100%{transform: translateX(-${widths}px);}}`, 0)
}
const getChartData = async () => {
    data.list.forEach((item) => {
        const dom = item.chart
        if (!dom) return
        const count = item.dataList.reduce((pre, curr) => {
            return pre + curr.value
        }, 0)
        const chartChance = global?.echarts.init(dom)
        chartChance.setOption(getOption(item.dataList, count))
    })
    data.listClone.forEach((item) => {
        const dom = item.chart
        if (!dom) return
        const count = item.dataList.reduce((pre, curr) => {
            return pre + curr.value
        }, 0)
        const chartChance = global?.echarts.init(dom)
        chartChance.setOption(getOption(item.dataList, count))
    })
}

const getOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#36F097', '#FF8000'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            right: '0%',
            left: '45%',
            top: 'center',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                if (name === '以建设') return `{name|${name}}{num1|${pieData[0].value}}{label|${'/'}}{rate|${pieData[0].rate}}`
                else return `{name|${name}}{num2|${pieData[1].value}}{label|${'/'}}{rate|${pieData[1].rate}}`
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
                        color: '#36F097',
                        width: 40,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    num2: {
                        fontSize: 12,
                        color: '#FF8000',
                        width: 40,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        color: 'rgba(255,255,255,.5)',
                        padding: [0, 2, 0, -17],
                        width: 20,
                        align: 'center',
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
                left: count.toString().length === 1 ? '13%' : '10%', // center不行 因为会飞到整个div的中间
                top: '30%',
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
                center: ['16%', '46%'],
                radius: ['63%', '90%'],
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
const { rollingBody, list, listClone } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    overflow: hidden;

    .rolling-box {
        display: flex;
        justify-content: space-between;
        padding: 16px 24px;
        animation: rollingsAnnualTasks 60s linear infinite;

        &:hover {
            animation-play-state: paused;
        }

        .rolling-item {
            flex: none;
            width: 244px;
            height: 96px;

            .rolling-title {
                margin-bottom: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .rolling-charts {
                width: 100%;
                height: 74px;
            }
        }
    }
}
</style>
