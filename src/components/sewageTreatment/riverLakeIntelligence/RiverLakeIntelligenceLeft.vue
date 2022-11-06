<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:39:30
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 11:22:42
 * @Description:
-->
<template lang="pug">
el-scrollbar.left-boxs
    ProtectionRiversReservoirs.mgb20
    commonPanel(title="河道智治" panelBg='panel-big' :height='308' :bigBgTop="14")
        template(#rightTitle)
            .right-title
                .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
        template(#mainContent)
            .video(@click="popStore.upDatePopup({currentPop: 'showRuleByRiver', popData: activeIndex})")
                img(src='@/assets/images/sewageTreatment/video.png')
</template>

<script lang="ts" setup>
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    toggleList: [
        { name: '云上巡航', value: '' },
        { name: '无人船巡查', value: '' }
    ],
    activeIndex: 0,
})
const changeNav = (index: number) => {
    data.activeIndex = index
}
const { toggleList, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.img-content {
    img {
        width: 400px;
    }
}

.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        height: 22px;
        padding: 0 10px;
        margin-left: 4px;
        line-height: 22px;
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

.left-boxs {
    position: absolute;
    top: 112px;
    left: 32px;
    z-index: 9;
    width: fit-content;
    height: calc(100% - 112px);

    .img-content {
        margin-bottom: 16px;

        & > img {
            width: 400px;
        }
    }

    .video {
        padding: 16px 20px;
        cursor: pointer;

        img {
            width: 100%;
            height: 208px;
        }
    }
}
</style>
