<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:39:30
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 20:27:01
 * @Description:
-->
<template lang="pug">
.pop-box
    .img-content.bf-blur.mgb20
        img(src='../../../../assets/images/pic/44694.svg')
    .close-box
        .close(@click='close')
</template>

<script lang="ts" setup>
import { usePopStore } from '@/store/popControl'
import MapUtil from '@/utils/map/mapUtils'
const popStore = usePopStore()
/**
 * @name: 面板关闭事件
 * @emit close
 */
const close = () => {
    MapUtil._removeMapboxPopup()
    popStore.initPop()
}
</script>

<style lang="scss" scoped>
.pop-box {
    position: absolute;
    top: 112px;
    right: 50%;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);
    transform: translateX(50%);
}

.close-box {
    position: absolute;
    top: 15px;
    right: 18px;
}

.close {
    position: relative;
    width: 12px;
    height: 12px;
    cursor: pointer;
}

.close::before {
    position: absolute;
    top: 0;
    left: 37%;
    width: 2px;
    height: 13px;
    content: "";
    background-color: #007ab2;
    transform: rotate(45deg);
}

.close::after {
    position: absolute;
    top: 0;
    left: 37%;
    width: 2px;
    height: 13px;
    content: "";
    background-color: #007ab2;
    transform: rotate(-45deg);
}
</style>
