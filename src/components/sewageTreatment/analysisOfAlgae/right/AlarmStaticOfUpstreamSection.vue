<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-15 12:23:28
 * @Description:
-->
<template lang="pug">
commonPanel(title="上游断面最近报警统计" panelBg='panel-1' :height='192')
    template(#mainContent)
        .alarm-stat
            .header
                .header-title
                    span 氮
                    span 磷
                .alarm-text 报警数
            .list
                .item(v-for='item, index in list')
                    .index {{item.rank || '--'}}
                    .name(:title='item.siteName') {{item.siteName}}
                    .bar
                        .pos(:style="{width: item.nh3OverNum / item.totalOverNum * 100 + '%'}")
                    .count {{item.totalOverNum}}
</template>

<script setup lang="ts">
import type { ProcessWarningList } from '../type'
import { globalKey } from '@/symbols'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const global = inject(globalKey)
const analysisStore = useAnalysisStore()
const data = reactive({
    list: [] as Record<string, any>[]
})
/**
 * 获取接口数据
 */
const getAlarmData = async () => {
    const res = await service<ProcessWarningList, true>(analysisStore.getAnalysisData.data.isHandle ? 'drinkingWaterSource/upstreamOverStatHandle' : 'drinkingWaterSource/algaeCorrelationAnalysis', {
        startTime: analysisStore.analysis.dateTime[0],
        endTime: analysisStore.analysis.dateTime[1],
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        factorCode: analysisStore.getAnalysisData.data.factorCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : '',
    })
    // 取前三
    data.list = res.data.length > 3 ? res.data.slice(0, 3) : res.data
}
onMounted(() => {
    getAlarmData()
})
/**
 * 监听研判分析面板时间改变
 */
watch(() => analysisStore.analysis.dateTime, () => {
    getAlarmData()
}, { immediate: true })
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.alarm-stat {
    padding: 12px 5px 0;

    .header {
        display: flex;
        padding-left: 91px;
    }

    .header-title {
        display: flex;
        justify-content: space-between;
        width: 208px;
        margin-bottom: 8px;
        font-family: TRENDS;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
    }

    .alarm-text {
        width: 60px;
        font-family: TRENDS;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
    }

    .list {
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 14px;

            .index {
                flex-shrink: 0;
                width: 24px;
                font-family: Furore;
            }

            .name {
                flex-shrink: 0;
                width: 67px;
                font-family: TRENDS;

                @include text-overflow;
            }

            .count {
                flex: 1;
                font-family: Furore;
                font-size: 16px;
                color: #f54455;
                text-align: center;
            }

            .bar {
                position: relative;
                flex-shrink: 0;
                width: 208px;
                height: 12px;
                background: rgba(255, 255, 255, 0.2);

                .pos {
                    position: absolute;
                    height: 100%;
                    background: #00e87e;
                }
            }
        }

        .item:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
