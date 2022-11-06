<!--
 * @Author: mjh
 * @Date: 2022-09-23 15:02:34
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 14:53:52
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    InformationSewageOutfall.mgb20
    DischargeMonitoring.mgb20
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

    .mgb20 {
        margin-bottom: 20px;
    }
}
</style>

