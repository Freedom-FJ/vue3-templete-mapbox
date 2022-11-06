<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 18:03:08
 * @Description:
-->
<template lang="pug">
commonPanel(title="资金投入" :height='368' panelBg='panel-big')
    template(#mainContent)
        .environmental-status
            .hidden-box.mgb16(v-for="(item, index) in list" :key="index" :style="{ backgroundImage: getAssetsFile(`sewageTreatment/${item.img}.png`)}")
                .item-box
                    .right-text
                        .top-label.text-14.mgb8.t-c {{item.name}}
                        .value.num-20 {{getNumber(item.value)}}
            .down-rank.w-100
                .down-rank-title.text-16.mgb13 下级排名
                .bottom-rank-box
                    .rank-line.flex-bw-c.w-100.mgb12(v-for="(item,index) in rankList" :key="index")
                        .rank-title.text-14.flex-1 {{item.name}}
                        .rank-bar.flex-9
                            .rank-blue
                            .rank-yellow
                            .rank-green
                        .rank-value.num-14.flex-1  {{item.value}}
</template>

<script lang="ts" setup name="CapitalInput">
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '工业园区', value: '1254', img: 'backBlue' },
        { name: '生活小区', value: '2146', img: 'backYellow' },
        { name: '镇街', value: '2146', img: 'backGreen' },
    ],
    rankList: [
        { name: '中泰', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '闲林', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '余杭', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '仓前', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '五常', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '径山', yellow: '30%', blue: '40%', green: '40%', value: 94 }
    ]
})
onMounted(() => {
    //
})
const { list, rankList } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 20px 0 0;

    .hidden-box:nth-child(1) {
        .item-box {
            background-image: url(@/assets/images/sewageTreatment/backBlue.png);

            .value {
                color: transparent;
                background: linear-gradient(to bottom, #fff, #62d3ff);
                -webkit-background-clip: text;
            }
        }
    }

    .hidden-box:nth-child(2) {
        .item-box {
            background-image: url(@/assets/images/sewageTreatment/backYellow.png);
        }

        .value {
            color: transparent;
            background: linear-gradient(to bottom, #fff, #ffe062);
            -webkit-background-clip: text;
        }
    }

    .hidden-box:nth-child(3) {
        .item-box {
            background-image: url(@/assets/images/sewageTreatment/backGreen.png);
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
        height: 68px;
        overflow: hidden;
    }

    .item-box {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 133px;
        height: 79px;
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .left-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 133px;
            height: 79px;
        }

        .right-text {
            padding-top: 4px;
        }

        .unit {
            margin-left: 4px;
            font-family: TRENDS;
            font-size: 12px;
            font-weight: normal;
            line-height: 12px;

            /* 白色 */
            color: rgba(255, 255, 255, 0.7);
            letter-spacing: 0;
        }
    }

    .down-rank {
        padding: 0 18px;
    }

    .rank-bar {
        display: flex;
        align-items: center;
        padding: 0 4px 0 9px;

        & > div {
            flex: none;
        }

        .rank-blue {
            flex-grow: 1;
            height: 6px;
            background: linear-gradient(270deg, #02c6fc 0%, #1381dc 100%);
        }

        .rank-yellow {
            flex-grow: 1;
            height: 6px;
            background: linear-gradient(270deg, #fc9802 5%, #d97000 100%);
        }

        .rank-green {
            flex-grow: 1;
            height: 6px;
            background: linear-gradient(270deg, #36eaaf 5%, #4bd2a3 100%);
        }
    }
}
</style>
