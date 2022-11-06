<!--
 * @Author: mjh
 * @Date: 2022-08-29 19:45:16
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-10 20:05:42
 * @Description:
-->
<template lang="pug">
commonPanel(title="供水智保" :subTitle='subTitle' :height='216')
    template(#mainContent)
        .supply-content
            .supply-one(v-for='item, index in list' :key='index')
                .left
                    img(:src='getAssetsFile(`waterControlCab/icon-${index}.png`)')
                .right
                    .text {{item.label}}
                    .value(:style='{color: item.color}') {{item.value}}
</template>

<script lang="ts" setup name="smart-water-supply">
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
import { getAssetsFile } from '@/utils/tools'

const popStore = usePopStore()
const global = inject(globalKey)
const supplyData = reactive({
    subTitle: `（${global?.dayjs().format('YYYY')}）`,
    list: [
        { label: '生活用水保障率', value: '47.6%', color: '#06F7A1' },
        { label: '生产用水保障率', value: '47.6%', color: '#00DDFF' },
        { label: '饮用水源藻类预警', value: '20', color: '#00DDFF' },
        { label: '旱情预警', value: '120', color: '#F7C706' },
    ]
})

/**
 * @name: 面板点击事件
 * @desc: 控制内容见 WaterControlCab文件 以及pinia popControl内
 */
const checkTab = () => {
    popStore.upDatePopup({ currentPop: 'FloodPopup', popData: '' })
}
const { subTitle, list } = toRefs(supplyData)
</script>

<style lang="scss" scoped>
.supply-content {
    display: flex;
    justify-content: space-between;
    padding: 16px 6px 0 6px;
    flex-wrap: wrap;
    .supply-one {
        display: flex;
        // align-items: center;
        border-radius: 4px;
        background: rgba(0, 47, 93, 0.3);
        box-sizing: border-box;
        border: 1px solid #00366A;
        width: 170px;
        height: 64px;
        margin-bottom: 12px;
        padding: 10px 0 0 12px;
        .left {
            margin-right: 12px;
            img {
                width: 40px;
                height: 40px;
            }
        }
        .right {
            .text {
                font-family: TRENDS;
                font-size: 12px;
                margin-bottom: 10px;
            }
            .value {
                font-family: Furore;
                font-size: 20px;
            }
        }
    }
}
</style>
