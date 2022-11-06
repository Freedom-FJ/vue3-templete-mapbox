<!--
 * @Author: Tian
 * @Date: 2022-09-16 13:53:27
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 11:07:29
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    WarningCount.mgb20
    RainfallMonitoring.mgb20
    ReservoirStorage.mgb20
    FloodForecast.mbg20
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .img-content {
        img {
            width: 400px;
        }
    }
}
</style>

