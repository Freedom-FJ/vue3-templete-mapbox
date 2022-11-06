<!--
 * @Author: mjh
 * @Date: 2022-09-12 20:49:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:35:05
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-panel
    DailyControl.mgb20
    WaterloggingDischarge.mgb20
    SmartWaterSupply.mgb20
    WaterSavingWisdom
</template>

<script lang="ts" setup name="water-control-right-panel">
import type { PropType } from 'vue'
import type { waterQualityPointTs } from '@/types/waterQuality'
defineProps({
    waringDataList: {
        type: Array as PropType<waterQualityPointTs[]>,
        default: () => []
    }
})
</script>

<style lang="scss" scoped>
.right-panel {
    position: absolute;
    top: 112px;
    right: 32px;
    z-index: 9;
    height: calc(100% - 120px);

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
