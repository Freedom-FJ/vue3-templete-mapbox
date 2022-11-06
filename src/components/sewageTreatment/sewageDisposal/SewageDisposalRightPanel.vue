<template lang="pug">
el-scrollbar.right-panel
    Benchmarking.mgb20
    DailyControlSewage.mgb20
    annual-tasks-sewage.mgb20
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
