<template lang="pug">
commonPanel(title="水质预警" :subTitle='subTitle' :height='192')
    template(#mainContent)
        .quality-warning
            .warning-one(v-for='item, index in dataList' :key='index' :class="[popStore.getCurrentPop === 'waterQualityPop' && !index ? 'panel-checked' : '']" @click="checkPop(index)")
                .top {{item.name}}
                .circle-content
                    .circle-inner
                    .circle-pos
                    .text {{item.rate}}%
                .bottom
                    span {{item.warn}}
                    span /{{item.total}}
</template>

<script lang="ts" setup name="water-quality-warning">
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import type { countSiteTypeAndRateApiTs } from '../types'
import { globalKey } from '@/symbols'
import type { waterQualityPointTs } from '@/types/waterQuality'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import { usePopStore } from '@/store/popControl'
import service from '@/service/api'
const props = defineProps({
    waringDataList: {
        type: Array as PropType<waterQualityPointTs[]>,
        default: () => []
    }
})
const popStore = usePopStore()
const global = inject(globalKey)
const supplyData = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`,
    dataList: [
        { name: '水环境质量', rate: 0, total: 0, warn: 0 },
        { name: '饮用水源地', rate: 75, total: 20, warn: 12 },
        { name: '污水零直排', rate: 75, total: 20, warn: 12 },
    ]
})
onMounted(() => {
    getDataCount()
})
const getDataCount = async () => {
    const treeData = await getSetTreeCode()

    const params = {
        regionCodeList: [treeData],
        startTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        envTypeCodeList: [
            'water'
        ]
    }
    const res = await service<countSiteTypeAndRateApiTs[]>('waterControlCab/countSiteTypeAndRate', params)
    const resData = res.data || []
    let totalCount = 0
    let totalDis = 0
    resData.forEach((item) => {
        totalDis += item.disposedCount
        totalCount += item.totalCount
    })
    supplyData.dataList[0].total = totalCount
    supplyData.dataList[0].warn = totalDis
    supplyData.dataList[0].rate = Math.round((totalDis / totalCount) * 100)
}

const checkPop = (index: number) => {
    if (!index && popStore.getCurrentPop !== 'waterQualityPop') popStore.upDatePopup({ currentPop: 'waterQualityPop' })
    else popStore.initPop()
}
const { subTitle, dataList } = toRefs(supplyData)
</script>

<style lang="scss" scoped>
.quality-warning {
    display: flex;
    justify-content: space-between;
    padding: 10px 8px 0;

    .warning-one {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 96px;

        .top {
            margin-bottom: 6px;
            font-family: TRENDS;
            font-size: 14px;
        }

        .circle-content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;

            .circle-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 58px;
                height: 58px;
                background: conic-gradient(from 90deg at 50% 50%, #0ef 0deg, rgba(0, 238, 255, 0) 273deg, rgba(0, 238, 255, 0) 360deg);
                border-radius: 50%;
                -webkit-mask: radial-gradient(transparent, transparent 22px, #000 22px);
                mask: radial-gradient(transparent 22px, #000 22px);
            }

            .circle-pos {
                position: absolute;
                z-index: 999;
                width: 46px;
                height: 46px;
                background: url(@/assets/images/waterControlCab/circle.svg) no-repeat;
                background-size: 100% 100%;
            }

            .text {
                position: absolute;
                z-index: 999;
                font-family: Furore;
                font-size: 16px;
                color: transparent;
                text-shadow: 0 2px 4px 0 #000;
                background: linear-gradient(to bottom, #fff, #92f4ff);
                -webkit-background-clip: text;
                background-clip: text;
            }
        }

        .bottom {
            margin-top: 6px;

            span:nth-child(1) {
                font-family: Furore;
                font-size: 18px;
                color: #0df;
            }

            span:nth-child(2) {
                font-family: Furore;
                font-size: 16px;
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }
}
</style>
