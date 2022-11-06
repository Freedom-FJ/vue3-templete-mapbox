<!--
 * @Author: mjh
 * @Date: 2022-09-26 00:03:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 19:25:49
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    WaterResource.mgb20
    WaterSourceType.mgb20
    WaterUseStatistics.mgb20
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

