<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:13:32
 * @Description:
-->

<template lang="pug">
el-scrollbar.analysis-center-boxs
    commonPanel(title="辅助研判" panelBg='panel-1' :height='286' :width="1000")
        template(#mainContent)
            .body-box
</template>

<script lang="ts" setup>
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const data = reactive({
    currPage: 1
})

watch(analysisStore.analysis, (val) => {
    //
}, { deep: true })
watch(() => analysisStore.analysis.data.accessCodeList, () => {
    //
})

const { currPage } = toRefs(data)
</script>

<style lang="scss" scoped>
.analysis-center-boxs {
    position: absolute;
    bottom: 32px;
    left: 50%;
    z-index: 9;
    width: fit-content;
    height: 286px;
    transform: translateX(-50%);

    .body-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding-top: 12px;
    }
}
</style>
