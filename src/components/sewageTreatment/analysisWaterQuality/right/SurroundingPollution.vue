<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:14:46
 * @Description:
-->
<template lang="pug">
commonPanel(title="周边污染影响" panelBg='panel-1' :height='536')
    template(#mainContent)
        .box-big.mgb24.mgt24
</template>

<script setup lang="ts">
import { maxBy } from 'lodash-es'
import type { pomsAlarmTs, pomsAnalysisTs } from '../types'
import { getFactorGroupList, wgmsGetWaterAllFactorList } from '@/utils/commonMethods/factor'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const data = reactive({
    pomsAlarmData: [] as pomsAlarmTs[],
})

watch(() => analysisStore.analysis.data.accessCodeList, () => {
    //
})

const { pomsAlarmData } = toRefs(data)
</script>

<style lang="scss" scoped>
.box-big {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>
