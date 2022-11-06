<!--
 * @Author: mjh
 * @Date: 2022-10-18 09:55:31
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-18 09:58:19
 * @Description:
-->
<template>
    <div class="w-100">
        <div class="top-count mgb12 flex-bw-c">
            <div class="left-box">
                <div class="text-16">
                    党政督察发现
                </div>
            </div>
            <div class="right-box pdt20">
                <div class="t-c unit-14 mgb8">
                    已完成/问题数
                </div>
                <div class="bottom-value">
                    <span class="num-18 blue-0 mgr4 ">7583</span>
                    <span class="num-18">/7880</span>
                </div>
            </div>
        </div>
        <div class="live-park">
            <div v-for="(item, index) in unWaringThings" :key="index">
                <div class="flex-bw-c mgb16">
                    <span class="text-14">{{ item.name }}</span>
                    <div class="">
                        <span class="num-16 blue-0">{{ item.done }}</span>
                        <span class="num-16">/{{ item.total }}</span>
                    </div>
                </div>
                <div class="park-bar-box flex-bw-c mgb24">
                    <div class="park-bar">
                        <div class="park-bar-heart" :style="{ width: `${Math.round(item.done / item.total * 100)}px` }" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const data = reactive({
    unWaringThings: [
        { name: '中央交办', done: 10, total: 18 },
        { name: '省级交办', done: 48, total: 62 },
        { name: '杭州曝光问题', done: 106, total: 109 },
        { name: '市级主动发现', done: 841, total: 1017 },
        { name: '区县主动发现', done: 6578, total: 6674 }
    ],
})

const { unWaringThings } = toRefs(data)
</script>

<style lang="scss" scoped>
.top-count {
    padding: 0 30px;
}

.left-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 133px;
    height: 79px;
    padding-top: 20px;
    background-image: url(@/assets/images/sewageTreatment/backBlue.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.live-park {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 344px;
    height: 354px;
    padding: 12px 16px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 8px;

    .park-bar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 12px;
        padding: 3px 0;
        background: rgba(192, 196, 204, 0.1);

        & > div {
            width: 196px;
            height: 6px;
            background: linear-gradient(270deg, #0df 0%, rgba(0, 221, 255, 0) 100%);
        }
    }
}
</style>
