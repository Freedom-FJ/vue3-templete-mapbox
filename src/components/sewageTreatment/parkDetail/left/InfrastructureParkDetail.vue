<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 10:37:53
 * @Description:
-->
<template lang="pug">
commonPanel(title="基础设施" :height='288' panelBg='panel-big')
    template(#mainContent)
        .environmental-status
            .item-box.mgb10(v-for="(item, index) in list" :key="index")
                img.left-img( :src="getAssetsFile(`sewageTreatment/${item.img}.png`)")
                .right-text
                    .top-label.text-12.mgb8 {{item.name}}
                    .bottom-value
                        span.value.num-20.blue {{getNumber(item.value)}}
                        span.unit {{item.unit}}
</template>

<script lang="ts" setup name="environmental-status">
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '总投资', value: '1254', unit: '万元', img: 'toRiver' },
        { name: '入住企业', value: '2146', unit: '家', img: 'rainwaterPipe' },
        { name: '入河排污口数量', value: '2146', unit: '个', img: 'sewagePipe' },
        { name: '雨水管网长度', value: '2146', unit: '公里', img: 'waterSupply' },
        { name: '污水管网长度', value: '2146', unit: '公里', img: 'sewagePipe' },
        { name: '供水管网长度', value: '2146', unit: '公里', img: 'waterSupply' },
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
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 12px 0 0;

    .item-box {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 178px;
        height: 64px;
        background: rgb(0 47 93 / 30%);
        border: 1px solid #00366a;
        border-radius: 4px;

        .left-img {
            width: 73px;
            height: 56px;
        }

        .unit {
            margin-left: 4px;
            font-family: TRENDS;
            font-size: 12px;
            font-weight: normal;
            line-height: 12px;

            /* 白色 */
            color: rgb(255 255 255 / 70%);
            letter-spacing: 0;
        }
    }
}
</style>
