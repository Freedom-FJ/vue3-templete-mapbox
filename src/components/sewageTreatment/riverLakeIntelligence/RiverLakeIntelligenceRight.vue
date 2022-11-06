<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:39:30
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 16:30:08
 * @Description:
-->
<template lang="pug">
el-scrollbar.right-boxs
    RiverChiefIntelligence.mgb20
    EventStatistics.mgb20
    FourChaosProblems.mgb20
    AnnualTasksRiver.mgb20
</template>

<script lang="ts" setup>
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
</script>

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

    .img-content > img {
        width: 400px;
    }
}
</style>
