<!--
 * @Author: mjh
 * @Date: 2022-09-07 10:00:47
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 21:05:17
 * @Description:
-->
<template lang="pug">
transition(name="opacity")
    .map-toggle.bf-blur(v-show="!popStore.getCurrentPop" style="height: 36px;")
        .map-bg
        .toggle
            .item(v-for='item, index in changeList' :class='modelValue === index ? "active" : ""' :key="item" @click="change(index)") {{item}}
</template>

<script lang="ts" setup name="map-toggle">
import { usePopStore } from '@/store/popControl'
defineProps({
    modelValue: {
        type: Number,
        default: 0
    }
})
const emit = defineEmits([
    'update:modelValue',
])
const popStore = usePopStore()
const data = reactive({
    changeList: ['排名', '点位', '预警'],
})
const change = (index: number) => {
    emit('update:modelValue', index)
}
const { changeList } = toRefs(data)
</script>

<style lang="scss" scoped>
.map-toggle {
    position: absolute;
    top: 228px;
    right: 26%;
    z-index: 9;
    width: 280px;
    height: 36px;

    .map-bg {
        position: absolute;
        width: 280px;
        height: 36px;
        border-top: 18px solid;
        border-right: 20px solid;
        border-bottom: 18px solid;
        border-left: 20px solid;
        border-image-source: url(@assets/images/map/menu.png);
        border-image-slice: 18 20 18 20 fill;
    }

    .toggle {
        position: absolute;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 0 10%;

        .item {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-family: TRENDS;
            font-size: 16px;
            line-height: 16px;
            cursor: pointer;
        }

        .active {
            /* stylelint-disable-next-line max-line-length */
            background: radial-gradient(49% 49% at 50% 0%, rgb(0, 126, 255, 0.7) 0%, rgb(0, 126, 255, 0.19) 47%, rgb(0, 126, 255, 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgb(0, 48, 97, 0) 100%), linear-gradient(90deg, rgb(0, 48, 97, 0) 0%, #003061 50%, rgb(0, 48, 97, 0) 99%);
        }
    }
}
</style>
