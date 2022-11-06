import service from '@/service/api'
import { useBaseInfoStore } from '@/store/baseInfo'
import type { areaTree, baseInfoTs, industryCategoryTreeTs, valleyTree } from '@/types/baseInfo'
/**
 * @description 获取配置-网格流域code:region watershed
 * @params type 类型 grid valley area
 */
export const getSetTreeCode = async function (type: 'region' | 'watershed' = 'region') {
    let result = null
    const axiosStore = useBaseInfoStore()

    if (axiosStore.getTreeCodeData) {
        result = axiosStore.getTreeCodeData
    }
    else {
        result = await service<baseInfoTs, true>('baseInfo/baseInformation')
        if (result)
            axiosStore.setTreeCode(result)
    }
    if (type && result && result[type])
        return result[type]

    return ''
}
/**
 * 获取行业类别
 * @return {Promise<void>}
 */
export const wgmsGetIndustryCategoryTreeData = async (code: string) => {
    const baseInfoStore = useBaseInfoStore()

    if (!baseInfoStore.getIndustryCategoryTreeData.length) {
        const industryCategoryTree = await service<industryCategoryTreeTs[], true>('baseInfo/getIndustryCategory')
        baseInfoStore.industryCategoryTree = industryCategoryTree || []
    }
    function getDeepArea(
        numCode: string,
        tree: Array<industryCategoryTreeTs>
    ): industryCategoryTreeTs | null {
        const keyObj: industryCategoryTreeTs | null = null
        for (const i in tree) {
            const currTree = tree[i]
            if (currTree.id === numCode) {
                return currTree
            }
            else if (currTree.children && currTree.children.length) {
                const curr: industryCategoryTreeTs | null = getDeepArea(
                    numCode,
                    currTree.children
                )
                if (curr) return curr
            }
        }
        return keyObj
    }
    const currObj = getDeepArea(code, baseInfoStore.getIndustryCategoryTreeData || [])
    return currObj
}
/**
 * @description 获取流域树数据
 */
export const getValleyTreeData = async function () {
    const BaseInfoStore = useBaseInfoStore()
    const resp = BaseInfoStore.getValleyTreeData
    let result
    if (!resp || !resp.length)
        result = await updateValleyTreeData()

    else
        result = resp

    return result
}
/**
 * @description 设置区域树
 */
const updateAreaTreeData = async function () {
    const code = await getSetTreeCode('region')
    const result = await service<areaTree[], true>('baseInfo/getAreaTree', {
        code
    })
    if (result && result.length) {
        const axiosStore = useBaseInfoStore()
        axiosStore.setAreaTree(result)
        return result
    }
    return []
}

/**
 * @description 获取区域树数据
 */
const getAreaTreeData = async function () {
    const axiosStore = useBaseInfoStore()
    const resp = axiosStore.getAreaTreeData
    let result = null
    if (!resp || !resp.length)
        result = await updateAreaTreeData()

    else
        result = resp

    return result
}
/**
 * @description 获取区域树对应的数据
 * @params code 对应的区域id
 */
const getAreaCodeObj = async (code: string) => {
    const treeData = await getAreaTreeData()
    const numCode = Number(code)
    function getDeepArea(
        numCode: number,
        tree: Array<areaTree>
    ): areaTree | null {
        const keyObj: areaTree | null = null
        for (const i in tree) {
            if (Number(tree[i].id) === numCode) {
                return tree[i]
            }
            else if (tree[i].children && tree[i].children.length) {
                const curr: areaTree | null = getDeepArea(
                    numCode,
                    tree[i].children
                )
                if (curr) return curr
            }
        }
        return keyObj
    }
    const currObj = getDeepArea(numCode, treeData || [])
    return currObj
}

/**
 * @description 获取流域树对应的数据
 * @params code 对应的区域id
 */
const getValleyCodeObj = async (code: string) => {
    const treeData = await getValleyTreeData()
    const numCode = Number(code)
    function getDeepValley(
        numCode: number,
        tree: Array<valleyTree>
    ): valleyTree | null {
        const keyObj: valleyTree | null = null
        for (const i in tree) {
            if (Number(tree[i].id) === numCode) {
                return tree[i]
            }
            else if (tree[i].children && tree[i].children.length) {
                const curr: valleyTree | null = getDeepValley(
                    numCode,
                    tree[i].children
                )
                if (curr) return curr
            }
        }
        return keyObj
    }
    const currObj = getDeepValley(numCode, treeData || [])
    return currObj
}
/**
 * @description 设置流域树
 */
export const updateValleyTreeData = async function () {
    const code = await getSetTreeCode('watershed')
    const result = await service<valleyTree[], true>('baseInfo/getValleyTree', { codes: code })
    if (result && result.length) {
        const baseInfoStore = useBaseInfoStore()
        baseInfoStore.setValleyTree(result)
        return result
    }
    return []
}

export default {
    getSetTreeCode,
    getValleyTreeData,
    getAreaTreeData,
    updateValleyTreeData,
    getAreaCodeObj,
    getValleyCodeObj,
    wgmsGetIndustryCategoryTreeData
}
