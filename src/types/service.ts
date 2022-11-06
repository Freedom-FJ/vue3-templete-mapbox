/*
 * @Author: mjh
 * @Date: 2022-08-19 09:31:37
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-15 20:39:54
 * @Description:
 */
import type { AxiosRequestHeaders } from 'axios'
import type BaseList from '@/service/baseServe'
import type request from '@/service/index'

export interface apiObjTs {
    path: string // 请求地址
    pathExpr: string // 解析变量版本请求地址  用{{}}包裹变量
    server: keyof Omit<typeof BaseList, 'prototype'> // 请求服务
    method: requestMethodsTs // 请求类型
    proxy: string // 本地调试时 接口特殊代理
    params: recordt<Arrayable<apiParamPrototypeTs>> | apiParamPrototypeTs[] | string// 配置请求参数 数组类型传法：直接传[类型]即可
    headers: AxiosRequestHeaders // 请求头
}
export type PartApiObjTs = Partial<apiObjTs>
export type apiParamPrototypeTs = string | undefined | null
export type ajaxDataTs = Arrayable<apiParamPrototypeTs>

export type getApiTs = <T, X = false>(
    url: string,
    params?: Record<string, any>,
    header?: Record<string, any>,
    type?: typeLimit
) => apiReturnTs<T, X>
export type apiReturnTs<T, X> = X extends true ? Promise<T> : Promise<{
    code: number
    data: null | T
    success: boolean
    message: string
}>
export type typeLimit = 'intercept'
export type apiListTs = recordt<PartApiObjTs>

export type requestMethodsTs = keyof Omit<typeof request, 'prototype'>
export interface commonReturn<T> {
    code: number
    data: null | T
    message: string
    success: boolean
}
