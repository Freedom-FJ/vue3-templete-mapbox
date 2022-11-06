<!--
 * @Author: mjh
 * @Date: 2022-10-10 15:21:15
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 16:17:07
 * @Description:
-->
<template lang="pug">
commonPanel(title="流量监控"  panelBg='panel-big' :height='296' :bigBgTop="14")
    template(#mainContent)
        .environmental-status
            .top-line.flex-c-c.mgb16
                .mid-label.text-18.mgr16 断面数量
                .mid-value.mgr4.num-20 24
                .mid-unit.unit-14 个
            PopupTable(:option="colunms" :data="tableData" :height="120" )
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
import type { popTableOptionTs } from '@/types/common'

const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    echartsPie: ref(),
    colunms: [
        {
            key: 'name',
            label: '断面名称',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'river',
            label: '所属流域',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'address',
            label: '行政区划',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'lake',
            label: '所属河湖',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'rate',
            label: '保证率',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            render: (item: record, optionItem: popTableOptionTs) => {
                return `${item[optionItem.key || '']}%`
            },
            renderStyle: (item: record, optionItem: popTableOptionTs) => {
                const value = item[optionItem.key || '']
                return {
                    color: value === 100 ? '#00DDFF' : '#f84439'
                }
            }
        },

    ] as popTableOptionTs[],
    tableData: [
        { name: '断面名称1', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
        { name: '断面名称2', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
        { name: '断面名称3', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
        { name: '断面名称4', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
        { name: '断面名称5', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
        { name: '断面名称6', river: '苕溪流域', lake: '余杭塘河', address: '余杭区', rate: 100 },
    ],
})

onMounted(() => {
    //
})

const { colunms, tableData } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-unit {
    font-family: TRENDS;
    font-size: 14px;
    font-weight: normal;
    line-height: 14px;
    color: #d8f1ff;
}

.environmental-status {
    position: relative;
    width: 95%;
    margin: 16px auto 0;

    .top-line {
        width: 336px;
        height: 40px;
        padding: 4px 16px;
        background: radial-gradient(49% 49% at 50% 0%, rgba(0, 126, 255, 0.7) 0%, rgba(0, 126, 255, 0.19) 47%, rgba(0, 126, 255, 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgba(0, 48, 97, 0) 100%), linear-gradient(90deg, rgba(0, 48, 97, 0) 0%, #003061 50%, rgba(0, 48, 97, 0) 99%);
    }
}
</style>

