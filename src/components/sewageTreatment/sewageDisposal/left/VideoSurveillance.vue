<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-07 17:06:23
 * @Description:
-->
<template lang="pug">
commonPanel(title="视频监控" :height='256' panelBg='panel-big')
    template(#rightTitle)
            select-panel(:option="selectList" :isShowBack="true")
    template(#mainContent)
        .environmental-status
            el-scrollbar.rolling-list
                .row-box.flex-bw-c.flex-w
                    .row-item.mgb24(v-for="(item,index) in list" :key="index")
                        img.left-img(src="../../../../assets/images/sewageTreatment/sewageTreatmentPlant.png")
                        .right-text
                            .right-title.text-14.mgb8 {{item.name}}
                            .bottom-box
                                span.value-box.num-24.blue {{item.value}}
                                span.value-unit.unit-12 {{item.unit}}
</template>

<script lang="ts" setup name="VideoSurveillance">
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '污水厂', value: '1254', unit: '个' },
        { name: '规模', value: '1254', unit: '吨' },
        { name: '处理量', value: '1254', unit: '吨' },
        { name: '产生量', value: '1254', unit: '吨' },
        { name: '负荷率', value: '1254', unit: '吨' },
    ],
    selectList: [
        { label: '视频监控头1', value: '1' },
        { label: '视频监控头2', value: '2' },
        { label: '视频监控头3', value: '3' },
        { label: '视频监控头4', value: '4' },
        { label: '视频监控头5', value: '5' },
    ]
})
onMounted(() => {
    //
})
const { list, selectList } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 24px 10px 0;
    width: 100%;
    height: 100%;
    .rolling-list {
        height: 170px;
        width: 100%;
    }
                .row-box {

                    .row-item {
                        display: flex;
                        width: 164px;
                        .left-img {
                            flex: none;
                            width: 48px;
                            height: 48px;
                            margin-right: 12px;
                        }
                        .right-text {
                            flex: none;
                                .value-unit {
                                    margin-left: 2px;
                                }
                        }
                    }
                }
}
</style>
