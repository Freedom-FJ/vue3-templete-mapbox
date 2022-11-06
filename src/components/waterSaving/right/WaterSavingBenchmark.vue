<!--
 * @Author: mjh
 * @Date: 2022-10-10 15:21:15
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-16 15:21:11
 * @Description:
-->
<template lang="pug">
commonPanel(title="节水标杆"  panelBg='panel-big' :height='200' :bigBgTop="14")
    template(#mainContent)
        .logging-list
            .list-one(v-for="(item, index) in labelList" :key="item.label" :class="[popStore.getCurrentPop ==='PondingPopup' && currIndex === index ? 'panel-checked' : '']" @click="checkTab(index)")
                .num
                    span {{item.value}}
                .text {{item.label}}
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'

const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    labelList: [
        { value: 23, label: '省级节水型企业' },
        { value: 1, label: '省级节水型标杆企业' },
    ],
    currIndex: 0
})

onMounted(() => {
    //
})
const checkTab = (val: any) => {
    //
}
const { labelList, currIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.logging-list {
    display: flex;
    justify-content: space-between;
    width: 85%;
    margin: 0 auto;

    .list-one {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 135px;
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
            font-size: 12px;
            background: linear-gradient(180deg, rgba(0, 255, 255, 0) 29%, rgba(0, 255, 255, 0.1) 32%, rgba(0, 255, 255, 0.1) 70%, rgba(0, 255, 255, 0) 73%);
        }

        .text::before {
            position: absolute;
            left: 0;
            width: 1px;
            height: 16px;
            content: "";
            background: #2f80ed;
        }

        .text::after {
            position: absolute;
            right: 0;
            width: 1px;
            height: 16px;
            content: "";
            background: #2f80ed;
        }
    }
}
</style>

