<!--
 * @Author: mjh
 * @Date: 2022-10-08 16:24:18
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 19:25:25
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs(ref="letDom")
    commonPanel(title="污水智治" :subTitle='subTitle' panelBg='panel-big' :height='936' :bigBgTop="14" :style="{marginBottom: pxToRem(16)}")
        template(#mainContent)
            intelligent-pollution-control
    //- commonPanel(title="洪水智防" subTitle='（最新）' panelBg='panel-big' :height='208' :bigBgTop="14")
    //-     template(#mainContent)
    //-         flood-intelligence
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
