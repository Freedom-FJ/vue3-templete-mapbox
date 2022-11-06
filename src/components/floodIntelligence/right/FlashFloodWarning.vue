<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:38
 * @Description:
-->
<template lang="pug">
commonPanel(title="山洪预警"  panelBg='panel-big' :height='316' :bigBgTop="14")
    template(#rightTitle)
        .btn-box.flex
            .btn-item-box.text-12.cur(v-for="(item, index) in timeList" :key="item" :class="[index === activeIndex ? 'btn-active' : '']" @click="checkRainType(index)") {{item}}
    template(#mainContent)
        .main-box
            .top-count-box
                .count-item-box
                    .title.mgb8.text-12 红色预警
                    .value.num-18 {{countObj.red}}
                .count-item-box
                    .title.mgb8.text-12 橙色预警
                    .value.num-18 {{countObj.orange}}
                .count-item-box
                    .title.mgb8.text-12 黄色预警
                    .value.num-18 {{countObj.yellow}}
                .count-item-box
                    .title.mgb8.text-12 一般预警
                    .value.num-18 {{countObj.common}}
            .table-box
                PopupTable(:option="colunms" :data="tableData" :height="130")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    timeList: ['实时', '历史'],
    colunms: [
        {
            key: 'name',
            label: '风险名称',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'address',
            label: '所在区域',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'people',
            label: '影响人口',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'time',
            label: '发布时间',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
    ],
    tableData: [
        { name: '风险名称', address: '余杭区', people: '12000', time: '2022-07-25' },
        { name: '风险名称', address: '余杭区', people: '12000', time: '2022-07-25' },
        { name: '风险名称', address: '余杭区', people: '12000', time: '2022-07-25' },
        { name: '风险名称', address: '余杭区', people: '12000', time: '2022-07-25' },
        { name: '风险名称', address: '余杭区', people: '12000', time: '2022-07-25' },
    ],
    activeIndex: 0,
    countObj: {
        red: 34,
        orange: 8,
        yellow: 6,
        common: 22
    }
})

onMounted(() => {
    //
})
const checkRainType = (index: number) => {
    data.activeIndex = index
}

const { timeList, countObj, activeIndex, tableData, colunms } = toRefs(data)
</script>

<style lang="scss" scoped>
.btn-item-box {
    box-sizing: border-box;
    height: 22px;
    padding: 5px 10px;
    margin-right: 4px;
    text-align: center;
    background: #023057;
    border: 1px solid #286c9d;
    border-radius: 4px;
}

.btn-active {
    background: #008dce;
    border: 1px solid #00e5ff;
}

.main-box {
    width: 94%;
    margin: 20px auto 0;
}

.top-count-box {
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto 16px;

    .count-item-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70px;
        height: 56px;
        padding: 9px 0;
        border-radius: 4px;
    }

    .count-item-box:nth-child(1) {
        background: rgba(237, 0, 0, 0.2);
        border: 1px solid #ed0000;
    }

    .count-item-box:nth-child(2) {
        background: rgba(255, 128, 0, 0.2);
        border: 1px solid #ff8000;
    }

    .count-item-box:nth-child(3) {
        background: rgba(237, 225, 0, 0.2);
        border: 1px solid #edc500;
    }

    .count-item-box:nth-child(4) {
        background: rgba(0, 140, 255, 0.2);
        border: 1px solid #00c8ff;
    }
}
</style>
