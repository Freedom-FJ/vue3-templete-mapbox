<!--
 * @Author: Tian
 * @Date: 2022-09-05 18:19:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 11:23:06
 * @Description:
-->
<template lang="pug">
.water-legend
    .legend-one(v-for='item in level' :key="item.color")
        .square(:style="{background: item.color}")
        .text {{item.label}}
</template>

<script lang="ts" setup>
const data = reactive({
    level: [
        { label: '污水管网', color: '#FF0000' },
        { label: '雨水管网', color: '#FFE500' },
        { label: '供水管网', color: '#00DDFF' },
    ]
})
const { level } = toRefs(data)
</script>

<style lang="scss" scoped>
    .water-legend {
        position: absolute;
        bottom: 38px;
        left: 1110px;
        display: flex;
        align-items: center;

        .legend-one {
            display: flex;
            align-items: center;
            margin-right: 8px;

            .square {
                width: 32px;
                height: 4px;
            }

            .text {
                margin-left: 8px;
                font-family: TRENDS;
                font-size: 14px;
            }
        }
    }
</style>
