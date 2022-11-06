<template lang="pug">
popup-panel(  :height='408' :width="736" :titleHeight="32" :isMapPop="true" )
    template(#title)
        .title-box.flex
            .title-box.text-16 {{properties.name}}
            .analysis-btn.text-14(@click="goToSiteDetail") 进入详情
            .drink-btn-box
                .now-btn.text-14(:class="[!waterType ? 'isCheck' : '']" @click="drinkTypeChange(0)")   水情
                .past-30days-btn.text-14(:class="[waterType ? 'isCheck' : '']" @click="drinkTypeChange(1)")   水质
    .main-content
        .common-pop-basic-info
            .info-item-box
                .info-item.flex-g
                    .item-name 水质状况：
                    .item-value.status(:style="{background: detail.gradeColor}") {{detail.gradeText || '--'}}
                .info-item.flex-g
                    .item-name 流向：
                    .item-value.status(:style="{background: detail.targetLevelColor}") {{detail.targetLevelText || '--'}}
                .info-item.flex-g
                    .item-name 昨日配水量：
                    .item-value {{detail.regionText || '--'}}
            .info-item-box
                .info-item.flex-g
                    .item-name 所属区域：
                    .item-value {{detail.regionText || '--'}}
                .info-item.flex-g
                    .item-name 所属水系：
                    .item-value {{detail.watershedText || '--'}}
                .info-item.flex-g
        .camera-list
            .camera-item(v-for="(item,index) in siteCameraList")
                img(src="@/assets/images/common/camera.png")
                div {{item.cameraName}}
            .camera-item(v-if="!siteCameraList.length" style="cursor:default")
                div(style="color:gray") 未关联视频点位
        .bottom-flex.flex-bw-c.mgr16(v-if="['1', '58'].includes(properties.typeCode || '')")
            .common-bottom-content
                .title-header-str.text-14.mgb16 {{ timeStr }}
                popup-table(:option="colunms" ref="popupTableDom"  :data="detail.pollutants" :height="160" :lineStyle="{ height: '32px'}"  :heightLineStyle="{ height: '28px'}" )
            .common-chart-size-box
                CommonChart(
                   :factorList="factorList"
                   :properties="properties"
                )
        .bottom-flex.flex-bw-c.mgr16(v-if="properties.typeCode === '40'")
            .common-chart-size-box.drink-box(v-if="waterType")
                CommonChart(
                   :factorList="factorList"
                   :properties="properties"
                )
            .common-bottom-content.drink-box(v-if="!waterType")
                .title-header-str.text-14.mgb16 {{ timeStr }}
                popup-table(:option="colunms" ref="popupTableDom"  :data="detail.pollutants" :height="160" :lineStyle="{ height: '32px'}"  :heightLineStyle="{ height: '28px'}" )
</template>

<script lang="ts" setup name="SurfaceStationDetail">
import dayjs from 'dayjs'
import type { PropType } from 'vue'
import type { returnDataTs } from '@/utils/map/mapPoint'
import { getFactorListByStationCode, getFactorStandValue, getGradeInfo, getMainPollutantStr, wgmsFullStationTableData, wgmsGetWaterAllFactorList } from '@/utils/commonMethods/factor'
import type { stationCodeToTypeListTs } from '@/utils/commonMethods/factor'
import { getColorNameByLevel, getDictionariesCode } from '@/utils/waterUtils'
import treeUtil from '@/utils/treeDataUtils'
import type { popTableOptionTs } from '@/types/common'
import service from '@/service/api'
const props = defineProps({
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    }
})
const data: any = reactive({
    factorList: [
        {
            value: 'level',
            label: '水质类别',
            upValue: '',
            downValue: '',
            standardValue: ''
        },
    ],
    colunms: [],
    factorGroupId: '',
    detail: reactive({
        stationCode: '1',
        name: '--',
        gradeColor: '',
        gradeText: '--',
        targetLevelColor: '',
        targetLevelText: '--',
        watershedText: '--',
        regionText: '--',
        controlLevelText: '--',
        factorMinPollutantStr: '----',
        monitoringMethodsText: '--',
        monitoringMethods: '', // 监测方式
        time: '',
        pollutants: []
    }),
    timeStr: '--',
    newInfo: {},
    waterType: 0,
    siteCameraList: [], // 当前站点的摄像头列表
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
            key: 'levelStr',
            label: '水质',
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'TRENDS'
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
    data.newInfo = props.properties // 接收props
    init()
    // 加载水基础系统的数据
    getBaseBaseWebDetailData(props.properties.typeCode || '', data.newInfo).then((res) => {
        data.detail = Object.assign(data.detail, res)
    })
    getCurSiteCameraList()
})
// 获取视频列表 展无接口先注释
const getCurSiteCameraList = () => {
    const unionId = data.newInfo.accessCode
    if (!unionId) return
    service<{
        cameraName: string
        deviceId: string
        channelId: string
        skip: string
    }[]>('common/cameraList', { unionId }).then((resp) => {
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
 * 地表水详情数据
 * @param typeCode<String> 监测点类型
 * @param paramsObj<Object> 监测点数据详情
 */
const getBaseBaseWebDetailData = async (typeCode: string, paramsObj: any) => {
    try {
        // 数据详情对象
        const detailObj: {
            time?: string
            pollutants?: string | any[]
            monitoringMethodsText?: string
            monitoringMethods?: string
            controlLevelText?: string
            watershedText?: string
            regionText?: string
            gradeText?: string
            gradeColor?: string
            factorMinPollutantStr?: string
            targetLevelColor?: string
            targetLevelText?: string
            resource: any
            name: string
        } = { resource: paramsObj, name: paramsObj.name }
        const targetLevel = await getColorNameByLevel('waterSurface', 'id', paramsObj.waterQuality, 'level')
        const sectionType = paramsObj.sectionType || '001'
        const params = {
            baseLevel: targetLevel && targetLevel !== '--' ? targetLevel : 3,
            factorGroup: '8',
            sectionType
        }
        data.timeStr = props.properties.time
        const datas: any = await service('common/surfaceWaterStandard', params) // 获取目标限值
        // 将标准值和上下限写入因子列表
        data.factorList
            .filter((item: { value: string }) => item.value !== 'level')
            .forEach((item: any) => {
                const standard = datas[item.value]
                if (standard) {
                    item.upValue = standard.upValue
                    item.downValue = standard.downValue
                    item.standardValue = standard.value
                }
            })
        const allFactorsMap: any = {}
        const allFactorListRes: any = await wgmsGetWaterAllFactorList()
        const allFactorList: any[] = []
        allFactorListRes.forEach((element: any) => {
            allFactorList.push(element)
        })
        allFactorList.forEach((item: { factorIndexCode: string }) => {
            allFactorsMap[item.factorIndexCode] = item
        })
        const { gradeText, gradeColor } = await getGradeInfo(typeCode, paramsObj)
        const MainPoll = getMainPollutantStr(typeCode, paramsObj, allFactorsMap)
        const str = MainPoll?.str
        detailObj.gradeText = gradeText // 水质评价
        detailObj.gradeColor = gradeColor // 水质颜色
        detailObj.factorMinPollutantStr = str // 主要污染物超标倍数
        detailObj.targetLevelColor = paramsObj.waterQuality ? await getColorNameByLevel('waterSurface', 'id', paramsObj.waterQuality, 'color') : ''
        detailObj.targetLevelText = paramsObj.waterQuality ? await getColorNameByLevel('waterSurface', 'id', paramsObj.waterQuality, 'name') : '--'
        // 获取区域流域
        const reginData = await treeUtil.getAreaCodeObj(props.properties.regionId)
        const waterData = await treeUtil.getValleyCodeObj(props.properties.watershedId)
        if (reginData)
            detailObj.regionText = reginData.label || '--'
        if (waterData)
            detailObj.watershedText = waterData ? waterData.label : '--'

        detailObj.monitoringMethodsText = paramsObj.monitoringMethods === 0 ? '自动监测' : paramsObj.monitoringMethods === 1 ? '手工监测' : '--'
        detailObj.monitoringMethods = paramsObj.monitoringMethods
        const controlLevel = await getDictionariesCode('controlLevel')
        detailObj.controlLevelText = paramsObj.controlLevel ? (controlLevel.find(item => item.code === paramsObj.controlLevel)?.name ?? '--') : '--' // 控制级别
        // pollutions 转为数组
        let pollutions = typeof paramsObj.pollutants === 'string' ? JSON.parse(paramsObj.pollutants) : paramsObj.pollutants
        pollutions = await wgmsFullStationTableData(data.factorList, pollutions)
        const pollutants = await Promise.all((pollutions || []).map(async (item: any) => {
            item.name = allFactorsMap[item.code]?.factorIndexName
            item.unit = allFactorsMap[item.code]?.unitName
            const { gradeText } = await getGradeInfo(typeCode, item)
            item.levelStr = gradeText
            if (datas[item.code]) {
                item.limit = getFactorStandValue({
                    standard: datas[item.code]
                } as any).standard
            }
            // 没有数据时，是否达标标记设置为--
            if (item.value === '--')
                item.overProofFlag = '--'

            else
                item.overProofFlag = typeof item.overProof === 'boolean' && item.limit && item.limit !== '--' ? (item.overProof === false ? '否' : '是') : '--'

            return item
        }))
        detailObj.pollutants = pollutants || []

        detailObj.time = paramsObj.time ? paramsObj.time : '--'
        return detailObj
    }
    catch (e) {
        console.log(e)
    }
}
/**
 * 组件初始化
 */
const init = async () => {
    // 判断手工自动 区别获取时间参数
    const monitoringMethods = props.properties.monitoringMethods // 0 自动 1 手工
    if (monitoringMethods === 1) data.timeTypeSelected = 'month'
    let factors = []
    // 站点类型
    const typeCode: stationCodeToTypeListTs | undefined = props.properties.typeCode
    if (!typeCode) return
    const factorList = await getFactorListByStationCode(typeCode)
    if (!factorList) return
    data.factorGroupId = factorList.id
    factors = factorList
        .factors.map((item: any) => {
            return {
                ...item,
                value: item.factorIndexCode,
                id: item.id,
                label: item.factorIndexName
            }
        })
    factors.unshift({ value: 'level', label: '水质类别' })
    data.factorList = factors
}

/**
 * @name: 跳转一张图站点详情
 */
const goToSiteDetail = () => {
    window.open(`http://yhwszz.fpi-inc.site/wgms-wall-map-web/#/SiteDetail/General/1/${props.properties.id}?treeId=3301&treeType=1&water=${props.properties.typeCode === '1' ? '001' : '004'}&beginTime=${dayjs().valueOf()}&endTime=${dayjs().valueOf()}&timeType=now&factorGroup=${data.factorGroupId}`, '')
}
/**
 * @name: 饮用水类型切换
 * @param {0|1} val
 */
const drinkTypeChange = async (val: number) => {
    if (data.waterType === val) return
    data.waterType = val
}

const {
    detail,
    siteCameraList,
    colunms,
    timeStr,
    factorList,
    waterType,
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
    margin-bottom: 16px;

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

.common-pop-basic-info {
    background: transparent;
}

.camera-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 12px 10px;
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
    border-radius: 4px;
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

.drink-btn-box {
    display: flex;
    margin-left: 20px;

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
</style>
