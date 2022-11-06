<!--
 * @Author: mjh
 * @Date: 2022-10-13 09:55:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 10:45:00
 * @Description:
-->
<template lang="pug">
commonPanel(title="清水亲码" :height='240')
    template(#mainContent)
        .warn-content.flex-bw-c
            .left-chart(ref="chartDom")
            .right-box
                .title.text-14 活动晾晒
                img(src="@/assets/images/sewageTreatment/qinshui.png")
</template>

<script lang="ts" setup name="torrent-warning">
import { getQinShuiOption } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    isHandle: true,
    list: [
        { name: '处置中', value: 10, rate: '51%' },
        { name: '已处置', value: 5, rate: '37%' },
    ],
    chartDom: ref()
})
onMounted(() => {
    getChartData()
})
const getChartData = () => {
    const count = data.list.reduce((pre, curr) => {
        return pre + curr.value
    }, 0)
    const charChance = global?.echarts.init(data.chartDom)
    charChance.setOption(getQinShuiOption(data.list, count, '问题处置情况'))
}
const { list, chartDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    width: 100%;
    height: 100%;
    padding: 16px 0;

    .left-chart {
        width: 144px;
        height: 158px;
    }

    .right-box {
        .title {
            width: fit-content;
            margin: 0 auto 12px;
        }

        img {
            width: 200px;
            height: 128px;
            border: 2px solid #005e71;
            border-radius: 4px;
        }
    }
}
</style>
