<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:24:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 13:53:07
 * @Description:
-->
<template lang="pug">
commonPanel(title="藻类监控" panelBg='panel-1' :height='228')
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .alage-content
            .top
                .item
                    img(src='@/assets/images/sewageTreatment/today.png')
                    .right
                        .text 今日监测
                        .num
                            span(style='color: #FF9902;') {{monitorData.todayMonitor}}
                            span 个
                .item(:class="[popStore.getCurrentPop === 'ReminderTodayPop' ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop: 'ReminderTodayPop', popData: activeIndex})")
                    img(src='@/assets/images/sewageTreatment/today.png')
                    .right
                        .text 今日提醒
                        .num
                            span {{monitorData.todayRemind}}
                            span 次
            .bottom
                span 累计提醒
                span {{monitorData.total}}
                span 次
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import service from '@/service/api'
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    toggleList: [
        { name: '自动', value: '' },
        { name: '手工', value: '' }
    ],
    activeIndex: 0,
    monitorData: {
        todayMonitor: '0',
        todayRemind: '0',
        total: '0'
    }
})
const changeNav = (index: number) => {
    data.activeIndex = index
    getAlgaeMonitorData()
}
/**
 * 获取藻类监控数据--自动or手工
 */
const getAlgaeMonitorData = async () => {
    const { data: todayData } = await service<{ data: {
        over: string
        total: string
    } }, true>(data.activeIndex ? 'drinkingWaterSource/algaeOverStatHandle' : 'drinkingWaterSource/algaeOverStat', {
        begin: dayjs().startOf('day').valueOf(),
        end: dayjs().add(1, 'days').startOf('day').valueOf(),
        timeType: data.activeIndex ? 'day' : ''
    })
    const { data: totalData } = await service<{ data: {
        over: string
        total: string
    } }, true>(data.activeIndex ? 'drinkingWaterSource/algaeOverStatHandle' : 'drinkingWaterSource/algaeOverStat', {
        begin: dayjs().startOf('year').valueOf(),
        end: dayjs().add(1, 'days').startOf('day').valueOf(),
        timeType: data.activeIndex ? 'day' : ''
    })
    data.monitorData.todayMonitor = todayData.total
    data.monitorData.todayRemind = todayData.over
    data.monitorData.total = totalData.total
}
onMounted(() => {
    getAlgaeMonitorData()
})
const { toggleList, activeIndex, monitorData } = toRefs(data)
</script>

<style scoped lang="scss">
.alage-content {
    padding-top: 16px;

    .top {
        display: flex;
        justify-content: space-between;

        .item {
            display: flex;
            width: 178px;
            height: 96px;
            padding-top: 20px;
            padding-left: 12px;
            cursor: pointer;
            background: rgba(0, 47, 93, 0.3);
            border: 1px solid #00366a;
            border-radius: 4px;

            img {
                width: 72px;
                height: 56px;
                margin-right: 12px;
            }

            .right {
                .text {
                    margin-bottom: 4px;
                    font-family: TRENDS;
                    font-size: 16px;
                }

                .num {
                    span:nth-child(1) {
                        margin-right: 4px;
                        font-family: Furore;
                        font-size: 32px;
                    }

                    span:nth-child(2) {
                        font-family: TRENDS;
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                }
            }
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        margin-top: 16px;
        font-family: TRENDS;
        font-size: 18px;
        background: radial-gradient(49% 49% at 50% 0%, rgba(0, 126, 255, 0.7) 0%, rgba(0, 126, 255, 0.19) 47%, rgba(0, 126, 255, 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgba(0, 48, 97, 0) 100%), linear-gradient(90deg, rgba(0, 48, 97, 0) 0%, #003061 50%, rgba(0, 48, 97, 0) 99%);

        // border-top: 1px solid linear-gradient(0deg, #00D4FF 0%, rgba(0, 0, 0, 0) 100%);;
        // border-bottom: 1px solid #34A4FF;
        span:nth-child(2) {
            margin: 0 4px 0 10px;
            font-family: Furore;
            font-size: 20px;
        }

        span:nth-child(3) {
            font-family: TRENDS;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }
    }
}

.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        width: 44px;
        height: 22px;
        margin-left: 4px;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .active {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}
</style>
