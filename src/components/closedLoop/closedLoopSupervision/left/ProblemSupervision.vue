<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-18 10:21:05
 * @Description:
-->
<template>
    <commonPanel title="问题督查" panel-bg="panel-big" :height="544" :big-bg-top="14">
        <template #rightTitle>
            <div class="btn-box flex">
                <div class="global-btn-common" :class="{ 'global-btn-check': type === 0 }" @click="checkType(0)">
                    问题发现
                </div>
                <div class="global-btn-common" :class="{ 'global-btn-check': type === 1 }" @click="checkType(1)">
                    督察整改
                </div>
            </div>
        </template>
        <template #mainContent>
            <div class="main-box">
                <ProblemFind v-show="!type" />
                <ProblemRectification v-show="type" />
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    type: 0

})
onMounted(() => {
    //
})
const checkType = (num: number) => {
    data.type = num
}
const { type } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 16px 10px 0;
}
</style>

