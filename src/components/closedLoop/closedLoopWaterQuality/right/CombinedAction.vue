<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 10:39:55
 * @Description:
-->
<template>
    <commonPanel title="协同作战" panel-bg="panel-big" :height="432" :big-bg-top="14">
        <template #mainContent>
            <div class="main-box">
                <div class="title text-16 mgb8">
                    城市效能
                </div>
                <div class="table-box mgb15">
                    <div>
                        <PopupTable :option="colunms" :data="tableData" :height="125" :line-style="{ height: '20px' }">
                            <template #unDone="{ row }">
                                <div class="bar-box">
                                    <div class="bar-box-heart" :style="{ width: `${row.done / row.total * 100}%` }" />
                                </div>
                            </template>
                            <template #num="{ row }">
                                <div class="flex-c-c">
                                    <span class="done-value num-14 green-3">
                                        {{ row.done }}/
                                    </span>
                                    <span class="done-value num-14">
                                        {{ row.total }}
                                    </span>
                                </div>
                            </template>
                        </PopupTable>
                    </div>
                </div>
                <div class="title text-16 mgb8">
                    部门效能
                </div>
                <div class="table-box mgb16">
                    <div>
                        <PopupTable :option="colunmsDepartment" :data="tableDataDepartment" :height="125" :line-style="{ height: '28px' }">
                            <template #unDone="{ row }">
                                <div class="bar-box">
                                    <div class="bar-box-heart" :style="{ width: `${row.done / row.total * 100}%` }" />
                                </div>
                            </template>
                            <template #num="{ row }">
                                <div class="flex-c-c">
                                    <span class="done-value num-14 green-3">
                                        {{ row.done }}/
                                    </span>
                                    <span class="done-value num-14">
                                        {{ row.total }}
                                    </span>
                                </div>
                            </template>
                        </PopupTable>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import type { popTableOptionTs } from '@/types/common'
const global = inject(globalKey)
const data = reactive({
    colunms: [
        {
            key: 'rank',
            label: '排名',
            flex: 0.5,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'name',
            label: '城市',
            flex: 0.8,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'unDone',
            label: '',
            flex: 1.1,
        },
        {
            key: 'num',
            label: '件数',
            flex: 1.1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
        },
        {
            key: 'rate',
            label: '处置率',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#36F097',
                fontSize: '14px',
                fontFamily: 'Furore'
            }
        },
    ] as popTableOptionTs[],
    tableData: [
        { name: '杭州市', done: 4, total: 4, rate: '100%', rank: 1 },
        { name: '宁波市', done: 54, total: 54, rate: '100%', rank: 1 },
        { name: '绍兴市', done: 327, total: 331, rate: '98.8%', rank: 10 },
        { name: '金华市', done: 260, total: 265, rate: '98.1%', rank: 11 },
        { name: '嘉兴市', done: 253, total: 265, rate: '98.6%', rank: 12 },
        { name: '温州市', done: 327, total: 331, rate: '98.6%', rank: 13 },
    ],
    colunmsDepartment: [
        {
            key: 'rank',
            label: '排名',
            flex: 0.5,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'name',
            label: '部门',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'num',
            label: '件数',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
        },
        {
            key: 'rate',
            label: '处置率',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            rowStyle: {
                color: '#36F097',
                fontSize: '14px',
                fontFamily: 'Furore'
            }
        },
    ] as popTableOptionTs[],
    tableDataDepartment: [
        { name: '运维机构', done: 266, total: 266, rate: '100%', rank: 1 },
        { name: '环境监测站', done: 477, total: 481, rate: '100%', rank: 2 },
        { name: '治水办', done: 69, total: 73, rate: '100%', rank: 3 },
    ],
})
onMounted(() => {
    //
})

const { colunms, tableData, tableDataDepartment, colunmsDepartment } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 10px 12px 0;

    .rolling-box {
        height: 120px;
    }

    .bar-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 10px;
        background: rgba(192, 196, 204, 0.1);

        .bar-box-heart {
            width: 0;
            height: 6px;
            background: linear-gradient(270deg, rgba(15, 235, 198, 0.8) 0%, rgba(15, 235, 198, 0.2) 100%);
        }
    }
}
</style>

