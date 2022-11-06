<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-07 09:24:10
 * @Description:
-->

<template lang="pug">
el-scrollbar.analysis-left-boxs
    AlgaeChangeRate.mgb20
    TheTopThreeCorrFactors.mgb20
    ElementTrendComparison.mgb20
    NitrogenToPhosphorusRatio
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
    height: calc( 100% - 112px);
    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
