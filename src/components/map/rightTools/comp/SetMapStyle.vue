<!--
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 18:09:18
 * @Description:
-->
<template lang="pug">
.map-style.bf-blur
    .map-bg
    .map-select
        .map-text
            span 地图选择
            img(src='@/assets/images/map/close.png' @click="closePop")
        el-radio-group.map-radio(v-model='currentStyle' @change="changeStyle")
            el-radio(label='default') 默认
            el-radio(label='img') 卫星影像
</template>

<script lang="ts" setup name="set-map-style">
import { useCommonStore } from '@/store/common'
/**
 * 关闭弹框事件
 */
const emit = defineEmits(['close-pop', 'change-map-style'])
const { currentMapStyle } = storeToRefs(useCommonStore())
const data = reactive({
    currentStyle: currentMapStyle,
})
const closePop = () => {
    emit('close-pop', false)
}
/**
 * 切换地图模式
 */
const changeStyle = (val: string | number | boolean) => {
    useCommonStore().changeMapStyle(val)
    emit('change-map-style', val)
}
const { currentStyle } = toRefs(data)
</script>

<style lang="scss" scoped>
.map-style {
    position: absolute;
    right: 530px;
    bottom: 0;
    z-index: 99;
    width: 128px;
    height: 128px;
    background: url(@/assets/images/panel/tools-bg.png) no-repeat;
    background-size: 100% 100%;

    .map-select {
        position: absolute;
        width: 128px;

        .map-text {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: calc(100% - 16px);
            height: 40px;
            padding: 0 8px;
            margin: 0 8px;
            font-family: TRENDS;
            font-size: 14px;
            border-bottom: 1px solid rgba(7, 131, 250, 0.5);

            img {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
        }

        .map-radio {
            padding: 0 16px;
        }

        .el-radio {
            height: 40px;
            font-family: TRENDS;
            font-size: 14px;
            color: #fff;

            :deep(.el-radio__input.is-checked+.el-radio__label) {
                color: #0df;
            }

            :deep(.el-radio__input.is-checked .el-radio__inner) {
                background: #0df;
                border-color: #0df;
            }
        }
    }
}
</style>
