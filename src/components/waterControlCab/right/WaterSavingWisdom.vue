<!--
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:38:41
 * @Description:
-->
<template>
    <commonPanel title="节水智抓" :sub-title="subTitle" :height="284">
        <template #mainContent>
            <div class="water-saving" />
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="water-saving-wisdom">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const supplyData = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`
})
const { subTitle } = toRefs(supplyData)
</script>

<style lang="scss" scoped>
.right-title {
    font-family: TRENDS;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
}

.water-saving {
    padding: 12px 16px 0;
}
</style>
