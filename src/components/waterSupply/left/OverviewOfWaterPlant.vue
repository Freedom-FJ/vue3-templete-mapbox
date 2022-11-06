<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-10 10:56:09
 * @Description:
-->
<template lang="pug">
commonPanel(title="水厂概况" panelBg='panel-big' :height='204' :bigBgTop="14")
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .all(v-show='activeIndex === 0')
            .chart-body(ref="echartsPie")
        .country(v-show='activeIndex === 1')
            .rank-list-box
                .rank-item(v-for="(item, index) in resultShowRankList" :key="index")
                    .rank-value {{item.count}}
                    .rank-bar
                        .rank-bar-value(:style="{ height: (item.count / 4 * 100) + '%'}")
                    .rank-label {{item.name}}
</template>

<script lang="ts" setup>
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const echartsPie = ref()
const data = reactive({
    toggleList: [
        { name: '全区', value: '' },
        { name: '乡镇', value: '1' }
    ],
    activeIndex: 0,
    resultShowRankList: [
        { count: 4, name: '中泰' },
        { count: 0, name: '闲林' },
        { count: 0, name: '余杭' },
        { count: 0, name: '仓前' },
        { count: 2, name: '五常' },
        { count: 3, name: '径山' },
        { count: 2, name: '良渚' },
        { count: 1, name: '仁和' },
        { count: 0, name: '瓶窑' },
    ]
})
onMounted(() => {
    getChart()
})
const changeNav = (index: number) => {
    data.activeIndex = index
}
const getChart = () => {
    const chartChance = global?.echarts.init(echartsPie.value)
    const pieData = [
        { name: '城市水厂', value: 4, unit: '座' },
        { name: '千吨万人', value: 3, unit: '座' },
        { name: '两百吨千人以上', value: 2, unit: '座' },
        { name: '两百吨千人以下', value: 3, unit: '座' }
    ]
    const options = getOption(pieData, 12)
    chartChance.setOption(options)
}
const getOption = (pieData: { name: string; value: number; unit: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#0062FF', '#2AC94F', '#FFB443', '#F84439'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            right: '0%',
            left: '50%',
            top: 'center',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const richText = `{name|${name}}{num|${pieData[i].value}}{unit|${pieData[i].unit}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 100,
                        fontSize: 14,
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                    },
                    num: {
                        fontSize: 14,
                        color: '#00DDFF',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    unit: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        fontFamily: 'TRENDS',
                        color: 'rgba(255,255,255,1)'
                    }
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
                return `${name}：${value}座`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: '20%', // center不行 因为会飞到整个div的中间
                top: '43%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Furore'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['23%', '50%'],
                radius: ['43%', '70%'],
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
const { toggleList, activeIndex, resultShowRankList } = toRefs(data)
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
.chart-body {
    width: 100%;
    height: 140px;
}
.country {
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.rank-list-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 90px;

    .rank-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .rank-value {
            font-family: Furore;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #0df;
            letter-spacing: 0;
        }

        .rank-bar {
            display: flex;
            flex-direction: column-reverse;
            flex-grow: 1;
            width: 20px;
            height: 49px;
            margin: 8px 0 9px;
            background: rgba(255, 255, 255, 0.1);

            .rank-bar-value {
                width: 100%;
                background: #03a9f4;
            }
        }

        .rank-label {
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;

            /* 白色 */
            color: #fff;
            letter-spacing: 0;
        }
    }
}
</style>

