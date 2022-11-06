<!--
 * @Author: Tian
 * @Date: 2022-09-23 08:48:41
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-31 17:07:45
 * @Description:
-->
<template>
    <div class="content-mains flex-bw-c flex-w" @click="emit('showDialog')">
        <div class="flex-bw-c mgb34 first-box">
            <div class="level-box flex-c-c flex-column">
                <div class="mgb32">
                    <div class="PangMenText">
                        综合指数
                    </div>
                    <div class="PangMenText">
                        评价结果
                    </div>
                </div>
                <div class="PangMenLevel">
                    优秀
                </div>
                <img src="@/assets/images/fiveResults/level-base.png" alt="">
            </div>
            <div class="radar-box">
                <div class="common-bg" />
                <div ref="radarDom" class="radar" />
            </div>
        </div>
        <template v-for="(item, index) in levelList.slice(0, 2)" :key="index">
            <commonPanel :title="item.name" :height="280" :width="592" class="mgb34">
                <template #mainContent>
                    <div class="warn-content pdt24 flex-bw-c">
                        <div class="left-title w-35 flex-c-c flex-column">
                            <div class="num-64 mgb40" :style="{ color: item.color }">
                                {{ item.value }}
                            </div>
                            <div class="">
                                <span class="text-20">评价等级：</span>
                                <span class="text-20" :style="{ color: item.color }">{{ item.levelStr }}</span>
                            </div>
                        </div>
                        <div class="right-box w-65 flex-bw-c flex-column left-title">
                            <div v-for="(list, ind) in item.list" :key="ind" class="flex-c-c">
                                <div class="mgr8 text-14 width-72">
                                    {{ list.name }}
                                </div>
                                <div class="bar-line mgr20">
                                    <div class="bar-center" :style="{ width: `${list.done / list.total * 100}%` }" />
                                </div>
                                <div>
                                    <span class="blue-0 num-14">
                                        {{ list.done }}
                                    </span>
                                    <span class=" unit-12">
                                        /
                                    </span>
                                    <span class="num-14">
                                        {{ list.total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </commonPanel>
        </template>
    </div>
    <div class="flex-bw-c">
        <template v-for="(item, index) in levelList.slice(2)" :key="index">
            <commonPanel :title="item.name" :height="280" :width="592" class="mgb34">
                <template #mainContent>
                    <div class="warn-content pdt24 flex-bw-c">
                        <div class="left-title w-35 flex-c-c flex-column">
                            <div class="num-64 mgb40" :style="{ color: item.color }">
                                {{ item.value }}
                            </div>
                            <div class="">
                                <span class="text-20">评价等级：</span>
                                <span class="text-20" :style="{ color: item.color }">{{ item.levelStr }}</span>
                            </div>
                        </div>
                        <div class="right-box w-65 flex-bw-c flex-column left-title">
                            <div v-for="(list, ind) in item.list" :key="ind" class="flex-c-c">
                                <div class="mgr8 text-14 width-72">
                                    {{ list.name }}
                                </div>
                                <div class="bar-line mgr20">
                                    <div class="bar-center" :style="{ width: `${list.done / list.total * 100}%` }" />
                                </div>
                                <div>
                                    <span class="blue-0 num-14">
                                        {{ list.done }}
                                    </span>
                                    <span class=" unit-12">
                                        /
                                    </span>
                                    <span class="num-14">
                                        {{ list.total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </commonPanel>
        </template>
    </div>
    <div class="flex-bw-c">
        <commonPanel title="指数变化分析" :height="280" :width="900" class="mgb34">
            <template #mainContent>
                <div class="warn-content">
                    <div ref="lineDom" class="chart-box" />
                </div>
            </template>
        </commonPanel>
        <commonPanel title="下级镇街指数排名" :height="280" :width="900" class="mgb34">
            <template #rightTitle>
                <div class="btn-box flex">
                    <div class="global-btn-common" :class="{ 'global-btn-check': type === 0 }" @click.stop="checkType(0)">
                        正序
                    </div>
                    <div class="global-btn-common" :class="{ 'global-btn-check': type === 1 }" @click.stop="checkType(1)">
                        倒序
                    </div>
                </div>
            </template>
            <template #mainContent>
                <div class="warn-content">
                    <div ref="barDom" class="chart-box" />
                </div>
            </template>
        </commonPanel>
    </div>
</template>

<script setup lang="ts" name="five-water-index-eva-res">
import { fiveRadarOption, fiveWAterResultsBarStackOption, fiveWAterResultsLineOption } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
const emit = defineEmits(['showDialog'])

const global = inject(globalKey)

const data = reactive({
    radarDom: ref<HTMLElement>(),
    lineDom: ref<HTMLElement>(),
    barDom: ref<HTMLElement>(),
    levelList: [
        {
            name: '碧水指数',
            value: 89,
            level: 2,
            color: '#36F097',
            levelStr: '良好',
            list: [
                { name: '水环境质量', done: 21, total: 25 },
                { name: '污染减排', done: 18, total: 20 },
                { name: '河长履职', done: 17, total: 20 },
                { name: '水生态', done: 15, total: 15 },
                { name: '数字化水平', done: 9, total: 10 },
                { name: '人水和谐', done: 9, total: 10 },
            ]
        },
        {
            name: '涝水指数',
            value: 92,
            level: 1,
            color: '#00DDFF',
            levelStr: '优秀',
            list: [
                { name: '环境指标', done: 21, total: 25 },
                { name: '排涝工程', done: 18, total: 20 },
                { name: '风险管控', done: 17, total: 20 },
                { name: '监测预警', done: 15, total: 15 },
                { name: '抢险救灾', done: 9, total: 10 },
                { name: '数字化水平', done: 9, total: 10 },
                { name: '科普宣教', done: 10, total: 10 },
            ]
        },
        {
            name: '洪水指数',
            value: 93,
            level: 1,
            color: '#00DDFF',
            levelStr: '优秀',
            list: [
                { name: '环境指标', done: 21, total: 25 },
                { name: '防洪工程', done: 18, total: 20 },
                { name: '风险管控', done: 17, total: 20 },
                { name: '监测预警', done: 15, total: 15 },
                { name: '抢险救灾', done: 9, total: 10 },
                { name: '数字化水平', done: 9, total: 10 },
                { name: '科普宣教', done: 10, total: 10 },
            ]
        },
        {
            name: '供水指数',
            value: 85,
            level: 1,
            color: '#36F097',
            levelStr: '良好',
            list: [
                { name: '水源地保障', done: 11, total: 15 },
                { name: '供水保障', done: 13, total: 15 },
                { name: '运营维护', done: 13, total: 15 },
                { name: '水质安全', done: 15, total: 15 },
                { name: '供水服务', done: 13, total: 15 },
                { name: '应急响应', done: 12, total: 15 },
                { name: '数字化水平', done: 8, total: 15 },
            ]
        },
        {
            name: '节水指数',
            value: 92,
            level: 1,
            color: '#00DDFF',
            levelStr: '优秀',
            list: [
                { name: '水资源保护', done: 9, total: 10 },
                { name: '用水双控', done: 20, total: 20 },
                { name: '节水标杆', done: 18, total: 20 },
                { name: '节水管理', done: 12, total: 15 },
                { name: '节水成效', done: 15, total: 15 },
                { name: '数字化水平', done: 8, total: 10 },
                { name: '科普宣教', done: 10, total: 10 },
            ]
        }
    ],
    type: 0
})
onMounted(() => {
    getChart()
    getLineChart()
    getBarChart()
})

const checkType = (val: 0 | 1) => {
    if (data.type === val) return
    data.type = val
}
const getChart = () => {
    const dom = global?.echarts.init(data.radarDom)
    dom.setOption(fiveRadarOption())
}

const getLineChart = () => {
    const dom = global?.echarts.init(data.lineDom)
    dom.setOption(fiveWAterResultsLineOption())
}

const getBarChart = () => {
    const dom = global?.echarts.init(data.barDom)
    dom.setOption(fiveWAterResultsBarStackOption())
}
const { radarDom, levelList, type, barDom, lineDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.content-mains {
    width: 100%;
    height: calc(100% - 113px);

    .level-box {
        width: 184px;
        height: 280px;
        background: url(@/assets/images/panel/panel-2.png) no-repeat;
        background-size: 100% 100%;

        img {
            width: 128px;
            height: 76px;
            transform: scale(1.2);
        }

        .PangMenText {
            font-family: PangMenZhengDao;
            font-size: 20px;
            font-weight: normal;
            line-height: 28px;
            color: #d8f1ff;
        }

        .PangMenLevel {
            font-family: PangMenZhengDao;
            font-size: 48px;
            font-weight: normal;
            color: #0df;
        }
    }

    .first-box {
        width: 592px;
        height: 280px;
    }

    .radar-box {
        position: relative;
        width: 384px;
        height: 280px;

        .common-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            border-top: 30px solid;
            border-right: 70px solid;
            border-bottom: 30px solid;
            border-left: 70px solid;
            border-image-source: url(@/assets/images/panel/panel-2.png);
            border-image-slice: 30 70 30 70 fill;
        }

        .radar {
            width: calc(100% - 40px);
            height: calc(100% - 30px);
            margin: 20px 20px 10px;
        }
    }
}

.left-title {
    height: 196px;
}

.bar-line {
    width: 168px;
    height: 6px;
    overflow: hidden;
    background: #f84439;
    border-radius: 10px;

    .bar-center {
        height: 100%;
        background: #0df;
    }
}

.width-72 {
    width: 72px;
}

.chart-box {
    width: 100%;
    height: 230px;
}
</style>
