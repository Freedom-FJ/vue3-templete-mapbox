<!--
 * @Author: mjh
 * @Date: 2022-09-23 15:02:34
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 16:30:52
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-boxs
    TraceabilityPipeNetwork.mgb20
    WaterQualityFingerprint.mgb20
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.right-boxs {
    position: absolute;
    top: 112px;
    right: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>

