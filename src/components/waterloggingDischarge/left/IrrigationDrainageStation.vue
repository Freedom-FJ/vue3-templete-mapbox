<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 17:17:59
 * @Description:
-->
<template lang="pug">
commonPanel(title="排灌站"  panelBg='panel-big' :height='224' :bigBgTop="14")
    template(#mainContent)
        .main-box.pdt12.mg-a
            .out-item-box.mgb6(v-for="(item, index) in list" :key="index")
                .top-line.flex-bw-c.mgb4.pdt4
                    .top-title {{item.label}}
                    .top-value {{item.value}}m³
                .bar-box
                    .bar-line(:style="{width: item.percent + '%', borderRadius: item.percent === 100 ? '4px' : '4px 0 0 4px'}")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    list: [
        { label: '全区总排水量', value: 7239250, percent: 100 },
        { label: '夹里斗排灌站', value: 5239250, percent: 95 },
        { label: '陈家角排灌站', value: 2239250, percent: 60 },
        { label: '兴隆坝排灌站', value: 839250, percent: 40 },
    ]
})
onMounted(() => {
    //
})
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    width: 88%;
    height: 150px;
}

.bar-box {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    .bar-line {
        height: 100%;
        background: linear-gradient(270deg, #36eaaf 0%, #4bd2bb 100%);
    }
}

.main-box :first-child {
    .bar-line {
        background: linear-gradient(270deg, #fc9802 5%, #d97000 100%);
    }
}
</style>

