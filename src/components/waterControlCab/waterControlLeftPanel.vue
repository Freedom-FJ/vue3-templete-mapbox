<!--
 * @Author: mjh
 * @Date: 2022-10-08 16:24:18
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:09:10
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs(ref="letDom")
    intelligent-pollution-control
</template>

<script lang="ts" setup>
import { pxToRem } from '@/utils/tools'
const data = reactive({
    subTitle: '（2022）',
    letDom: ref()
})

onMounted(() => {
    //
})

const { subTitle, letDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);
}
</style>
