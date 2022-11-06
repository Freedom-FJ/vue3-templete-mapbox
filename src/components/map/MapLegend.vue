<!--
 * @Author: Tian
 * @Date: 2022-09-05 18:19:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 20:45:50
 * @Description:
-->
<template lang="pug">
.water-legend.bf-blur
    .legend-one(v-for='item in level' :key="item.level" :class="[!currCheckList.includes(item.level) ? 'isCheck' : '']" @dblclick="dbClickLegend(item.level)" @click="checkLegend(item.level)")
        .circle(:class='`circle-${item.level}`')
        .text {{item.label}}
    div.mgr16
    el-checkbox( label="水流向" v-model="isShowWaterFlow" @change="controlWaterFlow(isShowWaterFlow)")
    el-checkbox( label="水插值" v-model="isShowWaterInterpolation" @change="controlWaterInterpolation(isShowWaterInterpolation)")
    el-checkbox-group(v-model="handleList" @change="changeHandleType" v-if='showMonitorMethods')
        el-checkbox( label="0" ) 自动站
        el-checkbox( label="1" ) 手工站
</template>

<script lang="ts" setup>
import type { CheckboxValueType } from 'element-plus'
import { useRouter } from 'vue-router'
import { controlWaterFlow, controlWaterInterpolation, loadGeomData } from './mapLegendControl'
import { useMapStore } from '@/store/map'
import { globalKey } from '@/symbols'
const emit = defineEmits(['monitoringMethodsChange', 'controlLevelChange'])
const global = inject(globalKey)
const router = useRouter()
const data = reactive({
    level: [
        { label: 'I类', level: 1 },
        { label: 'II类', level: 2 },
        { label: 'III类', level: 3 },
        { label: 'IV类', level: 4 },
        { label: 'V类', level: 5 },
        { label: '劣V类', level: 6 },
    ],
    isShowWaterFlow: false,
    isShowWaterInterpolation: true,
    handleList: ['1', '0'], // 手工自动
    currCheckList: [] as strNum[],
    showMonitorMethods: false
})
/**
 * 监听治水驾驶仓页面统计、点位tab切换，统计时不显示自动、手工复选框
 */
global?.emitter.on('showOrHideMonitorMethods', (flag: number) => {
    data.showMonitorMethods = !!flag
})
/**
 * 监听路由变化，waterControlCab页面默认不显示手工、自动复选
 */
watch(
    () => router.currentRoute.value,
    (val) => {
        data.showMonitorMethods = !val.path.includes('waterControlCab')
    }
)
/**
 * 监听地图加载完成事件
 */
const mapStore = useMapStore()
watch(() => mapStore.getMapLoaded, (val) => {
    val && loadGeomData(data.isShowWaterInterpolation)
}, { immediate: true })

data.currCheckList = data.level.map(item => item.level)
let levelClickTimer: null | NodeJS.Timeout = null
/**
 * @name: 筛选点位水质等级
 * @param {*} val 等级数字
 */
const checkLegend = (val: number) => {
    if (levelClickTimer)
        clearTimeout(levelClickTimer)

    levelClickTimer = setTimeout(() => {
        if (data.currCheckList.find(item => item === val))
            data.currCheckList = data.currCheckList.filter(item => item !== val)
        else data.currCheckList.push(val)
        emit('controlLevelChange', data.currCheckList)
        levelClickTimer = null
    }, 300)
}
/**
 * @name: 双击水质等级
 * @param {*} val 等级数字
 */
const dbClickLegend = (val: number) => {
    if (levelClickTimer)
        clearTimeout(levelClickTimer)
    levelClickTimer = null
    if (data.currCheckList.join('') === val.toString()) data.currCheckList = data.level.map(item => item.level)
    else data.currCheckList = [val]
    emit('controlLevelChange', data.currCheckList)
}
const changeHandleType = (val: CheckboxValueType[]) => {
    emit('monitoringMethodsChange', val)
}
const { level, currCheckList, handleList, isShowWaterInterpolation, isShowWaterFlow, showMonitorMethods } = toRefs(data)
</script>

<style lang="scss" scoped>
.water-legend {
    position: absolute;
    right: 524px;
    bottom: 32px;
    z-index: 9;
    display: flex;
    align-items: center;

    ::v-deep() .el-checkbox__label {
        font-family: TRENDS;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;
        color: #a9ecff;
        text-align: center;
        letter-spacing: 0;
    }

    ::v-deep() .el-checkbox__inner {
        // background: #008dce;
        background: #001823;
        border: 1px solid #00547b;
        opacity: 0.5;
    }

    ::v-deep().el-checkbox {
        margin-right: 16px;
    }

    ::v-deep().is-checked {
        & > .el-checkbox__inner {
            box-sizing: border-box;
            background: #008dce;
            border: 1px solid #00e5ff;
            opacity: 1;
        }
    }

    .legend-one {
        display: flex;
        align-items: center;
        margin-right: 8px;
        cursor: pointer;

        .circle {
            width: 12px;
            height: 12px;
            border-radius: 16px;
        }

        .text {
            margin-left: 8px;
            font-family: TRENDS;
            font-size: 14px;
        }

        .circle-1 {
            background: rgba(0, 90, 118, 0.9);
            border: 1px solid #02fafc;
            box-shadow: 0 2px 6px 0 rgba(0, 255, 240, 0.5), inset 0 1px 4px 0 #3fe1ff, inset 0 1px 9px 0 #59ffff;
        }

        .circle-2 {
            background: rgba(0, 68, 255, 0.9);
            border: 1px solid #75c1ff;
            box-shadow: 0 2px 6px 0 rgba(77, 118, 255, 0.5), inset 0 1px 4px 0 #3f8cff, inset 0 1px 9px 0 #5990ff;
        }

        .circle-3 {
            background: rgba(0, 161, 48, 0.9);
            box-shadow: 0 2px 6px 0 rgba(0, 255, 85, 0.5), inset 0 1px 4px 0 #3fffab, inset 0 1px 9px 0 #3fffab;
        }

        .circle-4 {
            background: rgba(172, 133, 24, 0.9);
            box-shadow: 0 2px 6px 0 rgba(255, 195, 0, 0.5), inset 0 1px 4px 0 #faff3f, inset 0 1px 9px 0 #ffed59;
        }

        .circle-5 {
            background: rgba(150, 63, 0, 0.9);
            border: 1px solid #ff973f;
            box-shadow: 0 2px 6px 0 rgba(255, 140, 0, 0.5), inset 0 1px 8px 0 #ff8330;
        }

        .circle-6 {
            background: rgba(155, 17, 17, 0.7);
            border: 1px solid #ff3a3a;
            box-shadow: 0 2px 6px 0 rgba(255, 0, 0, 0.5), inset 0 1px 8px 0 #ff2525;
        }
    }

    .isCheck {
        opacity: 0.5;
    }
}
</style>
