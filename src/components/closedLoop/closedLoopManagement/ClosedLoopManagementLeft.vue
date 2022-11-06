<!--
 * @Author: mjh
 * @Date: 2022-09-08 15:54:29
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-31 17:12:51
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    WaterQualityClose.mgb20
    DrinkingWaterSourceClose.mgb20
    SewageZeroDirectDischarge.mgb20
</template>

<script lang="ts" setup>
const data = reactive({
    toggleList: [
        { name: '云上巡航', value: '' },
        { name: '无人船巡查', value: '' }
    ],
    activeIndex: 0,
})
const changeNav = (index: number) => {
    data.activeIndex = index
}
const { toggleList, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.img-content {
    img {
        width: 400px;
    }
}

.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        height: 22px;
        padding: 0 10px;
        margin-left: 4px;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .active {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .img-content {
        margin-bottom: 16px;
    }

    .video {
        padding: 16px 20px;

        img {
            width: 100%;
            height: 208px;
        }
    }
}
</style>
