/*
 * @Author: Tian
 * @Date: 2021-11-01 09:57:44
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-20 16:19:29
 * @Description:
 */
const innerNet
    = process.env.NODE_ENV === 'development'
        ? true
        : /^(0|127|172|localhost)/.test(location.hostname)
const domain = innerNet ? '/api' : `${location.protocol}//${location.host}`
// const defaultHost = 'http://wgms.dev.fpi-inc.site'
const defaultHost = 'http://yhwszz.fpi-inc.site'

const commonConfig = {
    gridCode: '01000000',
    defaultServer: 'wgmsService', // 请求默认服务
    cityCode: '330100',
    defaultRouteName: '/waterControlCab',
    loginUrl: `${innerNet ? defaultHost : domain}/cas/login`,
    webHomePage: innerNet ? `127.0.0.1:${location.port}` : `${domain}/yuhang-screen-web`,
    logoutUrl: `${innerNet ? defaultHost : domain}/cas/logout`,
    userBaseURL: `${innerNet ? defaultHost : domain}/simple-user-center-server`,
    fileServer: `${innerNet ? defaultHost : domain}/file-base-server/api/v1/sys/download/`,
    innerNet
}
const { webHomePage, loginUrl, userBaseURL } = commonConfig
const webHomePageStr = encodeURIComponent(webHomePage)
// 未登录，跳转到cas登录地址
const bspURL = `${loginUrl}?service=${userBaseURL}/userCenter/auth/authUser?redirectUrl=${webHomePageStr}`

export default {
    ...commonConfig,
    domain,
    bspURL
}
