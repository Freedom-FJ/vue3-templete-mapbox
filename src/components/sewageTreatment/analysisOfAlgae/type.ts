export interface AlgaeWarningList {
    code: string
    data: null | Record<string, any>
    message: string
    success: boolean
}
export interface AlgaeFactorGroupRes {
    code: string
    id: string
    name: string
    factors: Record<string, any>[]
}
export interface ProcessWarningList {
    code: string
    data: Record<string, any>[]
    message: string
    success: boolean
}
export interface PomsAlarmList {
    code: string
    data: {
        alarmNum: number
        rank: number
        siteName: string
        value: string
    }[]
    message: string
    success: boolean
}
export interface PortToRiverData {
    code: string
    data: {
        nh3OverList: Record<string, any>[]
        tpOverList: Record<string, any>[]
        nh3OverNum: number
        tpOverNum: number
    }
    message: string
    success: boolean
}
export interface PomsDataList {
    code: string
    data: {
        data: Record<string, any>[]
        total: number
    }
    message: string
    success: boolean
}
