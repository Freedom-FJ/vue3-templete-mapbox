/*
 * @Author: mjh
 * @Date: 2022-09-14 16:18:58
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-30 10:08:33
 * @Description:
 */
/**
 * 地表水水质扽等级
 */
import { keyBy } from 'lodash-es'
import { useMapStore } from '@/store/map'
import service from '@/service/api'
import type { WaterQualityDictionariesKeyTs, WaterQualityDictionariesTs, dictionariesToNameTs } from '@/types/baseInfo'
import { useBaseInfoStore } from '@/store/baseInfo'
export const WATERLEVELCOLOR = ['#03A9F4', '#1976D2', '#85C940', '#D9CD4C', '#EF8E00', '#E12214']
export const WATERLEVEL = ['I类', 'II类', 'III类', 'IV类', 'V类', '劣V类']
const dictionariesToName = {
    controlLevel: '23'
}
const menuData: record | null = null
export const dictionariesWaterQualityToName = {
    waterSurface: 'baseInfo/listAll',
    waterGround: 'baseInfo/query',
    waterOffshoreArea: 'baseInfo/seaWaterQualityCategory', // 近海岸
    blackSmellyWaterGrade: 'baseInfo/blackSmellyWaterGrade', // 黑臭水体
}

export const wgmsDefaultGroup = { poolWaterGroupId: 45, waterWorkWaterGroupId: 46, sunWaterId: '8', pomsStation: '38', hydrometric: '36', rain: '37', POMS: '40', pomsSite: 38, drinkingWater: '42' }

// 污染源特殊因子(已经存在总量的因子)
export const wgmsPOMSSpecialFactor = [
    'w99030_Cou',
    'w01018_Cou',
    'w21003_Cou'
]
export const timeStrList = {
    hour: '小时',
    day: '日',
    week: '周',
    month: '月',
    year: '年',
}

/**
 * 查询等级相关信息
 * @param water
 * @param key
 * @param val
 * @param type
 * @return {string|*}
 */
export async function getColorNameByLevel(water: string, key: string, val: string | null, type: string, data?: WaterQualityDictionariesTs[]) {
    let list: WaterQualityDictionariesTs[] = data || []
    if (!data) {
        switch (water) {
        case 'waterBlackSmelly':
        case 'waterSurface':
            list = await getWaterQualityDictionaries('waterSurface')
            break
        case 'waterGround':
            list = await getWaterQualityDictionaries('waterGround')
            break
        case 'waterOffshoreArea':
            list = await getWaterQualityDictionaries('waterOffshoreArea')
            break
        default:
            break
        }
    }
    if (((key === 'level' || key === 'value') && (!val || !parseInt(val))) || (key === 'id' && !val) || !val)
        return type === 'color' ? '#6D7278' : '--'

    const gradeMap = keyBy(list, key)
    if (gradeMap[val] && gradeMap[val][type])
        return gradeMap[val][type]

    return type === 'color' ? '#6D7278' : '--'
}
/**
 * 查询等级信息
 * @param level
 * @return {{qualityState: string, code: string, color: string, level: number, bmpId: null, name: string, lastChangeTimestamp: string, description: string, id: string, createTimestamp: string} | {qualityState: string, code: string, color: string, level: number, bmpId: null, name: string, lastChangeTimestamp: string, description: string, id: string, createTimestamp: string} | {qualityState: string, code: string, color: string, level: number, bmpId: null, name: string, lastChangeTimestamp: string, description: string, id: string, createTimestamp: string} | {qualityState: string, code: string, color: string, level: number, bmpId: null, name: string, lastChangeTimestamp: string, description: string, id: string, createTimestamp: string} | {qualityState: string, code: string, color: string, level: number, bmpId: null, name: string, lastChangeTimestamp: string, description: string, id: string, createTimestamp: string}}
 */
export async function findLevelInfo(level: number) {
    const list = await getWaterQualityDictionaries('waterSurface')
    return list.find((item) => {
        return item.level === level
    })
}
/**
 * @name 获取个个水体类型的水质类别字典
 * @param id 字典对于的code
 */
export const getWaterQualityDictionaries = async (id: WaterQualityDictionariesKeyTs) => {
    const baseInfoStore = useBaseInfoStore()
    if (baseInfoStore.hasWaterQiality(id)) return baseInfoStore.hasWaterQiality(id)
    const url = dictionariesWaterQualityToName[id]
    const res = await service<{ entries: WaterQualityDictionariesTs[]; total: number }, true>(url)
    baseInfoStore.setWaterQuality(id, res.entries || [])
    return res.entries || []
}
/**
 * @name 获取公共字典
 * @param id 字典对于的code
 */
export const getDictionariesCode = async (id: number | keyof typeof dictionariesToName) => {
    const res = await service<{ entries: dictionariesToNameTs[]; total: number }, true>('common/getStationCode', {
        offset: 0,
        limit: 30,
        categoryId: typeof id === 'number' ? id : dictionariesToName[id],
        queryStr: ''
    })
    return res.entries || []
}
/**
 * 获取图层数据
 */
export const getMapLayerList = async () => {
    const mapStore = useMapStore()
    if (mapStore.mapLayerList.length) return mapStore.mapLayerList
    const res = await service<record, true>('common/getMapLayer')
    const layerData = JSON.parse(res.menuConfigDetail['014'].data)
    const layerList = layerData[0].children
    const data = layerList.filter((o: record) => {
        return o.checked
    })
    mapStore.setMapLayerList(data)
    return data
}
