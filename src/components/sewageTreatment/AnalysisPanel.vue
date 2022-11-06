<template lang="pug">
.pos
    .analysis.bf-blur
        .common-bg(:style="{height: distance==='auto' ? '360px' : '320px'}")
        .panel-content
            .panel-title
                .text 超标报警-研判分析
                img.close(src='@/assets/images/map/close.png' @click='goBack')
            .panel-list
                template(v-if="isAnalysis")
                    p 站点名称：{{info.data.siteName || '--'}}
                    p 报警时间：{{info.data.dataTimeStr || info.data.time || '--'}}
                    p 报警类型：{{info.data.alarmTypeName || '--'}}
                    p 因子名称：{{info.data.factorName || '--'}}
                template(v-if="!isAnalysis")
                    p 排口名称：{{info.data.siteName || '--'}}
                .analysis-time(style="width: 105%;")
                    .text 分析时间：
                    el-date-picker.dateSelect(
                        v-model="dateTime"
                        type="datetimerange"
                        :format="data.valueFormat"
                        :picker-options="{ firstDayOfWeek: 1 }"
                    )
                .analysis-time
                    .text 分析范围：
                    el-radio-group(v-model="distance")
                        el-radio(label='3') 3公里
                        el-radio(label='5') 5公里
                        el-radio(label='10') 10公里
                        el-radio(label='auto') 自定义
                div.input-box(v-show="distance==='auto'")
                    el-input(v-model.number="inputDistance" placeholder="请输入距离")
            .panel-btn
                .analysis-btn(@click="startAnalysis") 分析
                .analysis-btn.mgr8(@click='showDetailPop' v-if="route.path ==='/sewageTreatment/AnalysisWaterQuality'") 查看
                .end-btn(@click='goBack') 结束研判
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useAnalysisStore } from '@/store/analysis'
const emit = defineEmits(['showDetail'])
const analysisStore = useAnalysisStore()
const route = useRoute()
const timeTypeList = {
    hour: 'YYYY-MM-DD HH',
    day: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    week: 'YYYY-ww周'
}

const data = reactive({
    dateTime: [] as any,
    distance: '10',
    inputDistance: '',
    info: analysisStore.getAnalysisData || {},
    waterQualityPonts: {} as any,
    keySourcePoints: [] as any[],
    valueFormat: 'YYYY-MM-DD' as any,
    isAnalysis: true // 是否是研判分析   研判分析 分析溯源
})
if (route.path.includes('OutletAnalysis')) { // 分析溯源页面
    data.isAnalysis = false
}
else {
    analysisStore.resetInWaterQuality(10000)
    data.valueFormat = (timeTypeList as record)[analysisStore.analysis.data.timeType || ''] || 'YYYY-MM-DD'
}
onMounted(() => {
    data.info = data.isAnalysis ? analysisStore.getAnalysisData : analysisStore.traceability
    data.dateTime = data.info.dateTime
})

// 跟新研判
const startAnalysis = () => {
    if (data.isAnalysis) {
        analysisStore.startAnalysis({
            distance: data.distance === 'auto' ? Number(data.inputDistance) : Number(data.distance) * 1000,
            dateTime: data.dateTime.map((item: Date) => typeof item === 'number' ? item : dayjs(item).valueOf())
        })
    }
    else {
        analysisStore.startTraceability({
            distance: data.distance === 'auto' ? Number(data.inputDistance) : Number(data.distance) * 1000,
            dateTime: data.dateTime.map((item: Date) => typeof item === 'number' ? item : dayjs(item).valueOf())
        })
    }
}
// 显示研判查看详情
const showDetailPop = () => {
    emit('showDetail')
}
const goBack = () => {
    data.isAnalysis && analysisStore.endAnalysis()
    !data.isAnalysis && analysisStore.endTraceability()
}

const { dateTime, distance, info, inputDistance, isAnalysis, valueFormat } = toRefs(data)
</script>

<style lang="scss" scoped>
.pos {
    position: absolute;
    top: 160px;
    left: 454px;
    width: 288px;
    height: 320px;
}

:deep(.el-date-editor .el-range__icon) {
    display: none;
}

:deep(.el-date-editor .el-range__close-icon) {
    display: none;
}

:deep(.el-date-editor .el-range-input) {
    width: 45%;
    font-family: TRENDS;
    font-size: 12px;
    color: #fff;
}

:deep(.el-input__wrapper) {
    width: 190px;
    padding: 0;
    background-color: #002950;
    border: 1px solid #194269;
    box-shadow: none;
}

:deep(.el-date-editor .el-range-separator) {
    color: #60a2e1;
}

:deep(.el-radio-group) {
    width: 175px;
}

.input-box {
    margin-right: 10px;
    margin-left: 60px;

    ::v-deep() .el-input__inner {
        padding: 0 5px;
        color: white;
    }
}

.el-radio {
    height: 24px;
    margin-right: 4px;
    font-family: TRENDS;
    font-size: 14px;
    color: #fff;

    :deep(.el-radio__label) {
        padding-left: 4px;
    }

    :deep(.el-radio__input.is-checked+.el-radio__label) {
        color: #0df;
    }

    :deep(.el-radio__input.is-checked .el-radio__inner) {
        background: #0df;
        border-color: #0df;
    }
}

.analysis {
    position: absolute;
    z-index: 9;
    width: 288px;
    height: 310px;
    border-radius: 10px;

    .common-bg {
        position: absolute;
        width: 100%;
        height: 310px;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .panel-content {
        // padding: 8px 16px;
        position: absolute;
        width: 100%;

        .panel-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            padding: 0 20px;
            /* stylelint-disable-next-line color-function-notation */
            border-bottom: 1px solid rgb(7 131 250 / 0.5);

            .text {
                font-family: TRENDS;
                font-size: 16px;
            }

            .close {
                width: 16px;
                height: 16px;
            }
        }

        .panel-list {
            padding: 0 20px;
            padding-top: 12px;

            p {
                margin-bottom: 12px;
                font-family: TRENDS;
                font-size: 14px;
            }

            .analysis-time {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                .text {
                    font-family: TRENDS;
                    font-size: 14px;
                }

                .dateSelect {
                    width: 176px;
                }
            }
        }

        .panel-btn {
            display: flex;
            justify-content: center;
            margin-top: 14px;
            font-size: 12px;
            color: #fff;
            cursor: pointer;

            .analysis-btn {
                width: 64px;
                height: 28px;
                margin-right: 8px;
                line-height: 28px;
                text-align: center;
                background: #008dce;
                border: 1px solid #0df;
                border-radius: 4px;
            }

            .end-btn {
                width: 64px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: #f84439;
                border-radius: 4px;
            }
        }
    }
}
</style>
