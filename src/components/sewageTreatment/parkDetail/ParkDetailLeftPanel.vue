<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:45:19
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 11:08:11
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-panel
    IntroductionPark.mgb20
    InfrastructureParkDetail.mgb20
    SurroundingWaterQuality.mgb20
</template>

<script lang="ts" setup name="water-quality-right-panel"></script>

<style lang="scss" scoped>
.right-panel {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    height: calc(100% - 120px);

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
