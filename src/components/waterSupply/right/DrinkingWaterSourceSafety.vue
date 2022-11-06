<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 21:06:44
 * @Description:
-->
<template lang="pug">
commonPanel(title="饮用水源安全" panelBg='panel-big' :height='176' :bigBgTop="14")
    template(#mainContent)
        .river-level
            .river-box-bad(:class="[popStore.getCurrentPop === 'ReminderTodayPop' && popStore.popData === 0  ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop: 'ReminderTodayPop', popData: 0})")
                .border
                img.left-icon(src="@/assets/images/waterControlCab/bad-v-icon.png")
                .right-value
                    .top-title 今日预警
                    .value-num-red 0
            .river-box(:class="[popStore.getCurrentPop === 'ReminderTodayPop'  && popStore.popData === 1 ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop: 'ReminderTodayPop', popData: 1})")
                .border
                img.left-icon(src="@/assets/images/waterControlCab/v-icon.png")
                .right-value
                    .top-title 历史预警
                    .value-num 3
</template>

<script lang="ts" setup>
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    subTitle: '（最新）',
    activeIndex: -1
})
const { activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.river-level {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 20px 12px 0 12px;
    cursor: pointer;

    .river-box,
    .river-box-bad {
        position: relative;
        display: flex;
        align-items: center;
        width: 164px;
        height: 72px;
        padding-left: 16px;
        background-color: #2e2414;
        border-top: 1px solid rgb(238 142 0 / 1);
        border-bottom: 1px solid rgb(238 142 0 / 1);

        .left-icon {
            width: 52px;
            height: 52px;
            margin-right: 20px;
        }

        .right-value {
            .top-title {
                margin-bottom: 8px;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
                letter-spacing: 0;
            }

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(255 224 98 / 1));
                -webkit-background-clip: text;
                background-clip: text;
            }

            .value-num-red {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), #faa);
                -webkit-background-clip: text;
                background-clip: text;
            }
        }

        .border::after {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, #ee8e00 0%, rgb(0 0 0 / 0) 100%);
        }

        .border::before {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, #ee8e00 0%, rgb(0 0 0 / 0) 100%);
        }
    }

    .river-box::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 10px;
        content: "";
        background: linear-gradient(180deg, #ee8e00 0%, rgb(0 0 0 / 0) 100%);
    }

    .river-box::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 10px;
        content: "";
        background: linear-gradient(180deg, #ee8e00 0%, rgb(0 0 0 / 0) 100%);
    }

    .river-box-bad {
        background-color: #311a1a;
        border-top: 1px solid rgb(255 79 96 / 1);
        border-bottom: 1px solid rgb(255 79 96 / 1);

        .border::after {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, #ff4f60 0%, rgb(0 0 0 / 0) 100%);
        }

        .border::before {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, #ff4f60 0%, rgb(0 0 0 / 0) 100%);
        }
    }

    .river-box-bad::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 10px;
        content: "";
        background: linear-gradient(180deg, #ff4f60 0%, rgb(0 0 0 / 0) 100%);
    }

    .river-box-bad::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 10px;
        content: "";
        background: linear-gradient(180deg, #ff4f60 0%, rgb(0 0 0 / 0) 100%);
    }
}
</style>

