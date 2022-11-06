/*
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-18 14:05:35
 * @Description:
 */
const contexts: any = import.meta.globEager('./module/**/*.ts') // module下的所有文件夹下的ts文件
const keyApi = Object.keys(contexts)
const Api: { [key: string]: any } = {}
keyApi.forEach((item: string) => {
    const keys: string = item.replace(/(\.\/module\/|\.ts)/g, '') // 去除末尾的.ts
    const apiModelName = keys.substring(keys.lastIndexOf('/') + 1)
    Api[apiModelName] = contexts[item]
})
export default Api
