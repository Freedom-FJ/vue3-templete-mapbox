<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 16:27:20
 * @Description:
-->
<template>
    <commonPanel title="问题统计" panel-bg="panel-big" :height="692" :big-bg-top="14">
        <template #mainContent>
            <div class="main-box">
                <div class="problem-num mgb16">
                    <div class="top-line flex-bw-c mgb18">
                        <div class="left-title">
                            <span class="text-14 mgr4">问题数</span>
                            <span class="num-16 blue-0 mgr4">184</span>
                            <span class="text-14">次</span>
                        </div>
                        <div class="right-value unit-14">
                            已处理/未处理
                        </div>
                    </div>
                    <div class="bottom-bar-box flex-c">
                        <div class="bar-box">
                            <div class="bar-heart" :style="{ width: `${180 / 184 * 100}%` }" />
                        </div>
                        <div class="value-box">
                            <span class="num-16 green">180</span>
                            <span class="num-16 red"> / 4</span>
                        </div>
                    </div>
                </div>
                <div class="problem-source mgb16">
                    <div class="text-14 mgb12">
                        问题来源
                    </div>
                    <div class="source-box w-100">
                        <div ref="pieDom" class="left-chart w-100" />
                    </div>
                </div>
                <div class="problem-monitoring mgb16">
                    <PopupTable :option="colunms" :data="tableData" :height="120" :header-line-style="{ height: '38px' }" />
                </div>
                <div class="problem-waring">
                    <div class="text-14 mgb12">
                        科技预警
                    </div>
                    <div class="bottom-box flex-bw-c">
                        <div v-for="(item, index) in unWaringThings" :key="index" class="bottom-item">
                            <div class="top-value mgb12 t-c">
                                <span class="num-14 blue-0">{{ Math.round(item.done / item.total * 100) }}</span>
                            </div>
                            <div class="bar-body  mg-a">
                                <GridProgressBar :value="item.done / item.total * 100" default-color="rgba(255,255,255,.2)" linear-start-color="#18F7FF" :grid-width="4" :grid-mid="2" linear-end-color="#009AE2" />
                            </div>
                            <div class="text-14 mgt12 t-c">
                                {{ item.name }}
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
import type { popTableOptionTs } from '@/types/common'
import { getProblemStatisticsCloseOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    pieDom: ref(),
    chartPieData: [
        { name: '断面报警', done: 168, value: 170, rate: '100%' },
        { name: '科技预警', done: 185, value: 200, rate: '92.5%' },
    ],
    colunms: [
        {
            key: 'name',
            label: '监测监控',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'unDone',
            label: '未处置',
            flex: 1,
            headerStyle: {
                color: '#F84439',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#F84439',
                fontSize: '18px',
                fontFamily: 'Furore'
            }
        },
        {
            key: 'doing',
            label: '处置中',
            flex: 1,
            headerStyle: {
                color: '#F7C706',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#F7C706',
                fontSize: '18px',
                fontFamily: 'Furore'
            }
        },
        {
            key: 'done',
            label: '已处置',
            flex: 1,
            headerStyle: {
                color: '#36F097',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#36F097',
                fontSize: '18px',
                fontFamily: 'Furore'
            }
        },
        {
            key: 'count',
            label: '总数',
            flex: 1,
            headerStyle: {
                color: '#00DDFF',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#00DDFF',
                fontSize: '18px',
                fontFamily: 'Furore'
            }
        },

    ] as popTableOptionTs[],
    tableData: [
        { name: '千吨万人', unDone: '0', doing: '0', done: '59', count: 59 },
        { name: '县级以上', unDone: '0', doing: '0', done: '138', count: 138 },
        { name: '设区市', unDone: '0', doing: '1', done: '281', count: 285 },
    ],
    unWaringThings: [
        { name: '非法入侵', done: 100, total: 100 },
        { name: '钓鱼捕捞', done: 87, total: 100 },
        { name: '非法排污', done: 80, total: 100 },
        { name: '违章建筑', done: 76, total: 100 },
        { name: '垃圾杂物', done: 63, total: 100 },

    ]
})
onMounted(() => {
    getPieData()
})

const getPieData = () => {
    const chartChance = global?.echarts.init(data.pieDom)
    chartChance.setOption(getProblemStatisticsCloseOption(data.chartPieData))
}
const { pieDom, colunms, tableData, unWaringThings } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 16px 12px 0;

    .problem-num {
        box-sizing: border-box;
        width: 344px;
        height: 80px;
        padding: 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;

        .bar-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 211px;
            height: 12px;
            margin-right: 27px;
            background: rgba(192, 196, 204, 0.1);

            .bar-heart {
                height: 6px;
                background: linear-gradient(270deg, #36eaaf 0%, #4bd2a3 99%);
            }
        }
    }

    .problem-source {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 344px;
        height: 110px;
        padding: 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;

        .left-chart {
            height: 60px;
        }
    }

    .problem-monitoring {
        box-sizing: border-box;
        width: 344px;
        height: 168px;
        overflow: hidden;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;
    }

    .problem-waring {
        box-sizing: border-box;
        width: 344px;
        height: 192px;
        padding: 16px;
        overflow: hidden;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;

        .bar-body {
            width: 20px;
            height: 76px;
        }
    }
}
</style>

