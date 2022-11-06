<!--
 * @Author: mjh
 * @Date: 2022-10-16 15:39:05
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:39:09
 * @Description:
-->
<template>
    <commonPanel :title="title" :height="184">
        <template #mainContent>
            <div class="logging-list" />
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="waterlogging-discharge">
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()

const cabData = reactive({
    title: '涝水智排',

})

const { title } = toRefs(cabData)
</script>

<style lang="scss" scoped>
.logging-list {
    display: flex;
    justify-content: space-between;
}
</style>
