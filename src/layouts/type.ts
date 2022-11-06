/*
 * @Author: Tian
 * @Date: 2022-09-05 12:02:45
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 14:35:25
 * @Description:
 */
export interface NavDataType {
    leftNavList: NavList[]
    activeIndex: number
    subActiveIndex: number
    isShowSubList: boolean
    curPath: string
    keySelectList: {
        label: string
        value: strNum
    }[]
    labelStyle: Record<string, string>
    selectItemStyle: Record<string, string>
    showPPT: boolean
    pptName: string
    iframeSrc: string
    showPPTMiniSize: boolean
    navTitle: string
    currTypeData: { name: string; value: string; key: string; path: string; level: number } | null
    list: { name: string; value: string; key: string; path: string; level: number }[]
}
interface NavList {
    name: string
    src: string
    index: number
    isShow?: boolean // 是否显示当前项
    headTitle?: string // 标题显示内容 有则替换
    isShowSubList?: boolean // 是否显示子项列表
    coutTypeIndex?: number
    sub?: NavList[]
}
