<template lang="pug">
commonPanel(title="涝水智排" :height='184')
    template(#mainContent)
        .logging-list
            .list-one(v-for="(item, index) in labelList" :key="item.label" :class="[popStore.getCurrentPop ==='PondingPopup' && currIndex === index ? 'panel-checked' : '']" @click="checkTab(index)")
                .num(:style='{backgroundImage: `url(${getAssetsFile(`waterControlCab/${item.value ? "lsbg" : "lsbg-red"}.png`)})`}')
                    span {{item.value}}
                .text {{item.label}}
</template>

<script lang="ts" setup name="waterlogging-discharge">
import { getAssetsFile } from '@/utils/tools'
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()

const cabData = reactive({
    title: '智慧治污',
    subTitle: '（2022）',
    panelBg: 'panel-big',
    height: 708,
    labelList: [
        { value: 125, label: '积水点数量' },
        { value: 0, label: '积水点位预警' },
        { value: 0, label: '其他内涝事件️' },
    ],
    currIndex: -1
})
watch(() => popStore.getCurrentPop, (val) => {
    val !== 'PondingPopup' && (cabData.currIndex = -1)
})
/**
 * @name: 面板点击事件
 * @desc: 控制内容见 WaterControlCab文件 以及pinia popControl内
 * @param index 索引
 */
const checkTab = (index: number) => {
    if (cabData.currIndex === index) {
        cabData.currIndex = -1
        popStore.upDatePopup({ currentPop: '', popData: '' })
        return
    }
    cabData.currIndex = index
    popStore.upDatePopup({ currentPop: 'PondingPopup', popData: '' })
}

const { labelList, currIndex } = toRefs(cabData)
</script>

<style lang="scss" scoped>
.logging-list {
    display: flex;
    justify-content: space-between;

    .list-one {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 118px;
        padding-top: 20px;

        .num {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            margin-bottom: 4px;
            font-family: Furore;
            font-size: 28px;
            text-shadow: 0 2px 4px 0 #000;
            background: url(@/assets/images/waterControlCab/lsbg.png) no-repeat;
            background-size: 100% 100%;

            span {
                color: transparent;
                background: linear-gradient(to bottom, #fff, #92f4ff);
                -webkit-background-clip: text;
                background-clip: text;
            }
        }

        .text {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            padding: 0 12px;
            font-family: TRENDS;
            background: linear-gradient(180deg, rgba(0, 255, 255, 0) 29%, rgba(0, 255, 255, 0.1) 32%, rgba(0, 255, 255, 0.1) 70%, rgba(0, 255, 255, 0) 73%);
        }

        .text::before {
            position: absolute;
            left: 0;
            width: 2px;
            height: 20px;
            content: "";
            background: #2f80ed;
        }

        .text::after {
            position: absolute;
            right: 0;
            width: 2px;
            height: 20px;
            content: "";
            background: #2f80ed;
        }
    }
}
</style>
