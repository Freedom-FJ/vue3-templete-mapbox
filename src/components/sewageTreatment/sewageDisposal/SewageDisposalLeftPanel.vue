<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:45:19
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-07 16:29:38
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-panel
    infrastructure.mgb20
    capital-input.mgb20
    video-surveillance.mgb20
</template>

<script lang="ts" setup name="water-quality-right-panel"></script>

<style lang="scss" scoped>
.right-panel {
    height: calc(100% - 120px);
    position: absolute;
    left: 32px;
    top: 112px;
    z-index: 9;
    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
