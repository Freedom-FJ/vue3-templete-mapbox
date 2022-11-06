<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-12 12:55:51
 * @Description:
-->
<template lang="pug">
commonPanel(title="周边水质" :height='288' panelBg='panel-big')
    template(#rightTitle)
        .btn-box
            .item-btn(:class="[isToday ? 'item-btn-check' : '' ]" @click="isToday=true") 实时
            .item-btn(:class="[!isToday ? 'item-btn-check' : '' ]" @click="isToday=false") 年度
    template(#mainContent)
        .environmental-status
            .row-box.flex-bw-c.flex-w
                .row-item(v-for="(item,index) in list" :key="index")
                    img.left-img.mgr24(src="../../../../assets/images/sewageTreatment/sewageTreatmentPlant.png")
                    .right-text
                        .right-title.text-14.mgb8 {{item.name}}
                        .bottom-box
                            span.value-box.num-20.blue {{item.value}}
                            span.value-unit.unit-12 {{item.unit}}
            .echart-box(ref="echartsDom")
</template>

<script lang="ts" setup name="VideoSurveillance">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const global = inject(globalKey)
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '水质站', value: '25', unit: '个' },
        { name: '水质站', value: '8', unit: '个' },
    ],
    isToday: false,
    echartsDom: ref()

})
onMounted(() => {
    getChartData()
})

const getChartData = () => {
    const pieData = [
        { name: 'I类', value: 42, rate: '37%' },
        { name: 'II类', value: 212, rate: '37%' },
        { name: 'III类', value: 65, rate: '37%' },
        { name: 'IV类', value: 764, rate: '37%' },
        { name: 'V类', value: 764, rate: '37%' },
        { name: '劣V类', value: 764, rate: '37%' }
    ]
    const count = pieData.reduce((pre, curr) => {
        return pre + curr.value
    }, 0)
    const dom = data.echartsDom
    if (!dom) return
    const chartChance = global?.echarts.init(dom)
    chartChance.setOption(getOption(pieData, count))
}

const getOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#03A9F4', '#1976D2', '#85C941', '#D9CC4C', '#EE8E00', '#E12234'],
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
                        const richText = `{name|${name}}{num|${pieData[i].value}}{label|${'/'}}{rate|${pieData[i].rate}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 40,
                        fontSize: 14,
                        // fontWeight: 700,
                        // padding: [0, 0, 0, 0],
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // whiteSpace: 'nowrap'
                    },
                    num: {
                        fontSize: 14,
                        // fontWeight: 400,
                        // padding: [0, 10, 0, 10],
                        color: '#00DDFF',
                        width: 30,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        // padding: [0, 10, 0, 10],
                        color: 'rgba(255,255,255,.5)',
                        width: 15,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        fontFamily: 'Furore',
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
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: '16%', // center不行 因为会飞到整个div的中间
                top: '43%',
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
                center: ['23%', '50%'],
                radius: ['50%', '80%'],
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
const { list, isToday, echartsDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 8px 16px 0;

    .rolling-list {
        width: 100%;
        height: 170px;
    }

    .row-box {
        .row-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 164px;
            height: 80px;

            .left-img {
                flex: none;
                width: 48px;
                height: 48px;
            }

            .right-text {
                flex: none;

                .value-unit {
                    margin-left: 2px;
                }
            }
        }
    }

    .echart-box {
        width: 368px;
        height: 134px;
    }
}

.btn-box {
    display: flex;

    .item-btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 22px;
        padding: 5px 10px;
        margin-left: 4px;
        font-family: TRENDS;
        font-size: 12px;
        font-weight: normal;
        line-height: 12px;
        color: #fff;
        letter-spacing: 0;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .item-btn-check {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}
</style>
