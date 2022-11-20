<!--
 * @Author: Tian
 * @Date: 2022-09-19 09:49:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 21:40:53
 * @Description:
-->
<template lang="pug">
.map-layer.bf-blur(ref='mapLayer')
    .map-bg
    .map-select
        .map-text
            span 图层
            img(src='@/assets/images/map/close.png' @click="closePop")
        el-scrollbar.layer-list
            .list-one(v-for='item, index in mapStore.getMapLayer' :key='index')
                .check-main
                    el-checkbox(
                        v-model="item.isCheckAll"
                        :indeterminate="item.indeterminate"
                        @change="handleCheckAllChange(item)") {{item.name}}
                    el-icon(:size='15' @click="item.isShowChild = !item.isShowChild" )
                        ArrowDown.arrow( :class="{ 'arrow-rotate': !item.isShowChild}")
                transition(name="height-down")
                    .check-flow-box(v-show='item.isShowChild')
                        el-checkbox-group(
                            v-model="item.checkedList"
                            @change="handleCheckedSitesChange(item)"
                        )
                            el-checkbox(v-for="station in item.children" :key="station.stationCodes" :label="station.stationCodes")
                                .layer-item
                                    .icon(v-if="currBoxImgStatus(item.stationCodes, station.stationCodes).isShow" :style='{backgroundImage: `url(${getAssetsFile(`map/point/${currBoxImgStatus(item.stationCodes, station.stationCodes).icon}.png`)})`}')
                                    .layer-name {{station.name}}
</template>

<script lang="ts" setup name="set-map-style">
import { useMapStore } from '@/store/map'
import type { LayerSelectItemTs } from '@/types/map'
import { getAssetsFile } from '@/utils/tools'
/**
 * 关闭弹框事件
 */
const emit = defineEmits(['close-layer-pop'])
const mapStore = useMapStore()

const currBoxImgStatus = computed(() => (fatherCode: string, childCode: string) => {
    const defaultImgStatus = {
        icon: '',
        isShow: false
    }
    switch (true) {
    case (fatherCode === '1' && childCode === '005'):
    case (fatherCode === '38'):
        break
    case (fatherCode === '1' && childCode === '002,003,004,005,006,007'):
        defaultImgStatus.isShow = true
        defaultImgStatus.icon = '008'
        break
    case (fatherCode === '40'):
        defaultImgStatus.isShow = true
        defaultImgStatus.icon = fatherCode
        break
    default:
        defaultImgStatus.isShow = true
        defaultImgStatus.icon = childCode
        break
    }
    return defaultImgStatus
})

const mapLayer = ref()

onMounted(() => {
    getHeight()
})
/**
 * 复选框全选
 */
const handleCheckAllChange = (val: LayerSelectItemTs) => {
    val.indeterminate = false
    if (!val.isCheckAll) {
        val.checkedList = []
    }
    else {
        const currList: string[] = []
        val.children.forEach((child) => {
            currList.push(child.stationCodes)
        })
        val.checkedList = currList
    }
}
/**
 * 复选框单个选中
 */
const handleCheckedSitesChange = (val: LayerSelectItemTs) => {
    if (val.checkedList.length === 0 || val.checkedList.length === val.children.length) {
        val.indeterminate = false
        val.isCheckAll = val.checkedList.length === val.children.length
    }
    else { val.indeterminate = true }
}

/**
 * 监听路由变化
 */
/**
 * 动态获取高度
 */
const getHeight = () => {
    nextTick()
    // 计算的高度
    const calculateHeight = document.documentElement.clientHeight - 360
    mapLayer.value.style.height = `${calculateHeight}px`
}

const closePop = () => {
    emit('close-layer-pop', false)
}
</script>

<style lang="scss" scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #00b4d0;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #00b4d0;
}

.map-layer {
    position: absolute;
    right: 530px;
    bottom: 60px;
    z-index: 14;
    width: 240px;
    height: 428px;

    // background: rgba(0,0,0,0.25);
    border-radius: 8px;

    .arrow {
        transition: all 0.5s;
    }

    .arrow-rotate {
        transform: rotate(180deg);
    }

    .check-flow-box {
        height: auto;
        overflow: hidden;
    }

    .map-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .map-select {
        position: absolute;
        width: 100%;
        height: 100%;

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

        .layer-list {
            height: calc(100% - 40px);
            padding: 8px 0;

            .check-main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 32px);
                height: 32px;
                padding: 0 8px;
                margin: 0 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;

                :deep(.el-checkbox) {
                    font-family: TRENDS;
                    font-size: 14px;
                    color: #fff;
                }

                .el-icon {
                    cursor: pointer;
                }
            }

            :deep(.el-checkbox-group) {
                padding: 0 24px;

                .el-checkbox {
                    width: 100%;

                    .el-checkbox__label {
                        color: #fff;

                        .icon {
                            background-color: rgba(255, 255, 255, 0.1);
                        }
                    }
                }

                .is-checked {
                    .el-checkbox__label {
                        color: #0df;

                        .icon {
                            background-color: rgba(0, 221, 255, 0.3);
                        }
                    }
                }
            }

            .layer-item {
                display: flex;
                align-items: center;
                font-family: TRENDS;
                font-size: 14px;

                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                    background-position: center center;

                    // background-image: url(@/assets/images/map/point/001.png);
                    background-size: 16px 16px;
                    border-radius: 12px;
                }
            }
        }
    }
}
</style>

