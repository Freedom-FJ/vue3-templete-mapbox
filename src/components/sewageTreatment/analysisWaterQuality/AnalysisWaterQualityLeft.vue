<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 16:07:48
 * @Description:
-->

<template lang="pug">
el-scrollbar.analysis-left-boxs
    QualityRainfallWater.mgb20
    SevenDayK.mgb20
    UpstreamImpact
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.analysis-left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
