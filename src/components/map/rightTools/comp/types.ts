/*
 * @Author: Tian
 * @Date: 2022-09-21 17:37:43
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-23 14:13:07
 * @Description:
 */
export interface VideoTreeRes {
    success: boolean
    code: string
    message: string
    data: VideoTreeList[]

}
export interface VideoTreeList {
    title: string
    code: string
    num: number
    children: VideoTreeList[]

}
export interface CheckedData {
    [key: string]: boolean
}
export interface VideoListRes {
    success: boolean
    code: string
    message: string
    data: CameraListData[]

}

export interface CameraListData {
    address: string
    appKey: null | string
    cameraName: string
    cameraType: string
    channelId: string
    deviceId: string
    lat: strNum
    lon: strNum
    objId: strNum
    secret: null | string
    status: string
    unionId: string
    url: null | string
    name?: string
    longitude?: strNum
    latitude?: strNum
    symbolImgName?: string
}
export interface PlayVideoParams {
    deviceId: string
    channelId: string
    skip: string
    url?: null | string
    cameraCode: string
}
export interface VideoUrl {
    success: boolean
    code: string
    message: string
    data: {
        FLV: string
        code: string
        serial: string
        status: string
        videoAddress: string
    }
}
