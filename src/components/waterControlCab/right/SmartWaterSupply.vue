<!--
 * @Author: mjh
 * @Date: 2022-08-29 19:45:16
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:37:56
 * @Description:
-->
<template>
    <commonPanel title="供水智保" :sub-title="subTitle" :height="216">
        <template #mainContent>
            <div class="supply-content" />
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="smart-water-supply">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'

const popStore = usePopStore()
const global = inject(globalKey)
const supplyData = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`,
})

/**
 * @name: 面板点击事件
 * @desc: 控制内容见 WaterControlCab文件 以及pinia popControl内
 */
const checkTab = () => {
    popStore.upDatePopup({ currentPop: 'FloodPopup', popData: '' })
}
const { subTitle } = toRefs(supplyData)
</script>

<style lang="scss" scoped>
.supply-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 16px 6px 0;
}
</style>
