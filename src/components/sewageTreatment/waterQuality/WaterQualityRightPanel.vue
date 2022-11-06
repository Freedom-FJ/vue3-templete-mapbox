<!--
 * @Author: mjh
 * @Date: 2022-09-26 00:03:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 11:05:05
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-panel
    distribution-status.mgb20
    daily-control.mgb20(:yearWaringData="yearWaringData")
    river-chief.mgb20
    annual-tasks
</template>

<script lang="ts" setup name="water-quality-right-panel">
import type { PropType } from 'vue'
import type { waterQualityPointTs } from '@/types/waterQuality'

defineProps({
    // 预警事件年统计
    yearWaringData: {
        type: Array as PropType<waterQualityPointTs[]>
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
