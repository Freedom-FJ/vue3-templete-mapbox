<template lang="pug">
popup-panel(  :height='408' :width="736" :titleHeight="32" :isMapPop="true" )
    template(#title)
        .title-box.flex
            .title-box-text.text-16 {{properties.name}}
            .analysis-btn.text-14(@click="goToSiteDetail") 进入详情
            .sewage-btn-box
                .now-btn(v-for="item in outletList" :key="item.id" :class="[outletValue === item.id ? 'isCheck' : '']" @click="checkOutlet(item.id)") {{item.portName}}
    .main-content
        .common-pop-basic-info
            .info-item-box
                .info-item.flex-g
                    .item-name 行业类别：
                    .item-value {{detail.industryCategoryStr || '--'}}
                .info-item.flex-g
                    .item-name 所属区域：
                    .item-value {{detail.regionText || '--'}}
            .info-item-box
                .info-item.flex-g
                    .item-name 企业地址：
                    .item-value {{detail.address || '--'}}
        .camera-list
            .camera-item(v-for="(item) in siteCameraList")
                img(src="@/assets/images/common/camera.png")
                div {{item.cameraName}}
            .camera-item(v-if="!siteCameraList.length" style="cursor:default")
                div(style="color:gray") 未关联视频点位
        .bottom-flex.flex-bw-c.mgr16
            .common-bottom-content
                .title-header-str.text-14.mgb16 {{ timeStr }}
                popup-table(:option="colunms" ref="popupTableDom"  :data="tableData" :height="160" :lineStyle="{ height: '32px'}"  :heightLineStyle="{ height: '28px'}" )
            .common-chart-size-box
                SwageChart(
                   :factorList="factorList"
                   :properties="properties"
                   :outletValue="outletValue"
                )
</template>

<script lang="ts" setup name="PomsStationDetail">
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import { useAnalysisStore } from '@/store/analysis'
import { getFactorListByStationCode, wgmsFullStationTableData, wgmsGetWaterAllFactorList } from '@/utils/commonMethods/factor'
import type { factorGroupTs, popTableOptionTs } from '@/types/common'
import type { returnDataTs } from '@/utils/map/mapPoint'
import service from '@/service/api'
import { detailTimeRange } from '@/utils/tools'
import type { outletDataTs, outletTs, sewageDetailApiReturnTs } from '@/components/map/commonMapPop/types'
import treeUtil from '@/utils/treeDataUtils'
interface siteCameraListTs {
        cameraName: string
        deviceId: string
        channelId: string
        skip: string
    }
const props = defineProps({
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    }
})
const analysisStore = useAnalysisStore()
const data = reactive({
    siteCameraList: [] as siteCameraListTs[], // 当前站点的摄像头列表
    tableData: [] as any[],
    timeStr: '', // 数据的时间点
    colunms: [] as popTableOptionTs[],
    outletValue: '', // 排口值
    detail: {} as sewageDetailApiReturnTs,
    outletList: [] as outletTs[], // 排口
    outletDataList: [] as outletDataTs[],
    factorList: [] as factorGroupTs['factors'],
    factorGroupId: '',
})
onMounted(() => {
    const colunms = [
        {
            key: 'name',
            label: '监测项目',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                marginLeft: '2px',
                textAlign: 'left',
                fontFamily: 'TRENDS'
            },
            headerStyle: {
                marginLeft: '2px',
                textAlign: 'left',
            }
        },
        {
            key: 'value',
            label: '数据',
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'TRENDS'
            },
            renderStyle: (item: record) => {
                let color = 'white'
                if (item.overProofFlag === '是') color = '#F84439'
                return {
                    color
                }
            }
        },
        {
            key: 'unit',
            label: '单位',
        },
        {
            key: 'limit',
            label: '标准限值',
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'TRENDS'
            },
            render: (item: record, optionItem: Partial<popTableOptionTs>) => {
                return item[optionItem.key || ''] || '--'
            }
        },
        {
            key: 'overProofFlag',
            label: '是否超标',
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'TRENDS'
            }
        }
    ]
    data.colunms = colunms
    getDetailData()
    getCurSiteCameraList()
})
/**
 * @name: 获取污染源点位详情接口
 */
const getDetailData = async () => {
    const typeCode = props.properties.typeCode
    if (!typeCode) return
    const factorList = await getFactorListByStationCode(typeCode)
    data.factorGroupId = factorList?.id ?? ''
    data.factorList = (factorList?.factors || []).map((item) => {
        return {
            ...item,
            value: item.factorIndexCode,
            id: item.id,
            label: item.factorIndexName
        }
    })
    const res = props.properties.isAnalysis ? await detailAnalysiPoint() : await detailCommonPoint()
    const reginData = await treeUtil.getAreaCodeObj(props.properties.regionId)
    if (reginData)
        res.regionText = reginData.label || '--'
    const industry = res.industryCategory ? await treeUtil.wgmsGetIndustryCategoryTreeData(res.industryCategory) : '' // 行业类别
    res.industryCategoryStr = industry ? industry.label : '--'
    data.detail = res
    data.outletList = res.outlets
    data.outletValue = data.outletList.length ? data.outletList[0].id : ''
    data.outletDataList = res.datas || []
    detailFactor()
}
/**
 * @name: 处理研判分析时 报警时间数据
 */
const detailAnalysiPoint = async () => {
    const {
        beginTime,
        endTime,
        dataTimeType,
        queryTimeType
    } = detailTimeRange(props.properties.queryTimeType || analysisStore.analysis.data.timeType, props.properties.time ? dayjs(props.properties.time).valueOf() : analysisStore.analysis.data.dataTime)
    const params = {
        factorGroupId: data.factorGroupId,
        stationCode: props.properties.typeCode,
        backtracking: false,
        id: props.properties.id,
        queryTimeType,
        beginTime,
        endTime,
        dataTimeType
    }
    const res = await service<sewageDetailApiReturnTs, true>('publicMap/concentration2', params)
    return res
}
/**
 * @name: 处理普通时间的数据
 */
const detailCommonPoint = async () => {
    const typeCode = props.properties.typeCode
    const params = {
        factorGroupId: data.factorGroupId,
        stationId: props.properties.id,
        stationCode: typeCode,
    }
    const res = await service<sewageDetailApiReturnTs, true>('publicMap/queryStationRealData2', params)
    return res
}
/**
 * @name: 处理表格数据
 */
const detailFactor = async () => {
    const allFactorsMap: any = {}
    const allFactorListRes: any = await wgmsGetWaterAllFactorList()
    const allFactorList: any[] = []
    allFactorListRes.forEach((element: any) => {
        allFactorList.push(element)
    })
    allFactorList.forEach((item: { factorIndexCode: string }) => {
        allFactorsMap[item.factorIndexCode] = item
    })
    const currOutLet = data.outletDataList.find(item => item.mn === data.outletValue)
    data.timeStr = currOutLet?.time || props.properties.time || '--'
    if (props.properties.isAnalysis)
        data.timeStr = analysisStore.analysis.data.dataTimeStr || ''

    const pollutions = await wgmsFullStationTableData(data.factorList, currOutLet?.factors ?? [])
    // 接口有问题 会传回因子 code null 暂时不用
    // const limitRes = await service<pomsAlarmLimitApiTs[]>('publicMap/pomsAlarmLimit', { siteCode: data.outletValue })
    // const factorLimitData = limitRes.data || []
    const currTableData = await Promise.all((pollutions || []).map(async (item: {
        code: string
        overProof: null | boolean
        standard: null | { pollutantLimit: string }
        value: null | number | string
        name: string
        unit: string
        limit: string
        overProofFlag: string
    }) => {
        // const limitData = factorLimitData.find(filItem => filItem.code === item.code)
        item.value = typeof item.value === 'number' ? item.value : '--'
        item.name = allFactorsMap[item.code]?.factorIndexName
        item.unit = allFactorsMap[item.code]?.unitName
        item.limit = item.standard ? item.standard.pollutantLimit : '--'
        item.overProofFlag = typeof item.overProof === 'boolean' ? item.overProof ? '是' : '否' : '--'
        return item
    }))
    data.tableData = currTableData || []
}

/**
 * @name: 点击切换排口
 * @param {*} id 点击的排口id
 * @return {*}
 */
const checkOutlet = (id: string) => {
    data.outletValue = id
    detailFactor()
}

/**
 * 获取视频列表
 */
const getCurSiteCameraList = () => {
    const unionId = props.properties.id
    if (!unionId) return
    service<siteCameraListTs[]>('common/cameraList', { cameraType: '015,07', unionId }).then((resp) => {
        if (resp.data && resp.data.length > 0) {
            data.siteCameraList = resp.data
        }
        else {
            data.siteCameraList = resp.data || []
            console.log(`暂无视频点位：unionId=${unionId}`)
        }
    })
}

/**
 * @name: 跳转一张图站点详情
 */
const goToSiteDetail = () => {
    const { enterpriseType, typeCode, id, dischargeDirection } = props.properties
    const dischargeDirectionArr = dischargeDirection ? JSON.parse(dischargeDirection as string) : ''
    window.open(`http://yhwszz.fpi-inc.site/wgms-wall-map-web/#/SiteDetail/General/${enterpriseType === '108' ? enterpriseType : dischargeDirectionArr.includes('B') ? '8' : typeCode}/${id}?treeId=3301&treeType=1&factorGroup=${data.factorGroupId}`, '')
}
const {
    detail,
    siteCameraList,
    colunms,
    timeStr,
    factorList,
    outletList,
    outletValue,
    tableData
} = toRefs(data)
</script>

<style scoped lang="scss">
.main-content {
    width: 736px;
    height: 408px;
    padding: 16px;
}

.flex-g {
    display: flex;
    align-items: center;
}

.row {
    & > div {
        width: 55%;
        margin-top: 0 !important;
    }
}

.status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 16px;
    font-family: TRENDS;
    font-size: 12px;
    font-weight: normal;
    line-height: 12px;
    color: #fff;
    letter-spacing: 0;
    border-radius: 10px;
}

.common-pop-container {
    position: relative;
    width: 884px;
}

.common-pop-title {
    display: flex;
    margin-bottom: 24px;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    font-weight: 700;
    color: #fff;
}

.close-icon {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 18px;
    cursor: pointer;
}

.info-item-box {
    display: flex;
    margin-bottom: 17px;

    & > div {
        flex: 1;
    }
}

.common-pop-basic-info {
    margin: 0 12px 16px;
}

.row > div {
    width: 180px;
}

.info-item {
    .item-name {
        font-family: TRENDS;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;

        /* 白色 */
        color: #fff;
        letter-spacing: 0;
        white-space: nowrap;
    }

    .item-value {
        font-family: TRENDS;
        font-size: 12px;
        font-weight: normal;
        line-height: 12px;
        color: #fff;
        letter-spacing: 0;
    }
}

.analysis-btn {
    position: absolute;
    top: 2px;
    right: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    cursor: pointer;
    background: #023057;
    border: 1px solid #286c9d;
    border-radius: 4px;
}

.common-pop-basic-info {
    background: transparent;
}

.camera-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 12px 14px;
    color: #00c365;
    white-space: nowrap;

    .camera-item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 32px 2px 0;
        font-family: TRENDS;
        font-size: 14px;
        font-weight: 10;
        font-weight: normal;
        line-height: 14px;
        color: #0df;
        letter-spacing: 0;
        cursor: pointer;

        img {
            width: 12.5px;
            height: 15px;
            margin-right: 8px;
        }
    }
}

.common-bottom-content {
    box-sizing: border-box;
    width: 376px;
    height: 242px;
    padding: 12px 12px 0;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
}

.sewage-btn-box {
    display: flex;
    margin-left: 20px;
    transform: translateY(-5px);

    & > div {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1px 10px;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .now-btn {
        margin-right: 4px;
    }

    .isCheck {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.drink-box {
    width: 688px !important;
    height: 242px !important;
}

.common-chart-size-box {
    width: 296px;
    height: 242px;
}

.title-box {
    // align-items: center;
    // transform: translateY(-10px);
}
</style>

