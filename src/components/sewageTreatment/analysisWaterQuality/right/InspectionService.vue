<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:19:28
 * @Description:
-->
<template lang="pug">
commonPanel(title="巡查服务" panelBg='panel-1' :height='376')
    template(#mainContent)
        .center-box(@click="showInspectPop")
            .top-box.mgb16
                .top-line.flex-bw-c.mgb10(v-if='false')
                    .left-text.text-14 无人船巡查
                    .right-btn.text-12.flex-c-c 发起巡查
                .right-title
                    .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click.stop='changeNav(index)' :key="item.name") {{item.name}}
                .bottom-line.flex-bw-c
                    .left-box
                        img(src="@/assets/images/sewageTreatment/video.png")
                    .right-box(v-if='false')
                        img(src="@/assets/images/sewageTreatment/group.png")
                        .bottom-label.t-c
                            span.text-14 巡查统计
</template>

<script setup lang="ts">
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    toggleList: [
        { name: '无人船巡查', value: '' },
        { name: '云上巡航', value: '' }
    ],
    activeIndex: 0,
})
const changeNav = (index: number) => {
    data.activeIndex = index
}

onMounted(() => {
    //
})
const showInspectPop = () => {
    popStore.upDatePopup({ currentPop: 'showOrHideInspectPop', popData: data.activeIndex })
}

const { toggleList, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-title {
    display: flex;
    margin-bottom: 12px;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        height: 24px;
        padding: 0 10px;
        margin-left: 4px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .active {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.center-box {
    padding: 16px 0;
}

.top-box {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 186px;
    padding: 12px 16px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;

    .right-btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 68px;
        height: 24px;
        cursor: pointer;
        background: #008dce;
        border: 1px solid #00e5ff;
        border-radius: 4px;
    }

    .bottom-line {
        width: 100%;
        height: 128px;

        .left-box {
            width: 100%;
            height: 100%;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .right-box {
            width: 100px;
            height: 100%;

            img {
                width: 100%;
                height: 100.68px;
                transform: translate(5px, -12px);
            }

            .bottom-label {
                display: flex;
                flex-direction: column;
                width: 88px;
                height: 28px;
                padding: 7px 16px;
                margin: 0 auto;
                background: radial-gradient(49% 49% at 50% 0%, rgba(0, 126, 255, 0.7) 0%, rgba(0, 126, 255, 0.19) 47%, rgba(0, 126, 255, 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgba(0, 48, 97, 0) 100%), linear-gradient(90deg, rgba(0, 48, 97, 0) 0%, #003061 50%, rgba(0, 48, 97, 0) 99%);
                transform: translateY(-8px);
            }
        }
    }
}

.bottom-box {
    box-sizing: border-box;
    width: 100%;
    height: 94px;
    padding: 16px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;

    .btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 106px;
        height: 32px;
        padding: 9px 16px;
        border-radius: 4px;
    }
}
</style>

