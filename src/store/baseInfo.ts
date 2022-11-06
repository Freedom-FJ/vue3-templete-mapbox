/*
 * @Author: mjh
 * @Date: 2022-09-19 16:59:54
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-24 14:15:40
 * @Description:
 */
import { defineStore } from 'pinia'
import type { WaterQualityDictionariesKeyTs, WaterQualityDictionariesTs, areaTree, currTreeNodeTs, dictionariesToNameTs, globalConfigTs, industryCategoryTreeTs, nameType, systemMenusTs } from '@/types/baseInfo'

export const useBaseInfoStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'baseInfo',
    state: () =>
        ({
            systemMenus: null as null | systemMenusTs[], // 系统菜单
            // 当前选中的树
            currTreeNode: null as null | {
                id: number
                label: string
                parentId: number
                code: string
                type: nameType
                typeNum: 0 | 1
            },
            // 基础区域和流域配置
            treeCode: null as null | {
                city: string
                city_code: string
                region: string
                watershed: string
            },
            gridTree: [] as any[], // 网格
            industryCategoryTree: [] as industryCategoryTreeTs[], // 行业
            valleyTree: [] as any[], // 河流
            areaTree: [] as Array<areaTree>, // 区域树
            globalConfig: null as globalConfigTs | null, // 基础配置信息
            dictionariesWaterQualitySaveList: {} as Record<WaterQualityDictionariesKeyTs, WaterQualityDictionariesTs[]>
        }),
    // getters
    getters: {
        getTreeCodeData: state => state.treeCode,
        getIndustryCategoryTreeData: state => state.industryCategoryTree,
        getGridTreeData: state => state.gridTree,
        getValleyTreeData: state => state.valleyTree,
        getAreaTreeData: state => state.areaTree,
        getGlobalConfigData: state => state.globalConfig,
        getSystemMenusData: state => state.systemMenus,
        getCurrTreeNodeData: state => state.currTreeNode
    },
    actions: {
        async setTreeCode(treeCode: {
            city: string
            city_code: string
            region: string
            watershed: string
        }) {
            // 可以做异步
            this.treeCode = treeCode
        },
        hasWaterQiality(key: WaterQualityDictionariesKeyTs) {
            return this.dictionariesWaterQualitySaveList[key]
        },
        setWaterQuality(key: WaterQualityDictionariesKeyTs, data: WaterQualityDictionariesTs[]) {
            this.dictionariesWaterQualitySaveList[key] = data
        },
        setGridTree(gridTree: any) {
            this.gridTree = gridTree
        },
        setValleyTree(valleyTree: any) {
            this.valleyTree = valleyTree
        },
        setAreaTree(areaTree: Array<areaTree>) {
            this.areaTree = areaTree
        },
        setGlobalConfig(globalConfig: globalConfigTs) {
            this.globalConfig = globalConfig
        },
        setSystemMenus(systemMenus: systemMenusTs[] | null) {
            this.systemMenus = systemMenus
        },
        setCurrTreeNode(currTreeNode: {
            id: number
            label: string
            parentId: number
            code: string
            type: nameType
            typeNum?: 0 | 1
        } | null) {
            const typeList: Record<nameType, 0 | 1> = {
                valley: 0,
                area: 1
            }
            currTreeNode && (currTreeNode.typeNum = typeList[currTreeNode.type])
            this.currTreeNode = currTreeNode as (currTreeNodeTs | null)
        }
    }
})
