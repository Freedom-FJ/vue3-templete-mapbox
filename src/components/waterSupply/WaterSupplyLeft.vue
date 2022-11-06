<!--
 * @Author: Tian
 * @Date: 2022-09-16 13:53:27
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 16:04:43
 * @Description: c
-->
<template lang="pug">
el-scrollbar.left-boxs
    storage-statistics.mgb20
    overview-of-water-plant.mgb20
    WaterSupplyPanel.mgb20
    WaterSecurity
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

