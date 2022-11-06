<!--
 * @Author: mjh
 * @Date: 2022-10-09 14:05:44
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:45
 * @Description:
-->
<template lang="pug">
commonPanel(title="区域预警分布"  panelBg='panel-big' :height='264' :bigBgTop="14")
    template(#mainContent)
        .main-box.pdt20.w-95.mg-a
            .top-title.text-16.mgb16 河道水质排名
            .bottom-box
                .btm-item.flex.mgb12(v-for="(item, index) in list" :key="index")
                    .title.text-14.mgr9 {{item.name}}
                    .right-bar.flex
                        .bar-line.mgr4(:style="{width: item.value + '%'}")
                        .bar-value.num-14 {{item.value}}
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    list: [
        { name: '北塘', value: 94 },
        { name: '山塘', value: 90 },
        { name: '前膛', value: 84 },
        { name: '径山', value: 82 },
        { name: '仁和', value: 76 },
    ]
})

onMounted(() => {
    //
})

const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-bar {
    align-items: center;
    width: 307px;
    height: 16px;
    background: rgba(192, 196, 204, 0.1);

    .bar-line {
        width: 216px;
        height: 6px;
        background: linear-gradient(270deg, #f20 0%, #d2684b 100%);
    }
}
</style>

