<!--
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-16 15:20:23
 * @Description:
-->
<template lang="pug">
.water-index.bf-blur
    .index-item(v-for='(item, index) in list' :key='item.key' @click='goPage(item)')
        img(:src='getAssetsFile(`waterControlCab/${item.key}.svg`)')
        .value
            .label(:class='`color-${item.level}`') {{item.name}}
            .num(:class='`num-color-${item.level}`') {{item.value}}
</template>

<script setup lang="ts" name="water-control-center">
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'
import { getAssetsFile } from '@/utils/tools'
defineProps({
    list: {
        type: Array as PropType<any[]>,
        default: () => {
            return []
        }
    }
})
const emit = defineEmits(['change'])
const router = useRouter()
const goPage = (item: {
            name: string
            value: string
            key: string
            path: string
},) => {
    emit('change', item)
    router.push(item.path)
}
</script>

<style lang="scss" scoped>
.water-index {
    position: absolute;
    top: 112px;
    left: 26%;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 48%;
    height: 96px;
    padding: 0 29px;
    background: url(@/assets/images/waterControlCab/zsbg.png);
    background-size: 100% 100%;

    .index-item {
        display: flex;
        cursor: pointer;

        img {
            width: 64px;
            height: 64px;
            margin-right: 12px;
        }

        .value {
            padding-top: 2px;

            .label {
                // color: #A9ECFF;
                margin-bottom: 6px;
                font-family: PangMenZhengDao;
                font-size: 20px;
            }

            .color-1 {
                color: #27cfff;
            }

            .color-2 {
                color: #36f097;
            }

            .color-3 {
                color: #f7c706;
            }

            .color-4 {
                color: #ff8000;
            }

            .color-5 {
                color: #f84439;
            }

            .num {
                font-family: Furore;
                font-size: 28px;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
            }

            .num-color-0 {
                color: #eafbff;
            }

            .num-color-1 {
                background-image: linear-gradient(to bottom, #eafbff, #00b7ff);
            }

            .num-color-2 {
                background-image: linear-gradient(to bottom, #fff, #36f097);
            }

            .num-color-3 {
                background-image: linear-gradient(to bottom, #fff, #f7c706);
            }

            .num-color-4 {
                background-image: linear-gradient(to bottom, #fff, #ff8000);
            }

            .num-color-5 {
                background-image: linear-gradient(to bottom, #fff, #f84439);
            }
        }
    }
}
</style>
