<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-07 16:12:53
 * @Description:
-->
<template lang="pug">
commonPanel(title="基础设施" :height='272' panelBg='panel-big')
    template(#mainContent)
        .environmental-status
            .item-box.mgb16(v-for="(item, index) in list" :key="index")
                img.left-img( :src="getAssetsFile(`sewageTreatment/${item.img}.png`)")
                .right-text
                    .top-label.text-14.mgb8 {{item.name}}
                    .bottom-value
                        span.value.num-24.blue {{getNumber(item.value)}}
                        span.unit {{item.unit}}
</template>

<script lang="ts" setup name="environmental-status">
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '入河排污口', value: '1254', unit: '个', img: 'toRiver' },
        { name: '雨水管网', value: '2146', unit: '公里', img: 'rainwaterPipe' },
        { name: '污水管网', value: '2146', unit: '公里', img: 'sewagePipe' },
        { name: '供水管网', value: '2146', unit: '公里', img: 'waterSupply' },
    ],
})
onMounted(() => {
    //
})
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 10px 0;
    width: 100%;
    height: 100%;
    .item-box {
        width: 166px;
        height: 80px;
        display: flex;
        align-items: center;
        padding: 8px 0px;
        border-radius: 4px;
        background: rgba(0, 47, 93, 0.3);
        box-sizing: border-box;
        border: 1px solid #00366A;
        .left-img {
            width: 73px;
            height: 56px;
        }

        .unit {
            font-family: TRENDS;
            font-size: 12px;
            font-weight: normal;
            line-height: 12px;
            letter-spacing: 0em;
            margin-left: 4px;

            /* 白色 */
            color: rgba(255,255,255,.7);

        }
    }
}
</style>
