<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 15:47:32
 * @Description:
-->
<template lang="pug">
PopupPanel( :title="modelValue && modelValue.alarmName" :initClose="true" @close="close" :height="534" :width="536"  :right="-500" :top="-250" :left="'auto'" )
        .pabel-box.hw-100.pd16
            .top-text-box-panel.mgb16
                .top-text-box.mgb16
                    .text-label.text-14 报警时间：
                    .text-text.num-14  {{modelValue.alarmTimeStr}}
                .top-text-box.mgb16
                    .text-label.text-14 发生地点：
                    .text-text.text-14  {{modelValue.address}}
                .top-text-box.mgb16
                    .text-label.text-14 经纬度：
                    .text-text.num-14  {{modelValue.longitude}}，{{modelValue.latitude}}
                .top-text-box(v-if="modelValue.detailList")
                    .text-label.text-14 报警描述：
                    .text-text.num-14
                        span.blue {{modelValue.dataTimeStr}}
                        span 【超标报警】渔山在{{modelValue.detailList[0].factorName}}监测因子时数据浓度值为
                        span.blue {{modelValue.detailList[0].factorValue}}
                        span ，超标限值为
                        span.blue  {{modelValue.detailList[0].factorLimit}}
                        span ，报警等级为
                        span(:style="{color: modelValue.alarmLevelColor}") {{modelValue.alarmLevelName}}
                        span 。
            .bottom-process
                .process-btn.flex-c.mgb24
                    .btn-box.text-14.mgr4.cur(:class="[!currType ? 'btn-box-check' : '']" @click="checkType(0)") 处置过程
                    .btn-box.text-14.mgr4.cur(:class="[currType===1 ? 'btn-box-check' : '']"  @click="checkType(1)") 督办过程
                    .btn-box.text-14.cur(:class="[currType===2 ? 'btn-box-check' : '']"  @click="checkType(2)") 流程图
                el-scrollbar.process-detail(v-show="!currType")
                    .process-item.flex.w-100(v-for="(item,index) in taskInfoVoList" :key="index" )
                        .left-line
                            .top-ball.num-14(:style="{ backgroundColor: item.nodeStatus === 2 ? '#36F097' : '#F7C706'}") {{index+1}}
                            .bottom-line(v-show="index !== taskInfoVoList.length-1")
                        .rihgt-box
                            .right-title.text-16.blue.mgb8 {{item.nodeName}}
                            .body-detal.mgb10
                                .body-detail-line.flex-w
                                    .body-detail-item.flex.w-50.mgb6(v-if='item.nodeStatus == 2')
                                        div.text-14(style="min-width: 80px;") {{item.operateTypeName=='审核'?'审核人：':'处置人：'}}：
                                        div.text-14 {{item.actualOperatorName || '--'}}
                                    .body-detail-item.flex.w-50.mgb6(v-if='item.nodeStatus == 2')
                                        div.text-14(style="min-width: 80px;") 待处置人：
                                        div.text-14  {{item.assigneeName || '--'}}
                                    .body-detail-item.flex.w-50.mgb6
                                        div.text-14(style="min-width: 80px;") 接收时间：
                                        div.text-14 {{item.startTimeStr || '--'}}
                                    .body-detail-item.flex.w-50.mgb6(v-if='item.nodeStatus == 2')
                                        div.text-14(style="min-width: 80px;") {{item.operateTypeName=='审核'?'审核时间':'处置时间：'}}：
                                        div.text-14  {{item.endTimeStr || '--'}}
                                    .body-detail-item.flex.w-50.mgb6
                                        div.text-14(style="min-width: 80px;") {{item.operateTypeName=='审核'?'审核耗时':'处置耗时：'}}：
                                        div.text-14  {{item.useTime || '--'}}

                                    template(v-for="items in item.commitDataInfo" :key="item.id")
                                        .body-detail-item.flex.w-50.mgb6(v-if="!['imgIds', 'files', 'pictures'].includes(items.code)")
                                            div.text-14(style="min-width: 80px;") {{items.name}}：
                                            div.text-14 {{items.data}}
                                        .body-detail-item.w-50.mgb6(v-if="items.code === 'imgIds' || items.code === 'pictures'")
                                            div.text-14.mgb6 {{items.name}}：
                                            el-image.mgr-20(v-for='(sItem,eindex) in detailImg(items.data)' :key="eindex" style='width: 80px;height: 80px;' :src='sItem' :preview-src-list='detailImg(items.data)')
                                        .body-detail-item.w-50.mgb6(v-if="items.code === 'files'")
                                            div.text-14.mgb6 {{items.name}}：
                                            div.files(v-for='link, lIdx in  detailFile(items.data)' :key='lIdx' @click='fileDownload(link.id)') {{link.name}}
                el-scrollbar.process-detail(v-show="currType===1")
                    div 暂无数据
                el-scrollbar.process-detail(v-show="currType===2")
                    img(src="@/assets/images/img.png")
</template>

<script lang="ts" setup name="WarningCheckPop">
import dayjs from 'dayjs'
import type { alarmFlowApiTs } from './types'
import Config from '@/config'
import service from '@/service/api'
const props = defineProps({
    modelValue: {
        type: Object,
        default: null
    }
})
const emit = defineEmits(['update:modelValue'])
console.log('-------')
const { fileServer } = Config
const data = reactive({
    currType: 0,
    detailList: [
        { index: 2, name: '治水办', people: '胡小新', phone: '15790908799', color: '#F7C706' },
        { index: 1, name: '监测站', people: '李运泉', phone: '15790908799', color: '#36F097', time: '2021-01-27', detail: '已复核', long: '1小时4分钟' },
        { index: 0, name: '运维人员现场核查', people: '胡军军', phone: '15790908799', color: '#36F097', time: '2021-01-27', detail: '设备无问题，现场水质偏差', long: '1小时4分钟' }
    ],
    taskInfoVoList: [] as record[], // 处置过程
    superviseInfo: [] as record[], // 督办流程
    processDiagramCode: [] as record[], // 流程图参数
    currentNode: {
        missionId: '',
        nodeName: '',
        assigneeName: '',
        processTaskId: '',
        id: '',
        envTypeCode: '',
    }
})

/**
 * @name: 地图弹框事件
 * @param {*} item
 * @param {*} index
 */
const checkType = (index: number) => {
    data.currType = index
}

const getCheckDetail = async () => {
    // 切换至新的API
    const res = await service<alarmFlowApiTs>('waterQuality/alarmFlow', { id: props.modelValue.id })
    const resData = res.data
    if (!resData) return
    // 预警信息
    if (resData.taskInfo && resData.taskInfo.length) {
        data.currentNode = {
            missionId: resData.taskInfo[resData.taskInfo.length - 1].missionId,
            nodeName: resData.taskInfo[resData.taskInfo.length - 1].nodeName,
            assigneeName: resData.taskInfo[resData.taskInfo.length - 1].assigneeName,
            processTaskId: resData.taskInfo[resData.taskInfo.length - 1].processTaskId,
            id: props.modelValue.id, // ID
            envTypeCode: props.modelValue.envTypeCode // 环境要素
        }
    }
    // await checkAuth(data.currentNode.missionId)
    const taskInfoVoList: record[] = []
    if (resData.taskInfo) {
        resData.taskInfo.forEach((item) => {
            const commitData = item.commitDataInfo || []
            const imgIds: string[] = []
            const filesList: { name: string; id: string }[] = []
            const picList: string[] = []
            commitData.forEach((item: {
                code: string
                data: string
            }) => {
                if (item.code === 'imgIds') {
                    // 现场照片
                    const ids: { id: string }[] = JSON.parse(item.data) || []
                    ids.forEach((idObj) => {
                        imgIds.push(`${fileServer}${idObj.id}`)
                    })
                }
                if (item.code === 'pictures') {
                    // 现场照片
                    const ids: { id: string }[] = JSON.parse(item.data) || []
                    ids.forEach((idObj) => {
                        picList.push(`${fileServer}${idObj.id}`)
                    })
                }
                // 上传附件
                if (item.code === 'files') {
                    const files: { id: string;name: string }[] = JSON.parse(item.data) || []
                    files.forEach((idObj) => {
                        const obj = {
                            name: idObj.name,
                            id: `${fileServer}${idObj.id}`
                        }
                        filesList.push(obj)
                    })
                }
            })
            taskInfoVoList.push({
                ...item,
                imgIds,
                picList,
                filesList,
                disposalTime: item.disposalTime && item.disposalTime !== '0' ? dayjs(Number(item.disposalTime)).format('YYYY-MM-DD HH:mm') : '--'
            })
        })
    }

    data.taskInfoVoList = taskInfoVoList
    console.log(data.taskInfoVoList, 'data.taskInfoVoList')
    // 督办流程
    data.superviseInfo = resData.superviseInfo
    // 流程图参数
    if (resData.missionInfo) data.processDiagramCode = resData.missionInfo.missionFields.processInstanceId
    console.log(taskInfoVoList, 'taskInfoVoList')
    // getSuperviseDetail() // 获取督办详情数据
    // if (data.currentBtnIndex === 0)
    //     getNodeList()

    // else
    //     getNodeList('supervise')
}
/**
 * @name: 显示图片列表
 * @param {*} val 图标data
 */
const detailImg = computed(() => (val: string | { id: string }[]) => {
    if (typeof val === 'string') val = JSON.parse(val)
    if (typeof val === 'string') return []
    return val.map(item => `${fileServer}${item.id}`)
})

const detailFile = computed(() => (val: string | { id: string;name: string }[]) => {
    if (typeof val === 'string') val = JSON.parse(val)
    if (typeof val === 'string') return []
    return val.map((item) => {
        return {
            name: item.name,
            id: `${fileServer}${item.id}`
        }
    })
})
/**
 * 附件下载
 * @param item
 */
const fileDownload = (id: string) => {
    console.log(id, 'id')
    window.open(id, 'down-file')
}
/**
 * 督办按钮是否展示，根据bsp权限以及数据接口判断
 * @param id
 * @return {Promise<void>}
 */
// const checkAuth = async (id) => {
//     const params = [id]
//     const { data } = await this.$service.eventControl.getAuth(params)
//     if (data)
//         this.showBtn = window.ISOPERATE && data[this.currentNode.missionId]
// }

const close = () => {
    emit('update:modelValue', null)
}
data.detailList.reverse()
watchEffect(() => {
    getCheckDetail()
})
const { taskInfoVoList, currType, detailList } = toRefs(data)
</script>

<style scoped lang="scss">
.top-text-box {
    display: flex;
    width: 100%;

    // align-items: center;
    .text-label {
        width: 72px;
        line-height: 20px !important;
        text-align: right;
    }

    .text-text {
        width: 420px;
        line-height: 20px !important;
    }
}

.files {
    color: rgb(180, 214, 219);
    cursor: pointer;

    &:hover {
        color: #0df;
    }
}

.btn-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    background: #002950;
    border-radius: 4px;
}

.btn-box-check {
    box-sizing: border-box;
    background: #008dce;
    border: 1px solid #00e5ff;
}

.left-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 35px;
    transform: translateX(-5px);
}

.process-detail {
    height: 230px;
}

.rihgt-box {
    width: calc(100% - 35px);
}

.top-ball {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 12px;
}

.bottom-line {
    flex: none;
    width: 3px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
