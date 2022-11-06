<!--
 * @Author: mjh
 * @Date: 2022-09-12 20:49:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 14:16:05
 * @Description:
-->
<template lang="pug">
commonPanel(title="山洪预警" :height='136')
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .warn-content
            .warn-item(v-for='item in list' :key='item.name' :style='{border: `1px solid ${item.borderColor}`,background: item.bgColor}')
                .name {{item.name}}
                .value {{item.value}}
</template>

<script lang="ts" setup name="torrent-warning">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const warnData = reactive({
    toggleList: [
        { name: '实时', value: '' },
        { name: '历史', value: '' }
    ],
    activeIndex: 0,
    list: [
        { name: '红色预警', value: 34, borderColor: '#ED0000', bgColor: 'rgba(237, 0, 0, 0.2)' },
        { name: '橙色预警', value: 8, borderColor: '#FF8000', bgColor: 'rgba(255, 128, 0, 0.2)' },
        { name: '黄色预警', value: 6, borderColor: '#EDC500', bgColor: 'rgba(237, 225, 0, 0.2)' },
        { name: '一般预警', value: 22, borderColor: '#00C8FF', bgColor: 'rgba(0, 140, 255, 0.2)' }
    ]
})
const changeNav = (index: number) => {
    warnData.activeIndex = index
}
const { toggleList, activeIndex, list } = toRefs(warnData)
</script>

<style lang="scss" scoped>
.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        width: 40px;
        height: 24px;
        margin-left: 4px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        background: #001823;
        border: 1px solid #00547b;
        border-radius: 2px;
    }

    .active {
        color: #0df;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid #0df;
        box-shadow: inset 0 0 8px 0 rgba(0, 238, 255, 0.5);
    }
}

.warn-content {
    display: flex;
    justify-content: space-between;
    padding: 20px 8px 0;

    .warn-item {
        width: 76px;
        height: 56px;
        padding-top: 8px;
        text-align: center;
        border-radius: 4px;

        .name {
            margin-bottom: 7px;
            font-family: TRENDS;
            font-size: 12px;
        }

        .value {
            font-family: Furore;
            font-size: 18px;
        }
    }
}
</style>
