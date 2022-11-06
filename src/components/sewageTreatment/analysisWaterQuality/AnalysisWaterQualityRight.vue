<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:23:54
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 16:07:50
 * @Description:
-->
<template lang="pug">
el-scrollbar.analysis-right-boxs
    SurroundingPollution.mgb20
    InspectionService
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.analysis-right-boxs {
    position: absolute;
    top: 112px;
    right: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);
}
</style>
