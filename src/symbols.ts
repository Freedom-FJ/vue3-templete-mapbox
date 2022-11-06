/*
 * @Author: Tian
 * @Date: 2022-06-13 19:39:46
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:36:42
 * @Description:
 */
import type { InjectionKey } from 'vue'
import type { getApiTs, typeLimit } from './types/service'
import type { HangZhouUserInfoTs, changeHangZhouUserInfoTs, globalTs } from '@/types/common'
/** 全局的信息 InjectionKey */
export const globalKey: InjectionKey<globalTs> = Symbol()
export const serviceKey: InjectionKey<getApiTs> = Symbol()
export const hangZhouKey: InjectionKey<HangZhouUserInfoTs> = Symbol()
export const changeHangZhouKey: InjectionKey<changeHangZhouUserInfoTs> = Symbol()
export const defaultService: getApiTs = (
    url: string,
    params?: record,
    header?: record,
    type?: typeLimit
) => {
    return console.log('service方法注入失败') as any
}

// inject 默认方法
export const defaultChangeHangZhouKey = (val: { token: string; authorization: string }) => {
    console.warn(val, 'changeHangZhouKey方法未注入')
}
