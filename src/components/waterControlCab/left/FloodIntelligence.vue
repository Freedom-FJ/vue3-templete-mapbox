<template lang="pug">
commonPanel(title="洪水智防" subTitle='（最新）' :height='192')
    template(#mainContent)
        .flood-intelligence
            .left-warn
                .text
                    .label 山洪预警
                    .val 0
            .right
                .exceed-item(v-for='item, index in list' :key="item.name" :class="[popStore.getCurrentPop ==='FloodProtectionPopup' && !index ? 'panel-checked' : '']" @click="checkTab(index)")
                    .border
                    img(:src='getAssetsFile(`waterControlCab/flood-${index}.png`)')
                    .label {{item.name}}
                    .value
                        span {{item.exceed}}
                        span /{{item.total}}
</template>

<script lang="ts" setup name="flood-intelligence">
import { getAssetsFile } from '@/utils/tools'
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '雨量超警', total: 70, exceed: 10 },
        { name: '水位超保', total: 70, exceed: 3 },
        { name: '水库超限', total: 70, exceed: 2 }
    ]
})

/**
 * @name: 面板点击事件
 * @desc: 控制内容见 WaterControlCab文件 以及pinia popControl内
 * @param {*} index
 */
const checkTab = (index: number) => {
    !index && popStore.upDatePopup({ currentPop: 'FloodProtectionPopup' })
}
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.left-warn {
    width: 112px;
    height: 96px;
    background-image: url(@/assets/images/WaterSaving/vortex.svg); // 当成背景引入
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    margin-top: 20px;
    margin-right: 40px;
    .text {
        position: absolute;
        right: -10px;
        top: -10px;
        text-align: center;
        .label {
            font-family: TRENDS;
            font-size: 16px;
            margin-bottom: 4px;
        }
        .val {
            font-family: Furore;
            font-size: 28px;
            color: transparent;
            background: linear-gradient(to bottom, #fff, #FFDADA);
            -webkit-background-clip: text;
            background-clip: text;
        }
    }
}
.flood-intelligence {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px 0;
    .right {
        flex: 1;
    }
    .exceed-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 36px;
        margin-bottom: 8px;
        background: linear-gradient(0deg, rgba(0,166,255,0.20) 0%, rgba(0,191,255,0.21) 39%, rgba(0,229,255,0.00) 100%);
        border-top: 1px solid rgba(0, 166, 255, 0.4);
        border-bottom: 1px solid rgba(0, 166, 255, 0.4);

        img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }

        .label {
            font-family: TRENDS;
            font-size: 14px;
            margin-right: 30px;
        }

        .value {
            span:nth-child(1) {
                margin-right: 2px;
                font-family: Furore;
                font-size: 18px;
                color: #f84439;
            }

            span:nth-child(2) {
                font-family: Furore;
                font-size: 16px;
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }

    .exceed-item::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 8px;
        content: "";
        background: linear-gradient(180deg, rgba(0, 166, 255, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }

    .exceed-item::after {
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 8px;
        content: "";
        background: linear-gradient(180deg, rgba(0, 166, 255, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }

    .border {
        position: absolute;
        width: 100%;
        height: 36px;
    }

    .border::before {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 8px;
        content: "";
        background: linear-gradient(0deg, rgba(0, 166, 255, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }

    .border::after {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 1px;
        height: 8px;
        content: "";
        background: linear-gradient(0deg, rgba(0, 166, 255, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }
}
</style>
