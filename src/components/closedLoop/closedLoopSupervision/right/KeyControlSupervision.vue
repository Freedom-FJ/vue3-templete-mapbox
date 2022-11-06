<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-18 13:53:26
 * @Description:
-->
<template>
    <commonPanel title="重点管控" panel-bg="panel-big" :height="612" :big-bg-top="14">
        <template #rightTitle>
            <div class="select-box">
                <SelectPanel :option="selectOption" is-show-back :select-box-style="{ width: '120px' }" />
            </div>
        </template>
        <template #mainContent>
            <div class="main-box">
                <div class="mgb16 text-16">
                    重点城市
                </div>
                <div class="table-box mgb16">
                    <PopupTable :option="colunms" :data="tableData" :height="130" :line-style="{ height: '28px' }" />
                </div>
                <div class="text-16">
                    问题类型
                </div>
                <div class="w-50 mg-a relative ">
                    <img src="@/assets/images/WaterSaving/pie-bottom.png" alt="">
                    <div ref="pieDom" class="chart-pie" />
                </div>
                <div class="bottom-box">
                    <div v-for="(item, index) in countList" :key="index" class="mgb16 mgt16 flex-bw-c">
                        <div class="left-title flex-c flex-25">
                            <div class="global-ball mgr4 bgc-blue-2" />
                            <span class="title text-14">{{ item.name }}</span>
                        </div>
                        <div class="value-box flex-1">
                            <span class="blue-0 num-16">{{ item.value }}</span>
                            <span class="num-16">/{{ item.total }}</span>
                        </div>
                        <span class="num-16 flex-1 t-r">{{ item.rate }}%</span>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { getPie3D } from '@/utils/echarts/pie3D'
import type { popTableOptionTs } from '@/types/common'
import { globalKey } from '@/symbols'
import { getKeyControlCloseOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    pieDom: ref<HTMLElement>(),
    countList: [
        { name: '产业结构和发展方式', value: 168, total: 170, rate: '--' },
        { name: '自然生态保护和修复', value: 168, total: 170, rate: '--' },
        { name: '环境基础设施建设', value: 168, total: 170, rate: '--' },
        { name: '环境污染防治', value: 168, total: 170, rate: '--' },
        { name: '其他生态环境问题', value: 168, total: 170, rate: '--' },
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
            label: '区域',
            flex: 3,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
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
        { name: '杭州市', rank: '1', num: 107 },
        { name: '衢州市', rank: '2', num: 88 },
        { name: '丽水市', rank: '3', num: 67 },
        { name: '台州市', rank: '4', num: 65 },
        { name: '金华市', rank: '5', num: 62 },
    ],
    selectOption: [
        { label: '监测监控', value: '1' }
    ]
})
onMounted(() => {
    getChartData()
})

/**
 * @name: 获取环境现状数据
 */
const getChartData = async () => {
    data.countList.forEach((item) => {
        item.rate = `${((item.value / item.total) * 100).toFixed(1)}`
    })
    const dom = data.pieDom
    if (!dom) return
    const myChart = global?.echarts.init(dom)
    myChart.setOption(handlePieChart())
}
const handlePieChart = () => {
    const option = getPie3D([
        {
            name: '产业结构和发展方式',
            value: 400,
            itemStyle: {
                opacity: 1,
                color: '#FEA701',
            }
        },
        {
            name: '自然生态保护和修复',
            value: 170,
            itemStyle: {
                opacity: 1,
                color: '#FF5555',
            }
        },
        {
            name: '环境基础设施建设',
            value: 170,
            itemStyle: {
                opacity: 1,
                color: '#26BCFF',
            }
        },
        {
            name: '环境污染防治',
            value: 170,
            itemStyle: {
                opacity: 1,
                color: '#F9D94A',
            }
        },
        {
            name: '其他生态环境问题',
            value: 170,
            itemStyle: {
                opacity: 1,
                color: '#00DD78',
            }
        }

    ], {
        k: 1,
        title: null,
        legend: null,
        left: '-10',
        top: '-20',
        distance: 200
    })
    return option
}

const { pieDom, colunms, tableData, selectOption, countList } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 16px 12px 0;

    .select-box {
        width: 120px;
        height: 24px;
    }

    img {
        width: 140px;
        margin-top: 25px;
        margin-left: 7px;
    }

    .chart-pie {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100px;
    }
}
</style>

