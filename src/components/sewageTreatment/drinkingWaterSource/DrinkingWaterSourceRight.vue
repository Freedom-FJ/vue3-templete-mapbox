<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 19:21:48
 * @Description:
-->

<template lang="pug">
el-scrollbar.drink-right-boxs
    DrinkAlgaeMonitoring.mgb20
    DrinkRiverChief.mgb20
    DrinkEmergencyControl
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
.drink-right-boxs {
    position: absolute;
    top: 112px;
    right: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);
}

.mgb20 {
    margin-bottom: 20px;
}
</style>
