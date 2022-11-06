<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 09:10:36
 * @Description:
-->
<template>
    <commonPanel title="节水预警" :height="184">
        <template #mainContent>
            <div class="main-box flex-bw-c pdt20">
                <div ref="chartDom" class="chart" /><div class="right-box w-60">
                    <div class="body-box">
                        <div v-for="item, index in dataList" :key="index" class="body-item-box mgb12">
                            <div class="top-line flex-bw-c mgb6">
                                <span class="text-14">{{ item.label }}</span><div class="top-right-value num-16">
                                    {{ item.done }}
                                </div>
                            </div><div class="bar-box">
                                <div class="bar-value" :style="{ width: `${item.done / item.total * 100}%` }" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getBallWaterSaveWaterCloseOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    chartDom: ref(),
    dataList: [
        { label: '已处置', done: 15, total: 20 },
        { label: '处置中', done: 5, total: 15 },
        { label: '未处置', done: 5, total: 15 },
    ]
})

onMounted(() => {
    getChart()
})

const getChart = () => {
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getBallWaterSaveWaterCloseOption(47.6))
}

const { chartDom, dataList } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    width: 100px;
    height: 100px;
}

.bar-box {
    width: 100%;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.2);

    .bar-value {
        height: 100%;
        background-color: #0df;
    }
}

.body-box {
    .body-item-box:nth-child(1) {
        .top-line {
            span {
                color: #36f097;
            }

            .top-right-value {
                color: #36f097;
            }
        }

        .bar-box {
            .bar-value {
                background-color: #36f097;
            }
        }
    }

    .body-item-box:nth-child(2) {
        .top-line {
            span {
                color: #f7c706;
            }

            .top-right-value {
                color: #f7c706;
            }
        }

        .bar-box {
            .bar-value {
                background-color: #f7c706;
            }
        }
    }

    .body-item-box:nth-child(3) {
        .top-line {
            span {
                color: #f84439;
            }

            .top-right-value {
                color: #f84439;
            }
        }

        .bar-box {
            .bar-value {
                background-color: #f84439;
            }
        }
    }
}

.main-box {
    padding: 14px 10px 0;
}
</style>

