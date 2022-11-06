/*
 * @Author: Tian
 * @Date: 2021-11-02 15:52:24
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-15 10:18:06
 * @Description:
 */
import type { AxiosRequestHeaders } from 'axios'
import axios from '@/utils/request'
export default class Request {
    /**
     * get方法
     * @param {string} url 路径
     * @param {object} params 参数
     */
    static get = (
        url: string,
        params?: object,
        headers?: AxiosRequestHeaders,
        proxy?: string
    ) => {
        axios.setBaseUrl && axios.setBaseUrl(proxy)
        return new Promise((resolve, reject) => {
            axios
                .get(url, { params, headers })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    static post = (
        url: string,
        params?: object,
        headers?: AxiosRequestHeaders,
        proxy?: string
    ) => {
        axios.setBaseUrl && axios.setBaseUrl(proxy)
        return new Promise((resolve, reject) => {
            axios
                .post(url, params, { headers })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    static put = (url: string, params?: object, headers?: AxiosRequestHeaders, proxy?: string) => {
        axios.setBaseUrl && axios.setBaseUrl(proxy)
        return new Promise((resolve, reject) => {
            axios
                .put(url, { params })
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}
