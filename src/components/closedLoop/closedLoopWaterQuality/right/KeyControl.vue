<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 16:21:27
 * @Description:
-->
<template>
    <commonPanel title="重点管控" panel-bg="panel-big" :height="484" :big-bg-top="14">
        <template #rightTitle>
            <div class="select-box">
                <SelectPanel :option="selectOption" is-show-back :select-box-style="{ width: '120px' }" />
            </div>
        </template>
        <template #mainContent>
            <div class="main-box">
                <div class="text-16 mgb12">
                    重点因子
                </div>
                <div ref="chartDom" class="chart-box mgb16" />
                <div class="mgb8 flex-bw-c">
                    <span class="text-16">重点城市</span>
                    <span class="unit-14">预警数/测点数</span>
                </div>
                <div class="flex-bw-c mgb16">
                    <div v-for="(item, index) in keyCities" :key="index" class="item-key-city">
                        <div class="top-line text-14 mgb6">
                            {{ index + 1 }}、{{ item.name }}
                        </div>
                        <div class="value-box">
                            <span class="done-box num-16 mgr4 red">{{ item.done }}</span>
                            <span class="total-box num-16">/{{ item.total }}</span>
                        </div>
                    </div>
                </div>
                <div class="mgb8 flex-bw-c">
                    <span class="text-16">重点月份</span>
                    <span class="unit-14">次数</span>
                </div>
                <div class="flex-bw-c mgb16">
                    <div v-for="(item, index) in keyMonths" :key="index" class="item-key-month flex-bw-c">
                        <div class="top-line text-14">
                            {{ item.name }}
                        </div>
                        <div class="value-box">
                            <span class="done-box num-14 mgr4 blue-0">{{ item.value }}</span>
                        </div>
                    </div>
                </div>
                <div class="mgb8 text-16">
                    重点点位
                </div>
                <div class="table-box">
                    <PopupTable :option="colunms" :data="tableData" :height="75" :line-style="{ height: '28px' }" />
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import type { popTableOptionTs } from '@/types/common'
import { globalKey } from '@/symbols'
import { getKeyControlCloseOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    chartDom: ref<HTMLElement>(),
    chartPieData: [
        { name: '总磷(以P计）', done: 168, value: 170, rate: '30.35%' },
        { name: '氨氮', done: 185, value: 200, rate: '30.52%' },
        { name: '氨氮(NH3-N)', done: 185, value: 200, rate: '21.52%' },
    ],
    keyCities: [
        { name: '杭州市', total: '107', done: '107' },
        { name: '建德市', total: '88', done: '88' },
        { name: '金华市', total: '67', done: '67' },
    ],
    keyMonths: [
        { name: '6月', value: '290' },
        { name: '7月', value: '77' },
        { name: '1月', value: '72' },
    ],
    colunms: [
        {
            key: 'rank',
            label: '排名',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'name',
            label: '测点',
            flex: 2.4,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'level',
            label: '类型',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            render: (item, option) => {
                const levelToName = {
                    '001': '国控',
                    '002': '省控',
                    '003': '市控',
                    '004': '县控',
                }
                const key = option.key || ''
                return levelToName[item[key] as keyof typeof levelToName]
            }
        },
        {
            key: 'num',
            label: '预警数',
            flex: 1,
            rowStyle: {
                color: '#F84439',
                fontSize: '14px',
                fontFamily: 'Furore'
            },
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        }
    ] as popTableOptionTs[],
    tableData: [
        { name: '贴沙河清泰门断面', rank: '1', level: '002', num: 59 },
        { name: '风情大桥', rank: '2', level: '002', num: 138 },
        { name: '保障桥', rank: '3', level: '003', num: 285 },
    ],
    selectOption: [
        { label: '监测监控', value: '1' }
    ]
})
onMounted(() => {
    getPieData()
})

const getPieData = () => {
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getKeyControlCloseOption(data.chartPieData))
}

const { chartDom, keyCities, keyMonths, colunms, tableData, selectOption } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 16px 12px 0;

    .chart-box {
        width: 100%;
        height: 60px;
    }

    .item-key-city {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 106.67px;
        height: 52px;
        padding: 8px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }

    .item-key-month {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 106.67px;
        height: 30px;
        padding: 8px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }

    .select-box {
        width: 120px;
        height: 24px;
    }
}
</style>

