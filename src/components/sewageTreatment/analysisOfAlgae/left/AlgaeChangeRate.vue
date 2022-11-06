<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-06 09:47:30
 * @Description:
-->
<template lang="pug">
commonPanel(title="叶绿素a变化率" panelBg='panel-1' :height='200')
    template(#mainContent)
        .change-rate
            .rate-one(v-for='item in list')
                .value
                    span(:style='{color: Number(item.rate) > 0 ? "#F84439" : Number(item.rate) < 0 ? "#2AC94F" : "#0084FF"}') {{item.rate}}
                    span %
                .trend
                    img(v-show='Number(item.rate)' :src='getAssetsFile(`layouts/${Number(item.rate) > 0 ? "up" : "down"}.png`)')
                img.zao(src='@/assets/images/sewageTreatment/zao.png')
                .label {{item.label}}
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import service from '@/service/api'
import type { AlgaeWarningList } from '@/components/map/sewageTreatment/mapPop/types'
import { getAssetsFile } from '@/utils/tools'
import { useAnalysisStore } from '@/store/analysis'
const propsData = defineProps({
    properties: {
        type: Object
    }
})
const analysisStore = useAnalysisStore()
const changeData = reactive({
    list: [
        { label: '环比', rate: '' },
        { label: '同比', rate: '' },
        { label: '近24小时变化率均值', rate: '' },
    ]
})
/**
 * 获取接口数据
 */
const getAlgaeAnalyseGrow = async () => {
    const res = await service<AlgaeWarningList, true>(analysisStore.getAnalysisData.data.isHandle ? 'drinkingWaterSource/changeRateHandle' : 'drinkingWaterSource/changeRate', {
        time: dayjs(analysisStore.getAnalysisData.data.time).valueOf(),
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        factorCode: analysisStore.getAnalysisData.data.factorCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : ''
    })
    changeData.list[0].rate = res?.data?.lastCompare ?? '--'
    changeData.list[1].rate = res?.data?.yearCompare ?? '--'
    changeData.list[2].rate = res?.data?.hourChangeRate ?? '--'
}
onMounted(() => {
    getAlgaeAnalyseGrow()
})
const { list } = toRefs(changeData)
</script>

<style lang="scss" scoped>
.change-rate {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    .rate-one {
        // width: 112px;
        height: 132px;
        text-align: center;
        position: relative;
        .value {
            span:nth-child(1) {
                font-family: Furore;
                font-size: 24px;
            }
            span:nth-child(2) {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                margin-right: 4px;
            }
        }
        .trend {
            width: 100%;
            height: 10px;
            position: absolute;
            top: 26px;
            img {
                width: 10px;
                height: 10px;
            }
        }
        .zao {
            width: 86px;
            height: 90px;
            margin-top: -2px;
        }
        .label {
            font-family: TRENDS;
            font-size: 14px;
        }
    }
}
</style>
