<!--
 * @Author: Tian
 * @Date: 2022-09-19 09:49:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 21:41:57
 * @Description:
-->
<template lang="pug">
.map-layer.bf-blur(ref='mapLayer')
    .map-bg
    .map-select
</template>

<script lang="ts" setup name="camera-layer">

</script>

<style lang="scss" scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #00b4d0;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #00b4d0;
}

.map-layer {
    position: absolute;
    right: 530px;
    bottom: 60px;
    z-index: 99;
    width: 232px;
    height: 428px;

    // background: rgba(0,0,0,0.25);
    border-radius: 8px;

    .map-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .map-select {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>

