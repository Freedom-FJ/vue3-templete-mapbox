<!--
 * @Author: mjh
 * @Date: 2022-08-19 09:31:37
 * @LastEditors: mjh
 * @LastEditTime: 2022-08-29 09:27:05
 * @Description: 
-->
# Vue 3 + TypeScript + Vite
# node 16.4.0  
# npm 7.18.1
# 安装完依赖后需重新打开vscode文件错误提示就会消失

# api请求说明

## 基础用法
*** api对象配置 *** 
例如：在publicMap.ts文件夹下的
//危废联单列表
jointDetail: {
    path: '/solid-waste/joint-detail', // 请求地址
    server: 'wgmsService', // 服务可以不配置 config会有默认服务  服务对应地址见baseServe文件夹
    method: 'get' // 类型可以省略 默认get请求
    params: { // 请求参数
        jointNumber: string // 请求参数对应的类型
    },
    headers: { // 请求头传惨
        config: 'test'
    }
}

*** 请求使用 ***
import service from '@/service/api'
service('publicMap/jointDetail', { jointNumber: '123456' }).then(res => {})
const res = await service('publicMap/jointDetail', { jointNumber: '123456' })
*** service方法共有四个参数 ***
path  代表api对象文件在service/apis/module文件夹下的文件地址 + / + 对应的api配置对象名称
params  请求传参
headers 请求头对象 优先级高于api配置对象内的headers，会覆盖后者
type  特殊效果关键字 目前就只有 intercept 关键字 代表此接口在特殊时间内需要拦截会被推入pinia内的全局拦截栈
只需要调用pinia的axios内的clearIntercept方法即可进行拦截请求并清空拦截栈

## 基础用法-范型支持返回数据类型
const res = await service<{ id: string }>('publicMap/jointDetail', { jointNumber: '123456' })
此时res的类型就是如下
{
    code: string
    data: null | { id: string }
    message: string
}
当接口较为不规范时，后端没有封装数据包裹在data内，类型需要直接返回则使用范型第二个关键字传true
const res = await service<{ id: string }, true>('publicMap/jointDetail', { jointNumber: '123456' })
此时res类型为： { id: string }

## params介绍
params内的参数不写则最终请求不会携带
params支持类型 any, null, undefined, date, object, array, string, number, boolean // any类型不类型监测
params: { // 请求参数
    jointNumber: string // 请求参数对应的类型
}
当参数可能有多种类型时，可以使用数组包裹，效果类似于vue的props的type定义
params: { // 请求参数
    jointNumber: [string, number] // 类型可能为string或者number
}
post请求数组型传参
params: [ number ] // 当有多种类型时也可以多几个类型写入其中
const res = await service('publicMap/jointDetail',[ 15, 26 ])
## 全地址请求
当检测到path内的地址是http开头时，此请求不会拼接服务等，会直接请求
getJsonTest: {
    path: 'https://gis-dev.fpi-inc.site/interpolation-file-server/api/v1/sys/download/interpolation/118/mlhy/2022/02/12/aqi_2022021210.png'
    params: {
        id: 15
    }
}
## 特殊拼接地址--使用pathExpr参数
pathExpr优先级高于path
jointDetail: {
    pathExpr: '/solid-waste/joint-detail/{{id}}', // 可替换传参变量
    server: 'wgmsService',
    params: {
        jointNumber: string
    }
}
const res = await service<{ id: string }, true>('publicMap/jointDetail', { jointNumber: '123456', id: 6 })
最终地址为 /solid-waste/joint-detail/6?jointNumber=123456

## 本地调试特殊需求需要部分接口代理不同的地址 比如后端人员的本地局域网地址
只需要在vite.config内加入特殊的proxy关键字
然后在你配置对象内使用proxy参数
getCascaderareaData: {
    path: '/api/v1.0/client/region/queryByCode',
    server: 'wgmsBaseServer',
    proxy: '/dev',
    params: {
        code: string
    }
}
此次请求的axios的baseUrl就会变成 /dev 则可以触发代理
