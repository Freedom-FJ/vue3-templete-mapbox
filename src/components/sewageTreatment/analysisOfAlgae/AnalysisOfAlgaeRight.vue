<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:23:54
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-07 09:24:08
 * @Description:
-->
<template lang="pug">
el-scrollbar.analysis-right-boxs
    ChangesAlongTheProcess.mgb20
    AlarmStaticOfUpstreamSection.mgb20
    AlgaePollutionSourceControl
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
    height: calc( 100% - 112px);
    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
