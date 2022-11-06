<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 20:06:06
 * @Description:
-->

<template lang="pug">
.analysis-center
    AnalysisPanel.pos
    DrinkVideoSurveillance.video
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.pos {
    position: absolute;
    top: 160px;
    left: 454px;
    width: 288px;
    height: 320px;
}

.video {
    position: absolute;
    bottom: 20px;
    left: 454px;
    z-index: 9;
    width: 400px;
}
</style>
