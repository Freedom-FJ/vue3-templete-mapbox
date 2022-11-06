<!--
 * @Author: Tian
 * @Date: 2022-09-23 08:48:41
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 11:24:11
 * @Description:
-->
<template>
    <div class="content-mains bf-blur">
        <div class="common-bg" />
        <div class="top-line flex-bw-c">
            <span class="text-16">碧水指数赋分详情</span>
            <div class="close " @click="emit('closePanel')" />
        </div>
        <div class="body-main">
            <div class="score-line pdt20 flex mgb20">
                <div v-for="(item, index) in countList" :key="index">
                    <span class="text-14">{{ item.name }}：</span>
                    <span class="num-14 mgr4" :style="{ color: item.value < 0 ? '#F84439' : '#36F097' }">{{ item.value }}</span>
                    <span class="unit-14 mgr16">分</span>
                </div>
            </div>
            <div class="select-line flex-c mgb20">
                <div class="index-select mgr8">
                    <SelectPanel :option="oneLevelSelectList" placeholder="请选择一级指标" :default-select="-1" is-show-back arrow="line" />
                </div>
                <div class="index-select mgr8">
                    <SelectPanel :option="twoLevelSelectList" placeholder="请选择二级指标" :default-select="-1" is-show-back arrow="line" />
                </div>
                <div class="index-select mgr8">
                    <SelectPanel :option="isDeductPointsSelectList" placeholder="是否扣分" :default-select="-1" is-show-back arrow="line" />
                </div>
                <div class="index-select mgr8">
                    <SelectPanel :option="seasonSelectList" placeholder="请选择赋分原因" :default-select="-1" is-show-back arrow="line" />
                </div>
                <div class="reset-btn text-12 cur">
                    重置
                </div>
            </div>
            <div class="table-box mgb16">
                <PopupTable :option="colunms" :data="tableData" :height="400" :line-style="{ height: '42px' }" :header-line-style="{ height: '40px' }" :header-cell-style="{ color: 'rgba(255, 255, 255, 1)' }" :line-cell-style="{ fontSize: '12px' }">
                    <template #point="{ row }">
                        <div>
                            <span class="num-12" :style="{ color: row.pointType === '扣分' ? '#F84439' : '' }">{{ row.point }}</span>
                            <span class="num-12">/{{ row.total }}</span>
                        </div>
                    </template>
                </PopupTable>
            </div>
            <div class="flex-end">
                <el-pagination v-model:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" background :total="pageTotal" :page-sizes="[10, 20, 30, 40]" @size-change="handleSizeChange" @current-change="currentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="FiveResultDialog">
import { globalKey } from '@/symbols'
import type { popTableOptionTs } from '@/types/common'
const emit = defineEmits(['closePanel'])
const global = inject(globalKey)
const data = reactive({
    pageTotal: 20,
    currPage: 1,
    pageSize: 10,
    countList: [
        { name: '余杭区', value: 89 },
        { name: '水环境质量', value: -4 },
        { name: '污染减排', value: -2 },
        { name: '河长履职', value: -3 },
        { name: '水生态', value: -0 },
        { name: '数字化水平', value: -1 },
        { name: '人水和谐', value: -1 },
    ],
    oneLevelSelectList: [
        { label: '请选择一级指标', value: '0' }
    ],
    twoLevelSelectList: [
        { label: '请选择二级指标', value: '0' }
    ],
    isDeductPointsSelectList: [
        { label: '是否扣分', value: '0' }
    ],
    seasonSelectList: [
        { label: '请选择赋分原因', value: '0' }
    ],
    colunms: [
        {
            key: 'index',
            label: '序号',
            flex: 0.3,
        },
        {
            key: 'oneLevel',
            label: '一级指标',
            flex: 1,
        },
        {
            key: 'twoLevel',
            label: '二级指标',
            flex: 1.5,
            rowStyle: {
                textAlign: 'left'
            }
        },
        {
            key: 'point',
            label: '得分',
            flex: 0.6,
        },
        {
            key: 'pointType',
            label: '得分情况',
            flex: 0.6,
            renderStyle: (val: record, option: popTableOptionTs) => {
                const value = val[option.key || '']
                if (value === '扣分') return { color: '#F84439' }
            }
        },
        {
            key: 'reason',
            label: '赋分原因',
            flex: 3.5,
            rowStyle: {
                textAlign: 'left'
            }
        },
        {
            key: 'pointLevel',
            label: '赋分类型',
            flex: 0.7,
        },
        {
            key: 'time',
            label: '更新时间',
            flex: 1,
        }
    ] as popTableOptionTs[],
    tableData: [
        { oneLevel: '水环境质量', twoLevel: '考核断面水质达标率', index: '1', total: 7.5, point: '6', reason: '考核断面水质达标率为97.4%，暂未达到考核目标', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '扣分' },
        { oneLevel: '水环境质量', twoLevel: '集中式饮用水水源地水质达标率', index: '2', total: 5, point: '5', reason: '集中式饮用水水源地水质达标率达到100%', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '湖库富营养化指数', index: '3', total: 2.5, point: '2.5', reason: '湖库富营养化指数达到考核目标', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '水环境承载力', index: '4', total: 2, point: '1', reason: '水环境承载力81.3%，临界超载', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '扣分' },
        { oneLevel: '水环境质量', twoLevel: '水质预警', index: '5', total: 2, point: '0', reason: '奉口国控站点发生橙色预警9次，义桥省控站点发生橙色预警9次，北苕溪（落塘埠下）市控站点发生橙色预警1次', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '扣分' },
        { oneLevel: '水环境质量', twoLevel: '水质预警响应', index: '6', total: 3, point: '3', reason: '预警发生后在规定时间内解决问题', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '突发环境问题', index: '7', total: 5, point: '5', reason: '无突发环境事件', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '河湖管护', index: '8', total: 5, point: '5', reason: '河湖管护落实达到浙江省地方标准《河（湖）长制工作规范》（DB33/T 2361—2021）要求', time: '2022.06.09 09:09', pointLevel: '人工赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '美丽河湖创建', index: '9', total: 5, point: '5', reason: '新建美丽河湖数量达到目标标准', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
        { oneLevel: '水环境质量', twoLevel: '河湖巡查问题发现', index: '10', total: 5, point: '4', reason: '余杭塘河（余杭段）出现少量垃圾漂浮物暂未处理', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '扣分' },
        // { oneLevel: '水环境质量', twoLevel: '湖库富营养化指数', index: '11', total: 2.5, point: '2.5', reason: '湖库富营养化指数达到考核目标', time: '2022.06.09 09:09', pointLevel: '自动赋分', pointType: '满分' },
    ],
})
onMounted(() => {
//
})
const handleSizeChange = (val: number) => {
    data.pageSize = val
}
/**
 * @name: 页码切换
 */
const currentChange = (page: number) => {
    data.currPage = page
}
const {
    countList,
    oneLevelSelectList,
    colunms,
    pageTotal,
    tableData,
    twoLevelSelectList,
    isDeductPointsSelectList,
    seasonSelectList,
    pageSize
} = toRefs(data)
</script>

<style lang="scss" scoped>
.content-mains {
    position: relative;
    width: 1296px;
    height: 648px;
    margin: 0 auto;

    .common-bg {
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-2.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .top-line {
        height: 42px;
        padding: 0 12px;
        margin: 0 8px;
        border-bottom: 1px solid rgba(7, 131, 250, 0.5);
    }

    .body-main {
        margin: 0 32px;
    }

    .select-line {
        .index-select {
            width: 144px;
            height: 28px;
        }
    }

    .reset-btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 84px;
        height: 28px;
        padding: 8px 12px;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
        opacity: 1;
    }
}

::v-deep() .el-pagination {
    .el-pagination__total {
        font-family: TRENDS;
        font-size: 12px;
        color: white;
    }

    .el-input__wrapper {
        background-color: #023057;
        border: 1px solid #286c9d;
        box-shadow: none !important;
    }

    .el-input__inner {
        height: 20px;
        font-family: TRENDS;
        font-size: 12px;
        color: white;
    }

    .btn-prev:disabled,
    .btn-next:disabled {
        box-sizing: border-box;
        width: 24px;
        min-width: 24px;
        height: 24px;
        background: #023057;
        border: 1px solid #286c9d;
    }

    .btn-prev,
    .btn-next {
        box-sizing: border-box;
        width: 24px;
        min-width: 24px;
        height: 24px;
        background: #023057;
        border: 1px solid #286c9d;

        .el-icon {
            color: white;
        }
    }

    .el-pagination__jump {
        font-family: TRENDS;
        font-size: 12px;
        color: white;
    }

    .el-pagination__editor {
        width: 52px;
        height: 24px;
    }
}

::v-deep() .el-pager {
    li {
        box-sizing: border-box;
        min-width: 24px;
        height: 24px;
        color: white;
        background: #023057 !important;
        border: 1px solid #286c9d !important;
    }

    .is-active {
        box-sizing: border-box;
        min-width: 24px;
        height: 24px;
        color: white;
        background: #008dce !important;
        border: 1px solid #00e5ff !important;
    }
}
</style>
