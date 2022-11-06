<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 12:26:23
 * @Description:
-->
<template lang="pug">
commonPanel(title="管网预警" :height='240' )
    template(#mainContent)
        .environmental-status
            .item-box.mgb16(v-for="(item, index) in list" :key="index")
                .top-value
                        span.value {{getNumber(item.value)}}
                        span.unit {{item.unit}}
                img.left-img.mgb8( src="@/assets/images/sewageTreatment/delivery.png")
                .right-text
                    .top-label.bg-gra-label {{item.name}}
</template>

<script lang="ts" setup name="Benchmarking">
import { getNumber } from '@/utils/tools'
const data = reactive({
    list: [
        { name: '预警数', value: '10', unit: '个' },
        { name: '处置率', value: '10', unit: '%' },
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
    padding: 10px 12px 0;

    .item-box {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 28px 10px 0;
        cursor: pointer;

        .left-img {
            flex: none;
            width: 138px;
        }

        .unit {
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0;
        }

        .value {
            font-family: Furore;
            font-size: 28px;
            font-weight: normal;
            line-height: 28px;
            color: #fff;
            letter-spacing: 0;
        }

        .top-label {
            font-family: PingFangSC;
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;
            color: #fff;
            letter-spacing: 0;
        }

        .top-value {
            position: absolute;
            top: 10px;
        }
    }
}
</style>
