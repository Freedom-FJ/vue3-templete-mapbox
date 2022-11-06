<!--
 * @Author: mjh
 * @Date: 2022-09-26 00:03:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 16:59:57
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    RainfallForecast.mgb20
    MonitoringPondingPoint.mgb20
    RiverWaterLevel.mgb20
    IrrigationDrainageStation.bf-blur
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

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>

