<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:29
 * @Description:
-->
<template lang="pug">
commonPanel(title="预警统计" subTitle="（最新）" panelBg='panel-big' :height='208' :bigBgTop="14")
    template(#mainContent)
        .box.flex-bw-c.mg-a.w-90.pdt24
            .box-item(v-for="(item,index) in titleList" :key="item.label")
                img.mgb12(:src='getAssetsFile(`waterControlCab/flood-${index}.png`)')
                span.text-14.mgb10 {{item.label}}
                .value.num-18.red {{item.value}}
                .border
</template>

<script setup lang="ts">
import { getAssetsFile } from '@/utils/tools'
const data = reactive({
    activeIndex: 0,
    unit: '',
    titleList: [
        { label: '雨量超警', value: 10 },
        { label: '水位超保', value: 3 },
        { label: '水库超限', value: 2 },
    ]
})

const { titleList } = toRefs(data)
</script>

<style lang="scss" scoped>
.box-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 88px;
    height: 102px;
    padding: 10px 12px;
    background: linear-gradient(0deg, rgba(0, 166, 255, 0.7) 0%, rgba(0, 191, 255, 0.21) 39%, rgba(0, 229, 255, 0) 100%);
    border-top: 1px solid #00d4ff;
    border-bottom: 1px solid #00d4ff;

    img {
        width: 30px;
        height: 30px;
    }
}

.box-item::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 8px;
    content: "";
    background: linear-gradient(180deg, #00d4ff 0%, rgba(0, 0, 0, 0) 100%);
}

.box-item::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 8px;
    content: "";
    background: linear-gradient(180deg, #00d4ff 0%, rgba(0, 0, 0, 0) 100%);
}

.border::before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 8px;
    content: "";
    background: linear-gradient(0deg, #00d4ff 0%, rgba(0, 0, 0, 0) 100%);
}

.border::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 1px;
    height: 8px;
    content: "";
    background: linear-gradient(0deg, #00d4ff 0%, rgba(0, 0, 0, 0) 100%);
}
</style>

