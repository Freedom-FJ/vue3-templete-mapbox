<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 10:28:46
 * @Description:
-->
<template lang="pug">
commonPanel(title="年度任务" :height='228' )
    template(#mainContent)
        .environmental-status
            .hidden-box.mgb16(v-for="(item, index) in list" :key="index" :style="{ backgroundImage: getAssetsFile(`sewageTreatment/${item.img}.png`)}")
                .item-box
                    .right-text
                        .top-label.text-16.t-c {{item.name}}
                        .value.num-24.mg-auto {{getNumber(item.value)}}
</template>

<script lang="ts" setup name="CapitalInput">
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '任务书', value: '35', img: 'backBlue' },
        { name: '未完成', value: '32', img: 'backYellow' },
        { name: '已完成', value: '3', img: 'backGreen' },
    ],
})
onMounted(() => {
    //
})
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 60px 0 0;

    .hidden-box:nth-child(1) {
        .item-box {
            background-image: url(../../../../assets/images/sewageTreatment/backBlue.png);

            .value {
                color: transparent;
                background: linear-gradient(to bottom, #fff, #62d3ff);
                -webkit-background-clip: text;
            }
        }
    }

    .hidden-box:nth-child(2) {
        .item-box {
            background-image: url(../../../../assets/images/sewageTreatment/backYellow.png);
        }

        .value {
            color: transparent;
            background: linear-gradient(to bottom, #fff, #ffe062);
            -webkit-background-clip: text;
        }
    }

    .hidden-box:nth-child(3) {
        .item-box {
            background-image: url(../../../../assets/images/sewageTreatment/backGreen.png);
        }

        .value {
            color: transparent;
            background: linear-gradient(to bottom, #fff, #62ffc3);
            -webkit-background-clip: text;
        }
    }

    .hidden-box {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 116px;
        height: 120px;
        overflow: hidden;
    }

    .top-label {
        margin-bottom: 20px;
    }

    .item-box {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 193px;
        height: 90px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;

        .left-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 133px;
            height: 79px;
        }

        .right-text {
            margin-top: -14px;
        }

        .unit {
            margin-left: 4px;
            font-family: TRENDS;
            font-size: 12px;
            font-weight: normal;
            line-height: 12px;
            color: rgb(255 255 255 / 70%);
            letter-spacing: 0;
        }
    }
}
</style>
