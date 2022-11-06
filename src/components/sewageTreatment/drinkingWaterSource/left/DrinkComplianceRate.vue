<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:23:34
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 11:23:52
 * @Description:
-->
<template lang="pug">
commonPanel(title="饮用水源地达标率" :subTitle='subTitle' panelBg='panel-big' :height='644' :bigBgTop="14" :style="{marginBottom: pxToRem(16)}")
    template(#mainContent)
        .list-content
            .list-one(v-for='item in dataList')
                .text {{item.name}}
                .list-box
                    .list-item
                        img(src='@/assets/images/sewageTreatment/drink-1.png')
                        .total-text 水源地总数
                        .total-num
                            span {{item.drinkTotal}}
                            span.unit 个
                    .list-item
                        img(src='@/assets/images/sewageTreatment/drink-2.png')
                        .total-text 监测点总数
                        .total-num
                            span {{item.siteTotal}}
                            span.unit 个
                    .list-item
                        img(src='@/assets/images/sewageTreatment/drink-3.png')
                        .total-text 达标率
                        .total-num
                            span {{item.rich || '--'}}
                            span.unit(v-show="item.rich") %
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getFactorListByStationCode } from '@/utils/commonMethods/factor'
import { pxToRem } from '@/utils/tools'
import { globalKey } from '@/symbols'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import service from '@/service/api'
import type { reachRateScaleApiTS } from '@/components/sewageTreatment/drinkingWaterSource/types'
const global = inject(globalKey)
const data = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`,
    dataList: [
        {
            name: '县级以上',
            siteTotal: 104,
            drinkTotal: 90,
            rich: ''
        },
        {
            name: '农村饮用水',
            siteTotal: 104,
            drinkTotal: 90,
            rich: ''
        },
        {
            name: '千吨万人及其他乡镇级',
            siteTotal: 104,
            drinkTotal: 90,
            rich: ''
        },
    ] as {
        name: string
            siteTotal: number
            drinkTotal: number
            rich: string | null
    }[]
})

const getData = async () => {
    const treeData = await getSetTreeCode()
    const factor = await getFactorListByStationCode('40')
    const params = {
        treeType: '1',
        treeId: treeData.slice(0, 6),
        queryTimeType: 'year',
        beginTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().endOf('year').valueOf(),
        factorFlag: true,
        factor: factor?.id ?? '',
    }
    const res = await service<reachRateScaleApiTS>('drinkingWaterSource/reachRateScale', params)
    const resData = res.data
    if (!resData || !(resData && resData.drinkSourceTypeStatVoList)) return
    resData.drinkSourceTypeStatVoList.forEach((item, index) => {
        data.dataList[index].siteTotal = item.siteNum
        data.dataList[index].drinkTotal = item.totalNum
        data.dataList[index].rich = item.siteReachRate
    })
}

getData()
const { subTitle, dataList } = toRefs(data)
</script>

<style lang="scss" scoped>
.list-content {
    padding: 0 10px;

    .list-one {
        .text {
            margin-top: 16px;
            margin-bottom: 16px;
            font-family: TRENDS;
            font-size: 16px;
        }

        .list-box {
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 135px;
            padding: 16px 20px;
            text-align: center;
            background: rgba(0, 47, 93, 0.3);
            border: 1px solid #00366a;
            border-radius: 4px;

            .list-item {
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    width: 87px;
                    height: 60px;
                }

                .total-text {
                    margin-bottom: 4px;
                    font-family: TRENDS;
                    font-size: 12px;
                }

                .total-num {
                    span:nth-child(1) {
                        font-family: Furore;
                        font-size: 24px;
                        color: rgba(255, 255, 255, 0.87);
                        text-shadow: 0 1px 17px 0 rgba(27, 126, 242, 0.44);
                    }

                    span:nth-child(2) {
                        margin-left: 4px;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
</style>
