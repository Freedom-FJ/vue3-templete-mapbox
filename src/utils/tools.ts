/*
 * @Author: Tian
 * @Date: 2021-11-01 10:48:16
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 14:56:55
 * @Description:
 */
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

// vue全局挂载导出方法  使用 const { proxy } = useCurrentInstance()
import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import config from '@/config/index'
const TokenKey = 'token'
/**
 * @desc 函数 防抖 false/节流 true
 * @param fn 函数
 * @param wait 函数执行间隔时间毫秒数 默认1s Number
 * @param immediate 是否立即执行 Boolean     true: 节流  false 防抖
 */
export function debounce(fn: () => void, immediate: boolean, wait = 1000) {
    let timer: null | NodeJS.Timeout
    return function () {
        if (timer && immediate)
            return

        if (timer && !immediate)
            clearTimeout(timer)

        if (immediate)
            fn()

        timer = setTimeout(() => {
            timer = null
            if (!immediate)
                fn()
        }, wait)
    }
}
/**
 * @desc 函数
 * @param msg 显示文字
 * @param type 提示类型
 */
export const messageBox = (msg: string, type?: any) => {
    ElMessage({
        message: msg,
        type: type || 'warning',
        duration: 2000
    })
}
/**
 * @description Is Tcp Url
 * @param {String} url
 */
export function isTcp(url: string) {
    return !!url.match(/^https?:\/\//)
}
/**
 * @description Redirect Login Page
 */
export function redirectLogin() {
    window.location.href = config.bspURL
}
/**
 * @desc 驼峰转为非驼峰链接
 * @param str 字符串
 * @param type  链接字符串 -
 */
export function toLowerLine(str: string, type?: string) {
    type = type || '-'
    let tuo = ''
    const arr = str.split('')
    const newArr = arr.map((ite) => {
        return ite.toUpperCase() === ite
            ? (ite = type + ite.toLowerCase())
            : ite
    })
    tuo = newArr.join('')
    if (tuo.slice(0, 1) === type) return tuo.slice(1)
    return tuo
}

/**
 * @description Set Token
 * @param {String} token
 */
export function setToken(token: string) {
    Cookies.set(TokenKey, token)
}

/**
 * @description Get Token
 * @return {String}
 */
export function getToken() {
    const token
        = window.localStorage.getItem('token')
        || Cookies.get(TokenKey)
        || getQueryValue(TokenKey)
    return token
}

/**
 * @description Remove Token
 */
export function removeToken() {
    Cookies.remove(TokenKey)
    window.localStorage.removeItem('token')
    window.sessionStorage.removeItem('token')
}

/**
 * @description Get Query Value
 * @param {String} key
 * @return {String}
 */
export function getQueryValue(key: string) {
    const url = window.location.search
    const theRequest: any = {}
    if (url.includes('?')) {
        const str = url.substr(1)
        const queryList = str.split('&')
        for (let i = 0; i < queryList.length; i++) {
            theRequest[queryList[i].split('=')[0]] = unescape(
                queryList[i].split('=')[1]
            )
        }
    }
    return theRequest[key] ? theRequest[key] : ''
}

/**
 * @description Check Token
 * @return {Boolean}
 */
export function checkToken() {
    const value = getQueryValue(TokenKey)
    if (value) setToken(value)
    return !!value || !!getToken()
}
/**
 * @description Encode Url Query
 * @param {Object} query
 * @return {String}
 */
export function encodeQuery(query: Record<string, any>) {
    let queryStr = ''
    const keys = Object.keys(query)
    keys.forEach((item, index) => {
        queryStr = index
            ? `${queryStr}&${item}=${query[item]}`
            : `${queryStr}${item}=${query[item]}`
    })
    return queryStr
}

/**
 * @description Decode Url Query
 * @param {String} queryStr
 * @return {Object}
 */
export function decodeQuery(queryStr: string) {
    const query: Record<string, any> = {}
    queryStr = decodeURI(queryStr.replace('?', ''))
    const queryArr = queryStr.split('&')
    queryArr.forEach((item) => {
        const keyAndValue = item.split('=')
        query[keyAndValue[0]] = keyAndValue[1]
    })
    return query
}
export function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const proxy = appContext.config.globalProperties
    return {
        proxy
    }
}
/**
 * 获取类型方法 返回 参数类型 或者 true/false
 * @param {*} tgt 需要判断类型的变量
 * @param {*} type? 可传可不传， 不传的话方法返回变量类型，传的话返回参数类型是否一致true/false
 * 可确定的类型：undefined、null、string、number、boolean、array、object、symbol、
 * date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap
 */
type typeReturn<T> = T extends string ? boolean : string
export function DataType<T>(tgt: any, type?: T): typeReturn<T> {
    const dataType = Object.prototype.toString
        .call(tgt)
        .replace(/\[object (\w+)\]/, '$1')
        .toLowerCase()
    return (type ? dataType === (type as unknown as string) : dataType) as typeReturn<T>
}

/**
 * @name: 数字添加分隔符
 * @param {number} num 需要分隔的数字
 * @param {string} separate 分隔符
 * @param {boolean} reverse 是否是逆转 （将分隔数字转化为数字）
 * @return {*}
 */
export function numToSeparate(num: number | string, separate?: string, reverse?: boolean) {
    if (reverse)
        return (`${num}`).split(separate || ',').join()

    const numArr = (`${num}`).split('.')
    const numStrUse = numArr[0]
    const returnNumArr: string[] = []
    let activeIndex = 0
    numStrUse.split('').reverse().forEach((item) => {
        if (activeIndex !== 3) {
            returnNumArr.push(item)
            activeIndex++
            return
        }
        returnNumArr.push(separate || ',')
        returnNumArr.push(item)
        activeIndex = 0
    })
    const returnNum = returnNumArr.reverse().join('')
    return numArr.length === 2 ? `${returnNum}.${numArr[1]}` : returnNum
}
/**
 * 方法名：
 * 功能介绍：返回一个对象里面包含后一个数组比第一个数组增加、减少的数据（适用于去重过后的数组）
 * 参数：
 * @param {*} beforeArr 前一个数组
 * @param {*} afterArr 后一个数组
 * 返回： resObj：{
 *      add: Array<number | string>
        del: Array<number | string>
 * }
 */
export function compare(
    beforeArr: Array<number | string>,
    afterArr: Array<number | string>
) {
    const resObj: {
            add: Array<number | string>
            del: Array<number | string>
        } = {
            add: [],
            del: []
        }
    const cenObj: {
            [key: number | string]: any
        } = {}
    // 把beforeArr数组去重放入cenObj
    for (let i = 0; i < beforeArr.length; i++)
        cenObj[beforeArr[i]] = beforeArr[i]

    // 遍历afterArr，查看其元素是否在cenObj中
    for (let j = 0; j < afterArr.length; j++) {
        if (!cenObj[afterArr[j]])
            resObj.add.push(afterArr[j])
        else
            delete cenObj[afterArr[j]]
    }
    for (const k in cenObj)
        resObj.del.push(k)

    return resObj
}

/**
 * 获取树结构第一级的最小子集
 * list 树结构
 */
export const getTreeDataSub = (list: Array<Record<string, any>>) => {
    const resultUrl = {
        url: '',
        code: ''
    }
    const getTargetUrl = (arr: Record<string, any>) => {
        if (arr.subs && arr.subs.length) {
            getTargetUrl(arr.subs[0])
        }
        else {
            resultUrl.url = arr.url
            resultUrl.code = arr.code
        }
    }
    getTargetUrl(list)
    return resultUrl
}
/**
 * 获取匹配的树节点
 * list 树结构
 */
export const getTreeNode = (list: Array<Record<string, any>>, code: string | number) => {
    const result = {
        label: '',
        code: ''
    }
    const getTargetNode = (arr: Array<Record<string, any>>, code: string | number) => {
        arr.forEach((item: any) => {
            if (item.code === code) {
                result.label = item.label
                result.code = item.code
            }
            else if (item.children && item.children.length) {
                getTargetNode(item.children, code)
            }
        })
    }
    getTargetNode(list, code)
    return result
}
/**
 * 获取匹配的树节点
 * list 树结构
 */
export const getTargetNodeList = (list: Array<Record<string, any>>, name: string | number) => {
    const result: any = []
    const getTargetList = (arr: Array<Record<string, any>>, name: string | number) => {
        arr.forEach((item: any) => {
            if (item.label.includes(name))
                result.push(item)
            else if (item.children && item.children.length)
                getTargetList(item.children, name)
        })
    }
    getTargetList(list, name)
    return result
}

/**
 * @dec 替换{{}}变量
 * @param {*} vm 变量对象
 * @param {*} expr 变量在对象内的位置  如server.base
 */
export const getVal = (vm: any, expr: string) => {
    if (!expr) return vm
    const value = expr.split('.').reduce((data: any, current: any) => {
        return data[current]
    }, vm)
    return value
}

/**
 * @dec 赋值对象
 * @param {*} obj 变量对象
 * @param {*} key 变量在对象内的位置  如server.base
 * @param {*} val 变量的值
 */
export const getDeepObj = (obj: Record<string, any>, key: string, val: string | number) => {
    const keyArr = key.split('.')
    keyArr.reduce((data: any, current: any, arr) => {
        if (arr === keyArr.length - 1) data[current] = val
        return data[current]
    }, obj)
}
/**
 * @name 模板解析
 * @dec 处理{{}}字符串，替换变量值
 * @param {*} vm 变量对象
 * @param {*} expr 字符串内部包含{{变量}}  如http://{{server.base}}/{{path}}
 */
export const getContentValue = (vm: any, expr: string) => {
    // expr: 我是{{person.name}}
    // 遍历表达式将内容重新特换成一个完整的内容，返回回去
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        return getVal(vm, args[1])
    })
}
/**
 * 获取图片资源
 * @param url 图片路径
 * @returns
 */
export const getAssetsFile = (url: string) => {
    return new URL(`../assets/images/${url}`, import.meta.url).href
}
// 将日期转换成一年中的第几周
export function getYearWeek(date: number) {
    const checkDate = new Date(date)
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7))
    const time = checkDate.getTime()
    checkDate.setMonth(0)
    checkDate.setDate(1)
    const week = Math.floor(Math.round((time - (checkDate as any)) / 86400000) / 7) + 2
    return week
}
/**
 * 数字添加逗号分隔
 * @param num 数字
 */
export const getNumber = (num: string | number) => {
    const numStr = `${num}`
    const returnArr: string[] = []
    numStr.split('').reverse().forEach((element, index) => {
        returnArr.push(element)
        if ((index + 1) % 3 === 0) returnArr.push(',')
    })
    const returnStr = returnArr.reverse().join('')
    return returnStr
}
/**
 * 将px转换成rem
 * @param px 设计图像素值
 * @returns rem
 */
export const pxToRem = (px?: number | string) => {
    if (typeof px === 'number') return `${px / 192}rem`
    return px
}

/**
 * @name: 处理时间参数
 * @param {string} timeType 时间类型
 * @param {string} time 时间戳
 * @param isRange? 是否返回时间区间
 */
export const detailTimeRange = (timeType: 'now' | 'hour' | 'day' | 'week' | 'month' | 'year', time?: number, isRange?: boolean) => {
    let beginTime = 0; let endTime = 0; let queryTimeType = timeType; let dataTimeType = 0; let timeStr = ''
    if (timeType === 'year') {
        beginTime = isRange
            ? dayjs(time)
                .add(-3, 'years')
                .startOf('year')
                .valueOf()
            : dayjs(time).startOf('year').valueOf()
        endTime = dayjs(time)
            .endOf('year')
            .valueOf()
        dataTimeType = 1440
        queryTimeType = 'year'
        timeStr = '年'
    }
    if (timeType === 'now') {
        beginTime = isRange
            ? dayjs()
                .add(-23, 'hours')
                .startOf('hour')
                .valueOf()
            : dayjs().startOf('hour').valueOf()
        endTime = dayjs()
            .endOf('hour')
            .valueOf()
        dataTimeType = 60
        queryTimeType = 'hour'
        timeStr = '实时'
    }
    if (timeType === 'day') {
        beginTime = isRange
            ? dayjs(time)
                .add(-6, `${timeType}s`)
                .startOf(timeType)
                .valueOf()
            : dayjs(time).startOf(timeType).valueOf()
        endTime = dayjs(time)
            .endOf(timeType)
            .valueOf()
        dataTimeType = 1440
        queryTimeType = timeType
        timeStr = '日'
    }
    if (timeType === 'month') {
        beginTime = isRange
            ? dayjs(time)
                .add(-3, `${timeType}s`)
                .startOf(timeType)
                .valueOf()
            : dayjs(time).startOf(timeType).valueOf()
        endTime = dayjs(time)
            .endOf(timeType)
            .valueOf()
        dataTimeType = 1440
        queryTimeType = timeType
        timeStr = '月'
    }
    if (timeType === 'hour') {
        beginTime = isRange
            ? dayjs(time)
                .add(-12, `${timeType}s`)
                .startOf(timeType)
                .valueOf()
            : dayjs(time).startOf(timeType).valueOf()
        endTime = dayjs(time)
            .endOf(timeType)
            .valueOf()
        dataTimeType = 60
        queryTimeType = timeType
        timeStr = '小时'
    }
    if (timeType === 'week') {
        beginTime = isRange
            ? dayjs(time)
                .subtract(3, 'weeks')
                .startOf('week')
                .valueOf()
            : dayjs(time)
                .startOf('week')
                .valueOf()
        endTime
            = dayjs(time)
                .endOf('week')
                .valueOf()
        dataTimeType = 1440
        queryTimeType = timeType
        timeStr = '周'
    }
    return { beginTime, endTime, queryTimeType, dataTimeType, timeStr }
}
