<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 17:01:24
 * @Description:
-->
<template>
    <commonPanel title="问题统计" panel-bg="panel-big" :height="936" :big-bg-top="14">
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
                <div class="text-16 mgb18">
                    分类统计
                </div>
                <div class="pie-box-list flex-bw-c mgb16">
                    <div v-for="(item, index) in pieList" :key="index" :ref="el => item.dom = el" class="chart-box" />
                </div>
                <div class="problem-waring mgb16">
                    <div class="text-14 mgb16">
                        工业园区
                    </div>
                    <div class="bottom-box flex-bw-c">
                        <div v-for="(item, index) in unWaringThings" :key="index" class="bottom-item">
                            <div class="top-value mgb8 t-c">
                                <span class="num-14 blue-0">{{ item.done }}</span>
                                <span class="num-14">/{{ item.total }}</span>
                            </div>
                            <div class="bar-body  mg-a">
                                <GridProgressBar :value="item.done / item.total * 100" default-color="rgba(255,255,255,.2)" linear-start-color="#18F7FF" :grid-width="4" :grid-mid="2" linear-end-color="#009AE2" />
                            </div>
                            <div class="num-14 blue-0 mgt8 t-c">
                                {{ Math.round(item.done / item.total * 100) }}%
                            </div>
                            <div class="text-14 mgt12 t-c">
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-16 mgb16">
                    生活小区
                </div>
                <div class="live-park mgb16">
                    <div class="flex-bw-c mgb16">
                        <span class="text-14">年度任务</span>
                        <span class="unit-14">已完成/完成数 </span>
                    </div>
                    <div class="park-bar-box flex-bw-c mgb24">
                        <div class="park-bar">
                            <div class="park-bar-heart" />
                        </div>
                        <div class="park-bar-value">
                            <span class="num-16 blue-0">10</span>
                            <span class="num-16">/10</span>
                        </div>
                    </div>
                    <div class="flex-bw-c mgb16">
                        <span class="text-14">监测监控</span>
                        <span class="unit-14">已完成/完成数 </span>
                    </div>
                    <div class="park-bar-box flex-bw-c">
                        <div class="park-bar">
                            <div class="park-bar-heart" />
                        </div>
                        <div class="park-bar-value">
                            <span class="num-16 blue-0">10</span>
                            <span class="num-16">/10</span>
                        </div>
                    </div>
                </div>
                <div class="text-16 mgb16">
                    建设街镇
                </div>
                <div class="live-park">
                    <div class="flex-bw-c mgb16">
                        <span class="text-14">年度任务</span>
                        <span class="unit-14">已完成/完成数 </span>
                    </div>
                    <div class="park-bar-box flex-bw-c mgb24">
                        <div class="park-bar">
                            <div class="park-bar-heart" />
                        </div>
                        <div class="park-bar-value">
                            <span class="num-16 blue-0">10</span>
                            <span class="num-16">/10</span>
                        </div>
                    </div>
                    <div class="flex-bw-c mgb16">
                        <span class="text-14">监测监控</span>
                        <span class="unit-14">已完成/完成数 </span>
                    </div>
                    <div class="park-bar-box flex-bw-c">
                        <div class="park-bar">
                            <div class="park-bar-heart" />
                        </div>
                        <div class="park-bar-value">
                            <span class="num-16 blue-0">10</span>
                            <span class="num-16">/10</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getProblemStatisticsSewagCloseOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    unWaringThings: [
        { name: '上级交办', done: 10, total: 10 },
        { name: '公众监督', done: 9, total: 10 },
        { name: '平级转办', done: 8, total: 10 },
        { name: '基层上报', done: 7, total: 10 },
    ],
    pieList: [
        {
            name: '工业园区',
            dom: ref<any>(),
            data: [
                { name: '已处置', value: 75 },
                { name: '未处置', value: 25 },
            ]
        },
        {
            name: '生活小区',
            dom: ref<any>(),
            data: [
                { name: '已处置', value: 75 },
                { name: '未处置', value: 25 },
            ]
        },
        {
            name: '建设镇街',
            dom: ref<any>(),
            data: [
                { name: '已处置', value: 75 },
                { name: '未处置', value: 25 },
            ]
        },
    ]
})
onMounted(() => {
    getPieData()
})

const getPieData = () => {
    data.pieList.forEach((item) => {
        const chartChance = global?.echarts.init(item.dom)
        chartChance.setOption(getProblemStatisticsSewagCloseOption(item.data, item.name))
    })
}
const { pieList, unWaringThings } = toRefs(data)
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

    .problem-waring {
        box-sizing: border-box;
        width: 344px;
        height: 216px;
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

    .pie-box-list {
        height: 90px;
        padding: 0 20px;
    }

    .chart-box {
        width: 70px;
        height: 100%;
    }

    .live-park {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 344px;
        height: 140.8px;
        padding: 12px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;

        .park-bar {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 211px;
            height: 12px;
            padding: 3px 0;
            background: rgba(192, 196, 204, 0.1);

            & > div {
                width: 196px;
                height: 6px;
                background: linear-gradient(270deg, #0df 0%, rgba(0, 221, 255, 0) 100%);
            }
        }
    }
}
</style>

