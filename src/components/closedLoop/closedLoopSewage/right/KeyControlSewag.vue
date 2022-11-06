<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 17:22:01
 * @Description:
-->
<template>
    <commonPanel title="重点管控" panel-bg="panel-big" :height="760" :big-bg-top="14">
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
                    <PopupTable :option="colunms" :data="tableDataCity" :height="127" :line-style="{ height: '28px' }" />
                </div>
                <div class="mgb16 text-16">
                    重点园区
                </div>
                <div class="table-box mgb16">
                    <PopupTable :option="colunms" :data="tableDataPark" :height="127" :line-style="{ height: '28px' }" />
                </div>
                <div class="mgb16 text-16">
                    重点来源
                </div>
                <div class="table-box mgb16">
                    <PopupTable :option="colunms" :data="tableDataSource" :height="127" :line-style="{ height: '28px' }" />
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import type { popTableOptionTs } from '@/types/common'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
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
    colunmsPark: [
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
            label: '园区',
            flex: 2.5,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'city',
            label: '城市',
            flex: 1,
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
    colunmsSource: [
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
            label: '问题来源',
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
    tableDataCity: [
        { name: '杭州市', rank: '1', num: 107 },
        { name: '衢州市', rank: '2', num: 88 },
        { name: '丽水市', rank: '3', num: 67 },
        { name: '台州市', rank: '4', num: 65 },
        { name: '金华市', rank: '5', num: 62 },
        { name: '温州', rank: '6', num: 60 },
    ],
    tableDataPark: [
        { name: '萧山临江工业园区', rank: '1', city: '杭州', num: 107 },
        { name: '台州高新技术产业园区', rank: '2', city: '台州', num: 88 },
        { name: '江山经济开发区', rank: '3', city: '衢州', num: 67 },
        { name: '江山经济开发区', rank: '4', city: '衢州', num: 65 },
        { name: '江山经济开发区', rank: '5', city: '衢州', num: 62 },
    ],
    tableDataSource: [
        { name: '管网破损', rank: '1', num: 107 },
        { name: '排污口设置不规范', rank: '2', num: 88 },
        { name: '管网关键节点流量异常', rank: '3', num: 67 },
        { name: '排口水质异常', rank: '4', num: 65 },
        { name: '初期雨水收集池液位和容量异常', rank: '5', num: 62 },
    ],
    selectOption: [
        { label: '工业园区', value: '1' }
    ]
})
onMounted(() => {
    //
})

const { colunms, tableDataCity, selectOption, tableDataPark, tableDataSource } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 24px 12px 0;

    .select-box {
        width: 120px;
        height: 24px;
    }
}
</style>

