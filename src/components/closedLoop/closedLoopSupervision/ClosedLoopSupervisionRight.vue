<!--
 * @Author: mjh
 * @Date: 2022-09-08 15:54:29
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 18:25:11
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-boxs
    CombinedActionSupervision.mgb20
    KeyControlSupervision.mgb20
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
