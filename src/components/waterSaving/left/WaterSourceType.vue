<template>
    <commonPanel title="水源类型" panel-bg="panel-big" :height="200" :big-bg-top="14">
        <template #rightTitle>
            <div class="right-unit">
                单位：万m³
            </div>
        </template><template #mainContent>
            <div class="environmental-status">
                <img src="@/assets/images/WaterSaving/pie-bottom.png"><div class="top-charts">
                    <div ref="echartsPie" class="chart-body" />
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { getPie3D } from '@/utils/echarts/pie3D'
import { usePopStore } from '@/store/popControl'

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
    const myChart = global?.echarts.init(dom)
    myChart.setOption(handlePieChart())
}

/*
 *预警情况饼图
 */
const handlePieChart = () => {
    const option = getPie3D([
        {
            name: '河道取水',
            value: 12044,
            itemStyle: {
                opacity: 1,
                color: '#2AC94F',
            }
        },
        {
            name: '水库取水',
            value: 8439,
            itemStyle: {
                opacity: 1,
                color: '#0062FF',
            }
        },
        {
            name: '其他取水',
            value: 822,
            itemStyle: {
                opacity: 1,
                color: '#FFB443',
            }
        }

    ], {
        k: 1,
        title: {
            show: true,
            text: '{name|总取水量}',
            textAlign: 'left',
            left: 40,
            top: 0,
            textStyle: {
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontFamily: 'TRENDS',
                rich: {
                    name: {
                        width: 90,
                        align: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 14,
                        fontFamily: 'TRENDS',
                    },
                }
            },
            subtextStyle: {
                rich: {
                    value: {
                        fontSize: 18,
                        color: '#FFFFFF',
                        align: 'right',
                        fontFamily: 'Furore',
                        padding: [0, 4, 0, 0]
                    },
                    unit: {
                        fontSize: 14,
                        color: '#FFFFFF',
                        align: 'right',
                        fontFamily: 'TRENDS'
                    }
                }
            },
            subtext: '{value|21,305}{unit|万m³ }',
        }
    })
    return option
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
    position: relative;
    width: 95%;
    margin: 10px auto 0;

    img {
        width: 140px;
        margin-top: 55px;
        margin-left: 7px;
    }

    .chart-body {
        position: absolute;
        top: 0;
        width: 100%;
        height: 120px;
    }
}
</style>

