<!--
 * @Author: Tian
 * @Date: 2022-09-16 13:53:27
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 11:28:55
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-boxs
    WaterDroughtRisk.mgb20
    DrinkingWaterSourceSafety.mgb20
    //- WaterQualityComplianceRate.mgb20
    WaterQualityRate.mgb20
    EventProcessing.mgb20
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

