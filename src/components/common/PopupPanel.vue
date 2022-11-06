<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-20 14:21:59
 * @Description:
-->
<template lang="pug">
.popup-container.bf-blur.panel-pop(
    :class="[type]"
    :style="{ height: pxToRem(height), width: pxToRem(width), right: pxToRem(right), left: pxToRem(left), top: pxToRem(top), bottom: pxToRem(bottom), position: isMapPop ? 'static' : 'absolute' }")
    .common-bg
    .pop-body
        .title-line(:style="{ height: pxToRem(titleHeight)}")
            slot(name="title")
                .left-title.text-14 {{title}}
            .close(@click='close')
        slot
</template>

<script lang="ts" setup name="BadVRiverPopup">
import type { PropType } from 'vue'
import { pxToRem } from '@/utils/tools'
import { usePopStore } from '@/store/popControl'
import MapUtil from '@/utils/map/mapUtils'

const props = defineProps({
    /**
     * 标题
     */
    title: {
        type: String,
        default: ''
    },
    /**
     * 高度
     */
    height: {
        type: [Number, String],
        default: undefined
    },
    /**
     * 宽度
     */
    width: {
        type: [Number, String],
        default: undefined
    },
    /**
     * title高度
     */
    titleHeight: {
        type: [Number, String],
        default: undefined
    },
    type: {
        type: String as PropType<'left' | 'right'>,
        default: 'left'
    },
    /**
     * 是否是地图弹框
     */
    isMapPop: {
        type: Boolean,
        default: false
    },
    /**
     * 动画名称
     */
    name: {
        type: String,
        default: 'opacity-left'
    },
    top: {
        type: [Number, String],
        default: undefined
    },
    left: {
        type: [Number, String],
        default: undefined
    },
    right: {
        type: [Number, String],
        default: undefined
    },
    bottom: {
        type: [Number, String],
        default: undefined
    },
    /**
     * 自定义close方法
     */
    initClose: {
        type: Boolean,
        default: false
    },
})
const $emit = defineEmits(['close'])
const popStore = usePopStore()
/**
 * @name: 面板关闭事件
 * @emit close
 */
const close = () => {
    $emit('close')
    if (!props.initClose) {
        if (!props.isMapPop) popStore.initPop()
        else MapUtil._removeMapboxPopup()
    }
}
</script>

<style scoped lang="scss">
.left {
    left: 320px;
}

.right {
    right: 320px;
}

.popup-container {
    position: absolute;
    top: 160px;
    width: 288px;
    border-top: 30px solid;
    border-right: 8px solid;
    border-bottom: 30px solid;
    border-left: 8px solid;
    border-image-source: url(@/assets/images/panel/panel-1.png);
    border-image-slice: 30 8 30 8 fill;
}

.panel-pop {
    max-height: 800px;

    .pop-body {
        margin-top: -25px;
    }

    .title-line {
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        padding: 0 16px;
        border-color: rgba(7, 131, 250, 0.5);
        border-style: solid;
        border-width: 0 0 1px;
    }

    .close {
        position: relative;
        width: 12px;
        height: 12px;
        cursor: pointer;
    }

    .close::before {
        position: absolute;
        top: 0;
        left: 37%;
        width: 2px;
        height: 13px;
        content: "";
        background-color: #007ab2;
        transform: rotate(45deg);
    }

    .close::after {
        position: absolute;
        top: 0;
        left: 37%;
        width: 2px;
        height: 13px;
        content: "";
        background-color: #007ab2;
        transform: rotate(-45deg);
    }
}
</style>
