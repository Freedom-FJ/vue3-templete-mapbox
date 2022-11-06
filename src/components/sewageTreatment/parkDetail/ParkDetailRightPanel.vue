<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:08:05
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 10:00:38
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-panel
    PipeNetworkWarning.mgb20
    DailyControlParkDetail.mgb20
    annual-tasks-park-detail.mgb20
</template>

<script lang="ts" setup name="water-quality-right-panel"></script>

<style lang="scss" scoped>
.right-panel {
    position: absolute;
    top: 112px;
    right: 32px;
    z-index: 9;
    height: calc(100% - 120px);

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>
