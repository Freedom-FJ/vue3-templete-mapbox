<!--
 * @Author: mjh
 * @Date: 2022-10-13 09:55:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 10:25:07
 * @Description:
-->
<template lang="pug">
commonPanel(title="清四乱问题统计" :height='160')
    template(#mainContent)
        .warn-content.flex-w.flex-bw-c
            .box.mgb16.flex-bw-c(v-for="item, index in list" :key="index")
                .title.text-16.mgr8 {{item.name}}
                .num.num-18.blue-0.mgr4 {{item.value}}
                .percent.num-18 /{{item.rate}}
</template>

<script lang="ts" setup name="torrent-warning">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    isHandle: true,
    list: [
        { name: '乱占', value: 25, rate: '100%' },
        { name: '乱采', value: 17, rate: '100%' },
        { name: '乱堆', value: 23, rate: '100%' },
        { name: '乱建', value: 5, rate: '100%' },
    ]
})

const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    width: 93%;
    height: 100%;
    padding: 16px 0;
    margin: 0 auto;

    .box {
        box-sizing: border-box;
        width: 162px;
        height: 34px;
        padding: 8px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}
</style>
