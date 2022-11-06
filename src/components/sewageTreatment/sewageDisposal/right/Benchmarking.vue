<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 15:56:52
 * @Description:
-->
<template lang="pug">
commonPanel(title="标杆建设" :height='228' )
    template(#mainContent)
        .environmental-status
            .item-box.mgb16(v-for="(item, index) in list" :key="index" :class="[!index && popStore.getCurrentPop === 'BenchmarkingParkLayer' ? 'panel-checked-no-bg' : '']" @click="!index && popStore.upDatePopup({currentPop: 'BenchmarkingParkLayer'})")
                .top-value
                        span.value.num-32 {{getNumber(item.value)}}
                        span.unit {{item.unit}}
                img.left-img.mgb8(src="@/assets/images/sewageTreatment/delivery.png")
                .right-text
                    .top-label.bg-gra-label {{item.name}}
</template>

<script lang="ts" setup name="Benchmarking">
import { usePopStore } from '@/store/popControl'
import { getNumber } from '@/utils/tools'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '标杆生活小区', value: '10', unit: '个' },
        { name: '标杆园区', value: '10', unit: '个' },
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
    padding: 16px 12px 0;

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
            font-family: PingFangSC;
            font-size: 18px;
            font-weight: 500;
            line-height: 26px;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0;
        }

        // .value {
        //     font-family: Oswald;
        //     font-size: 32px;
        //     font-weight: normal;
        //     color: #fff;
        //     letter-spacing: 0;
        // }

        .top-label {
            font-family: PingFangSC;
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;

            /* 白色 */
            color: #fff;
            letter-spacing: 0;
        }

        .top-value {
            position: absolute;
            top: 4px;
        }
    }
}
</style>
