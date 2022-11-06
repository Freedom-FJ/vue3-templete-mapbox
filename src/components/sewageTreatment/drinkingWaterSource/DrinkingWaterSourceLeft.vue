<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 19:21:45
 * @Description:
-->

<template lang="pug">
el-scrollbar.drink-left-boxs
    drink-compliance-rate
    DrinkVideoSurveillance
</template>

<script lang="ts" setup>
import { pxToRem } from '@/utils/tools'
const data = reactive({
    subTitle: '（2022）',
    letDom: ref(),
})

onMounted(() => {
    //
})

const { subTitle, letDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.drink-left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);
}
</style>
