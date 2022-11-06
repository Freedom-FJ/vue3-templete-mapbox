/*
 * @Author: mjh
 * @Date: 2022-08-19 09:31:37
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-23 15:43:45
 * @Description: 具体使用请参考项目readme文件 ！！！！！！！！
 */
import type { AxiosRequestHeaders } from 'axios'
import qs from 'qs'
import base from './baseServe'
import ApiConfig from './apis'
import request from './index'
import config from '@/config'
import { DataType, getContentValue } from '@/utils/tools'
import type { PartApiObjTs, ajaxDataTs, apiParamPrototypeTs, getApiTs, requestMethodsTs, typeLimit } from '@/types/service'

/**
 * @desc 请求函数
 * @param url 请求地址
 * @param params 请求参数
 * @param header 请求头
 * @param type 特殊处理类型 'intercept'推入拦截请求数组
 */
const getApi: getApiTs = async (
    url: string,
    params?: record,
    header?: AxiosRequestHeaders,
    type?: typeLimit
) => {
    const ajaxData: PartApiObjTs | undefined = getCurrApiData(url)
    if (!ajaxData) return Promise.reject(new Error('api对象地址错误')) // 判断是否为api对象地址错误
    const headers = ajaxData.headers || header || {} // 获取headers
    // 此情况 请求推入拦截数组
    if (type === 'intercept') headers.isIntercept = true
    // if (ajaxData.proxy) headers.proxyToChangeApi = ajaxData.proxy
    let data: any = getParams(ajaxData.params, params, ajaxData.method, url) // 获取请求参数
    // 添加表单类型参数判断
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded')
        data = qs.stringify(params)

    const path = getPath(ajaxData, params) // 获取请求地址
    return request[ajaxData.method || 'get'](path, data, headers, ajaxData.proxy) as any
}
/**
 * @desc 获取请求api对象
 * @param url 请求封装api对象地址
 */
const getCurrApiData = (url: string) => {
    const start = url.lastIndexOf('/') + 1 // 获得最后一次出现‘/’的位置    home/page/getData
    const strName = url.slice(start) // 取得从该位置到结束的名字也就是方法name   => getData
    const filepath = url.slice(0, start - 1) // 取得路径名 => home/page
    const axiosData = ApiConfig[filepath] // api地址
    if (!axiosData) return
    const ajaxData: PartApiObjTs = axiosData.default[strName]
    return ajaxData
}
// 获取请求地址
const getPath = (
    ajaxData: record,
    data: record | undefined
) => {
    let path = ''
    if ('pathExpr' in ajaxData) path = getContentValue(data, ajaxData.pathExpr)
    else path = ajaxData.path
    // 监测http开头的地址则直接请求无需拼接服务
    if (path.startsWith('http')) { return path }
    else {
        return `${
            (base as any)[ajaxData.server || config.defaultServer]
        }${path}`
    }
}
// 获取请求参数
const getParams = (
    params: recordt<ajaxDataTs> | apiParamPrototypeTs[] | any | undefined, // api配置对象
    paramsData: record | undefined | any[], // 传参请求数据
    method: requestMethodsTs | undefined,
    url: string
) => {
    if (!paramsData || !params) return {} // 如果数据为空则直接返回空传参
    if (params === 'any') return paramsData
    // form类型穿参新项目较少暂时注释
    // if (DataType(paramsData) === 'formdata') return paramsData
    // 数组类型检测
    if (DataType(params) === 'array') {
        method !== 'post' && console.error('请求类型错误错误,为POST请求!')
        // 线上环境不检测类型
        if (config.innerNet) {
            paramsCheckType(paramsData, 'array', '', `接口对象为：${url}`)
            paramsData.length && paramsData.forEach((item: any, index: number) => {
                paramsCheckType(item, params as apiParamPrototypeTs[], `数组下标为${index}`, `接口对象为：${url}`)
            })
        }
        return paramsData
    }
    const data: record = {}
    const objParams = params as recordt<ajaxDataTs>
    Object.keys(objParams).forEach((item: string) => {
        const currKeyParamsData = (paramsData as record)[item] // 当前数据
        // 线上环境不检测类型
        if (config.innerNet) {
            const currLimitType: ajaxDataTs = objParams[item] // 当前限制类型
            paramsCheckType(currKeyParamsData, currLimitType, item, `接口对象为：${url}`)
        }
        data[item] = currKeyParamsData
    })
    return data
}

/**
 * @desc 类型检测方法
 * @param currKeyParamsData 当前被检测数据
 * @param currLimitType 当前检测类型限制
 * @param key 数据对应名称 用于输出错误信息
 */
const paramsCheckType = (currKeyParamsData: any, currLimitType: ajaxDataTs, key: string, str?: string): void => {
    // any类型不检测
    if (currLimitType === 'any') return
    // 判断如果是数组类型定义
    if (DataType(currLimitType) === 'array') {
        const currType: string = DataType(currKeyParamsData)
        const stringTypeLimit = (
            currLimitType as apiParamPrototypeTs[]
        ).map((item: apiParamPrototypeTs) => `${item}`)
        !stringTypeLimit.includes(currType)
            && console.error(
                `参数${key}类型错误,应该为${stringTypeLimit}${str || ''}`
            )
    }
    else {
        currLimitType = `${currLimitType}`
        !DataType(currKeyParamsData, currLimitType)
            && console.error(`参数${key}类型错误,应该为${currLimitType}${str || ''}`)
    }
}
export default getApi
