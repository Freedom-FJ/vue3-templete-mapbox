<!--
 * @Author: mjh
 * @Date: 2022-10-09 14:05:44
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-16 15:22:26
 * @Description:
-->
<template lang="pug">
commonPanel(title="河湖库保护"  panelBg='panel-big' :height='608' :bigBgTop="14")
    template(#mainContent)
        .main-box.pdt12.w-95.mg-a
            .top-title-line.flex-bw-c.mgb12
                .left-title.text-16 河湖情况
                .right-unit.unit-14 数量（个）/水域面积（km²）
            .count-box-father.flex-w.w-100.flex-bw-c
                .count-box-item.mgb12(v-for="(item, index) in countList" :key="index")
                    .titles.mgb8.text-14 {{item.name}}
                    .value-line
                        span.number-box.blue-0 {{item.value}}
                        span.number-box /{{item.total}}
            .top-equipment-line.flex-bw-c.mgb12
                .left-title.text-16 监测设施
                .right-box.flex
                    .box-ball.mgr8
                    .right-label.unit-14.mgr8 在线
                    .box-ball.mgr8.bgc-6
                    .right-label.unit-14 离线
            .site-type-box.flex-w.w-100.flex-bw-c
                .site-type-item.mgb12(v-for="(item, index) in siteTypeList" :key="index")
                    span.text-14 {{item.name}}
                    .value-box
                        span.green-3.num-18.mgr4 {{item.value}}
                        span.unit-18 /{{item.total}}
            .top-title.flex-bw-c.mgb12
                span.text-16 河道水质排名
                .right-btn.flex
                    .global-btn-common.mgr4(:class="[currType ? 'global-btn-check' : '']" @click="checkBtnType(true)") 按水质点位超标次数
                    .global-btn-common(:class="[!currType ? 'global-btn-check' : '']" @click="checkBtnType(false)") 按年度I～III类比例
            el-scrollbar.bottom-box
                .btm-item.flex.mgb8(v-for="(item, index) in showTypeRivet.list" :key="index")
                    .title.text-14.mgr9 {{item.name}}
                    .right-bar.flex
                        .bar-line.mgr4(:style="{width: Math.round(item.over/showTypeRivet.max*100) + '%'}")
                        .bar-value.num-14 {{item.over}}
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { configsApiTs, year1To3ApiTs } from '../types'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { globalKey } from '@/symbols'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import service from '@/service/api'
const global = inject(globalKey)
const data = reactive({
    list: [
        { name: '北塘', value: 94 },
        { name: '山塘', value: 90 },
        { name: '前膛', value: 84 },
        { name: '径山', value: 82 },
        { name: '仁和', value: 76 },
    ],
    currType: true,
    countList: [
        { name: '河道', value: '560', total: '27.66' },
        { name: '湖泊', value: '2', total: '24.00' },
        { name: '水库', value: '27', total: '354' },
        { name: '山塘', value: '155', total: '14.67' },
        { name: '蓄滞洪区', value: '75', total: '7.45' },
        { name: '其他', value: '125', total: '7.40' },
    ],
    siteTypeList: [
        { name: '水质站点', value: '25', total: '14' },
        { name: '水文站', value: '25', total: '14' },
        { name: '雨情站', value: '25', total: '14' },
        { name: '视频监控', value: '45', total: '77' },
    ],
    riverBaseWaterQualityList: {
        max: 0,
        list: [] as { name: string; over: number }[]
    },
    year1to3: {
        max: 0,
        list: [] as { name: string; over: number }[]
    }
})

onMounted(() => {
    getRiverWaterQuality()
    getSiteCount()
})

const showTypeRivet = computed(() => {
    if (data.currType) return data.riverBaseWaterQualityList
    else return data.year1to3
})
/**
 * 获取在线、断线数量
 */
const getSiteCount = async () => {
    const { data: dataList } = await service<{ data: Record<string, any>[] }, true>('riverLakeIntelligence/siteCount')
    data.siteTypeList[0].value = dataList[0].onlineCount
    data.siteTypeList[0].total = dataList[0].totalCount
    data.siteTypeList[1].value = dataList[2].children[0].onlineCount
    data.siteTypeList[1].total = dataList[2].children[0].totalCount
    data.siteTypeList[2].value = dataList[2].children[1].onlineCount
    data.siteTypeList[2].total = dataList[2].children[1].totalCount
}
/**
 * @name: 获取按水质点位超标次数
 */
const getRiverWaterQuality = async () => {
    if (data.riverBaseWaterQualityList.list.length) return
    const res = await service<configsApiTs, true>('riverLakeIntelligence/configs')
    data.riverBaseWaterQualityList.list = res.area_over_stat
    data.riverBaseWaterQualityList.max = Math.max(...res.area_over_stat.map(item => item.over))
}

/**
 * @name: 获取按年度I～III类比例
 */
const getRiverYear1to3 = async () => {
    if (data.year1to3.list.length) return
    const factorObj = await getFactorGroupList('surfaceSection')
    const treeData = await getSetTreeCode()
    const params = {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        queryTimeType: 'year',
        beginTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        factorFlag: true,
        factor: factorObj?.id ?? '',
        controlLevel: '004',
    }
    const res = await service<year1To3ApiTs[]>('riverLakeIntelligence/mainArea', params)
    const resData = res.data || []
    data.year1to3.list = resData.map((item) => {
        return {
            name: item.name,
            over: item.rate
        }
    })
    data.year1to3.max = Math.max(...data.year1to3.list.map(item => item.over))
}
/**
 * @name: 河道水质排名 type切换
 * @param {*} type
 */
const checkBtnType = (type: boolean) => {
    if (data.currType === type) return
    data.currType = type
    if (type) getRiverWaterQuality()
    else getRiverYear1to3()
}

const { list, countList, siteTypeList, currType, riverBaseWaterQualityList, year1to3 } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-bar {
    align-items: center;
    width: 307px;
    height: 16px;
    background: rgba(192, 196, 204, 0.1);

    .bar-line {
        width: 216px;
        height: 6px;
        background: linear-gradient(270deg, #f20 0%, #d2684b 100%);
    }
}

.bottom-box {
    height: 190px;
}

.count-box-item {
    box-sizing: border-box;
    width: 106.67px;
    height: 58px;
    padding: 8px 16px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;
}

.number-box {
    font-family: Oswald-Regular;
    font-size: 18px;
    font-weight: normal;
    line-height: 28px;
    text-align: right;
}

.title {
    width: 80px;
}

.box-ball {
    width: 12px;
    height: 12px;
    background: #36f097;
    border-radius: 50%;
}

.site-type-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 166px;
    height: 34px;
    padding: 8px 16px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;
}
</style>

