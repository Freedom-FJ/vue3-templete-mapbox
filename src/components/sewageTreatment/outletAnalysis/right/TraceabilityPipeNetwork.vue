<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 16:22:33
 * @Description:
-->
<template>
    <commonPanel title="管网溯源" :height="479">
        <template #rightTitle>
            <div class="flex">
                <SelectPanel :option="option" />
            </div>
        </template>
        <template #mainContent>
            <div class="center-box">
                <div class="top-box flex-bw-c flex-w mgb8 cur">
                    <div v-for="(item, index) in factorDataList" :key="index" class="factor-item mgb16">
                        <div class="text-14">
                            <img :src="item.icon" alt="">
                            <span class=" text-14">{{ item.label }}</span>
                        </div>
                        <div class="bottom-value-box">
                            <span class="num-20 mgr4 blue">{{ numToSeparate(item.value) }}</span>
                            <span class="unit-12">{{ item.unit }}</span>
                        </div>
                    </div>
                </div>
                <div class="bottom-table-box">
                    <div class="top-btn flex">
                        <div class="global-btn-common" :class="{ 'global-btn-check': currType === 0 }" @click="changeTimeType(0)">
                            超标关联企业
                        </div>
                        <div class="global-btn-common" :class="{ 'global-btn-check': currType === 1 }" @click="changeTimeType(1)">
                            超标管网监测点
                        </div>
                    </div>
                    <PopupTable
                        :option="colunms"
                        :data="tableData"
                        :height="150"
                        :line-style="{
                            padding: '8px 8px',
                        }"
                        :header-line-style="{
                            background: 'transparent',
                            border: '1px solid rgba(96, 162, 225, 0.5)',
                            borderTop: '0px',
                            borderRight: '0px',
                            borderLeft: '0px',
                        }"
                    />
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { usePopStore } from '@/store/popControl'
import { globalKey } from '@/symbols'
import { numToSeparate } from '@/utils/tools'
import gwqy from '@/assets/images/sewageTreatment/gwqy.png'
import gwlj from '@/assets/images/sewageTreatment/gwlj.png'
import gwcb from '@/assets/images/sewageTreatment/gwcb.png'
const global = inject(globalKey)
const popStore = usePopStore()

const data = reactive({
    currType: 0,
    factorDataList: [
        { label: '关联污染源企业', unit: '家', value: 5, icon: gwqy },
        { label: '超标的关联污染源企业', unit: '家', value: 2, icon: gwcb },
        { label: '超标管网监测点', unit: '个', value: 2, icon: gwlj },
    ],
    currClickType: 0,
    option: [
        { label: '所有因子', value: '' },
    ],
    colunms: [
        {
            key: 'index',
            label: '序号',
            flex: 1,
            rowStyle: {
                fontSize: '12px'
            }
        },
        {
            key: 'name',
            label: '名称',
            flex: 6,
            rowStyle: {
                fontSize: '12px'
            }
        },
        {
            key: 'num',
            label: '超标次数',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'Furore',
                color: '#00DDFF'
            }
        },
        {
            key: 'distance',
            label: '距离',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'Furore',
                color: '#00DDFF'
            }
        },
        {
            key: 'rate',
            label: '波动率',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'Furore',
                color: '#00DDFF'

            }
        },
    ],
    tableData: [
        { name: '杭州多宝电子有限责任公司', num: '7', distance: '3000', rate: '2.1', index: 1 },
        { name: '达利（中国）有限责任公司', num: '5', distance: '1000', rate: '3.2', index: 2 },
        { name: '杭州临安浮玉堂有限责任公司', num: '4', distance: '200', rate: '1.7', index: 3 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '2.1', index: 4 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '2.1', index: 5 },
    ],
})
onMounted(() => {
    //
})
const changeTimeType = (timeType: 0 | 1) => {
    if (timeType === data.currType) return
    data.currType = timeType
    data.currClickType = 0
}

const { colunms, tableData, factorDataList, currType, option } = toRefs(data)
</script>

<style lang="scss" scoped>
.center-box {
    padding: 8px 0;

    .factor-item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 368px;
        height: 48px;
        padding: 8px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;

        img {
            width: 32px;
            margin-right: 15px;
            vertical-align: middle;
        }
    }

    .bottom-table-box {
        box-sizing: border-box;
        width: 100%;
        height: 218px;
        padding: 12px 12px 8px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}
</style>
