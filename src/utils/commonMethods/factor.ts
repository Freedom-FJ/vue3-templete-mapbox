/*
 * @Author: mjh
 * @Date: 2022-09-15 16:21:48
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-12 16:41:35
 * @Description:
 */
import type { factorGroupTs } from '@/types/common'
import service from '@/service/api'
import type { allSurfaceWaterStandardListTs, surfaceWaterStandardValueTs } from '@/types/factor'
import { WATERLEVEL, WATERLEVELCOLOR, getColorNameByLevel, getWaterQualityDictionaries } from '@/utils/waterUtils'
import { useCommonStore } from '@/store/common'
import type { StationCode } from '@/utils/map/mapPoint'
const WATER_FACTOR_MAP = new Map()
export type stationCodeToTypeListTs = keyof typeof stationCodeToTypeList
export const stationCodeToTypeList: Partial<Record<StationCode, string>> = {
    '1': 'surfaceSection', // 地表水
    '58': 'surfaceSection', // 监测点
    '50': 'surfaceSection', // 监测点
    '1,40': 'algae', // 藻类
    '6': '',
    '12': 'companyPollutionSource', // 污染源排口
    '-1': 'companyPollutionSource', // 污染源排口
    '8': 'outlet_310002', // 污水处理厂
    '40': 'drinkSection', // 饮用水
    '108': 'companyPollutionSource', // 禽类
    '38': '',
    '5': 'hydrologicalStation', // 水文
    '2': 'surfaceSection', // 气象
    '3': 'rainStation' // 雨晴
}

/**
 * 获取因子组
 */
export const getFactorGroupList = async (factorCode: string) => {
    const commonStore = useCommonStore()
    const currHaveFactor = commonStore.getFactor(factorCode)
    if (currHaveFactor) return currHaveFactor
    const res = await service<factorGroupTs[], true>('common/queryFactorGroup', {
        code: factorCode
    })
    if (res.length) {
        commonStore.setFactor(factorCode, res[0])
        return res[0]
    }
}
/**
 * 获取因子信息根据因子code
 * @param code<String>
 * @return Promise<Factor>
 */
export const wgmsFindFactorInfoByCode = async (code: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (WATER_FACTOR_MAP instanceof Map && WATER_FACTOR_MAP.size === 0)
            await wgmsGetWaterAllFactorList()

        return resolve(WATER_FACTOR_MAP.get(code))
    })
}
/**
 * 获取水环境下全部的因子数据
 * @return Promise<Map<Factor>>
 */
export const wgmsGetWaterAllFactorList = async () => {
    if (WATER_FACTOR_MAP instanceof Map && WATER_FACTOR_MAP.size > 0)
        return WATER_FACTOR_MAP
    const factorList = await service('common/wgmsGetAllFactorList')
    if (Array.isArray(factorList)) {
        for (let i = 0; i < factorList.length; i++)
            WATER_FACTOR_MAP.set(factorList[i].factorIndexCode, factorList[i])
    }
    return WATER_FACTOR_MAP
}

/**
 * 策略模式获取各类监测点信息数据
 * @param typeCode
 * @param item
 */
export const getGradeInfo = async (typeCode: string, item: { grade: string; level: number }) => {
    let gradeText = '--'
    let gradeColor = '#8E8E8E'
    // 地表水监测点
    if (typeCode === '1' || typeCode === '58') {
        const level = item.grade ? item.grade : item.level ? item.level : null
        gradeText = level ? await getColorNameByLevel('waterSurface', 'level', level.toString(), 'name') : '--' // 水质评价
        gradeColor = level ? await getColorNameByLevel('waterSurface', 'level', level.toString(), 'color') : '#8E8E8E' // 水质颜色
    }
    if (typeCode === '40') {
        const level = item.grade ? item.grade : item.level ? item.level : null
        gradeText = level ? await getColorNameByLevel('waterSurface', 'level', level.toString(), 'name') : '--' // 水质评价
        gradeColor = level ? await getColorNameByLevel('waterSurface', 'level', level.toString(), 'color') : '#8E8E8E' // 水质颜色
    }
    // 雨情站
    if (typeCode === '3') {
        const level = item.grade ? item.grade : item.level ? item.level : null
        gradeText = level ? WATERLEVEL[Number(level) - 1] : '--' // 水质评价
        gradeColor = level ? WATERLEVELCOLOR[Number(level) - 1] : '#8E8E8E' // 水质颜色
    }
    // 水文站
    if (typeCode === '5') {
        const level = item.grade ? item.grade : item.level ? item.level : null
        gradeText = level ? WATERLEVEL[Number(level) - 1] : '--' // 水质评价
        gradeColor = level ? WATERLEVELCOLOR[Number(level) - 1] : '#8E8E8E' // 水质颜色
    }
    return {
        gradeColor,
        gradeText,
    }
}
/**
 * 策略模式获取各类监测点主要污染物
 * @param typeCode
 * @param item
 * @param allFactorsMap
 */
export const getMainPollutantStr = (typeCode: string, item: { mainPollutant: any[]; mainPollutants: { [key: string]: string } }, allFactorsMap: any) => {
    if (typeof item.mainPollutant === 'string') item.mainPollutant = JSON.parse(item.mainPollutant)
    const formatFactor = (mainPollutant: any[]) => {
        const factorPollutantStrList = []
        const factorPollutantDataList = []
        for (let i = 0; i < mainPollutant.length; i++) {
            const factorInfo = allFactorsMap[mainPollutant[i].code]
            if (factorInfo) {
                factorPollutantDataList.push(factorInfo)
                factorPollutantStrList.push(`${factorInfo.factorIndexName}`)
            }
        }
        return {
            factorPollutantDataList,
            factorPollutantStrList,
            str: factorPollutantStrList.join('、'),
        }
    }
    if (typeCode === '1' || typeCode === '58') {
        // 接口不知咋搞得到，有的集合有的对象，字段有的是单数 有的复数，只能在客户端做一层适配
        let mainPollutant = item.mainPollutant || []
        if (item.mainPollutants && typeof item.mainPollutants === 'object') {
            const values = Object.values(item.mainPollutants)
            const keys = Object.keys(item.mainPollutants)
            mainPollutant = keys.reduce((previousValue: any[], currentValue, currentIndex) => {
                previousValue.push({ code: currentValue, value: values[currentIndex], bstel: values[currentIndex] })
                return previousValue
            }, [])
        }
        return formatFactor(mainPollutant)
    }
    if (typeCode === '40')
        return formatFactor(item.mainPollutant || [])

    if (typeCode === '3')
        return formatFactor(item.mainPollutant || [])

    if (typeCode === '5')
        return formatFactor(item.mainPollutant || [])

    // 12 : 污染源企业  8: 污水处理厂
    if (typeCode === '12')
        return formatFactor(item.mainPollutant || [])

    if (typeCode === '8')
        return formatFactor(item.mainPollutant || [])
}
/**
 * 获取因子标准值
 */
export const getFactorStandValue = (val: { standard: { upValue: string; downValue: string; value: string; limitType: string }; value: string }) => {
    const result = { standard: '--', value: '--' }
    if (!val.standard && !val.value)
        return result

    const upValue = val.standard ? val.standard.upValue : ''
    const downValue = val.standard ? val.standard.downValue : ''
    const value = val.standard ? val.standard.value : ''
    const limitType = val.standard ? val.standard.limitType : ''
    if (Number(limitType) === 0)
        result.standard = downValue && upValue ? `${downValue}~${upValue}` : '--'

    else if (Number(limitType) === 1)
        result.standard = value ? `<=${value}` : '--'

    else if (Number(limitType) === 2)
        result.standard = value ? `>=${value}` : '--'

    else
        result.standard = '--'

    return result
}
/**
 * 监测点表格数据填充
 * @note 监测点弹框监测数据后端只返回了有监测数据的因子， 前端需要填充完整
 * @param factorList 当前因子组全部数据
 * @param tableData  当前点位数据
 */
export const wgmsFullStationTableData = async (factorList: any, tableData: any) => {
    try {
        const allFactorMap: any = await wgmsGetWaterAllFactorList()
        const newTable = tableData || []
        const tableMap = new Map()
        // 监测因子表Map映射
        tableData && tableData.forEach((item: any) => {
            const factorCode = item.code
            if (factorCode) {
                const factorDetail = allFactorMap.get(factorCode)
                tableMap.set(factorCode, factorDetail)
            }
        })
        // 组织并补全监测因子表
        factorList.forEach((factor: any) => {
            const factorIndexCode: number = factor.factorIndexCode
            if (factorIndexCode) {
                // 因子列表补全监测值不存在的因子到监测值得因子表，数据用--补全
                if (!tableMap.get(factorIndexCode)) {
                    const factorInfo = allFactorMap.get(factorIndexCode)
                    newTable.push({
                        bstel: '--',
                        code: factorInfo.factorIndexCode,
                        flagCode: '--',
                        grade: null,
                        lavelStr: '--',
                        limit: '--',
                        mpFlag: '--',
                        name: factorInfo.factorIndexName,
                        overProof: false,
                        overProofFlag: '--',
                        unit: factorInfo.unitName,
                        value: '--',
                    })
                }
            }
        })
        return newTable
    }
    catch (e) {
        return tableData
    }
}

/**
 * 根据站点类型获取因子组
 * @note 监测点弹框监测数据后端只返回了有监测数据的因子， 前端需要填充完整
 * @param factorList
 * @param tableData
 */
export const getFactorListByStationCode = async (code: stationCodeToTypeListTs) => {
    if (!stationCodeToTypeList[code]) return undefined
    return getFactorGroupList(stationCodeToTypeList[code] || '')
}

/**
 * @name: 获取水质目标区间值
 * @param code 因子code
 * @param riverOrLake  0河流 1河ku
 */
let allLevelRange: allSurfaceWaterStandardListTs[] = []
export const getFactorLevelRange = async (code: string | 'level', riverOrLake: 0 | 1, standObj?: surfaceWaterStandardValueTs) => {
    const gradesList = await getWaterQualityDictionaries('waterSurface') || []
    if (code === 'level') { // 水质类别可以直接返回
        const piecesStatic: {
            min: null | number
            max: null | number
            color: string
            level?: number
        }[] = [
        ]
        gradesList.forEach((item) => {
            piecesStatic.push({
                min: item.level - 0.9,
                max: item.level + 0.1,
                color: item.color
            })
        })
        return piecesStatic
    }
    if (!allLevelRange.length)
        allLevelRange = await service<allSurfaceWaterStandardListTs[], true>('factor/allSurfaceWaterStandardList')
    const colorList = gradesList.map(item => item.color)
    const currCodeLevelRange = allLevelRange.filter(item => item.pollutantCode === code && item.riverOrLake === riverOrLake)
    let limitType = 0
    if (!currCodeLevelRange || !currCodeLevelRange.length) return []
    if (!currCodeLevelRange[0].limitType) { // 区间 特殊处理ph
        return [
            {
                level: 1,
                max: currCodeLevelRange[0].upValue,
                min: currCodeLevelRange[0].downValue,
                color: colorList[0]
            },
            {
                level: 6,
                max: 99,
                min: (currCodeLevelRange[0].upValue || 0) + 0.001,
                color: colorList[5]

            },
            {
                level: 6,
                max: (currCodeLevelRange[0].downValue || 0) + 0.001,
                min: 0,
                color: colorList[5]
            }
        ]
    }
    const levelRange = currCodeLevelRange.map((item, index) => {
        limitType = item.limitType
        switch (item.limitType) {
        case 1:
            return {
                level: item.gradeLevel,
                max: item.value,
                min: !index ? 0 : currCodeLevelRange[index - 1].value + 0.001,
                color: colorList[item.gradeLevel - 1]
            }
        case 2:
            return {
                level: item.gradeLevel,
                max: !index ? 999 : currCodeLevelRange[index - 1].value - 0.001,
                min: item.value,
                color: colorList[item.gradeLevel - 1]
            }
        default:
            return {}
        }
    })
    if (limitType === 1) {
        levelRange.push({
            level: 6,
            max: 999,
            min: currCodeLevelRange[currCodeLevelRange.length - 1].value,
            color: colorList[5]
        })
    }
    else if (limitType === 2) {
        levelRange.push({
            level: 6,
            max: currCodeLevelRange[currCodeLevelRange.length - 1].value - 0.01,
            min: 0,
            color: colorList[5]
        })
    }
    return levelRange
}
