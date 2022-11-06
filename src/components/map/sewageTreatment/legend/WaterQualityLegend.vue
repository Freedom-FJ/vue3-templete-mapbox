<!--
 * @Author: Tian
 * @Date: 2022-09-05 18:19:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-26 19:28:15
 * @Description:
-->
<template lang="pug">
.water-legend
    .legend-one(v-for='item in level' :key="item.level" :class="[!currCheckList.includes(item.level) ? 'isCheck' : '']" @click="checkLegend(item.level)")
        .circle(:class='`circle-${item.level}`')
        .text {{item.label}}
    div.mgr16
    el-checkbox( label="水流向" v-model="isShowWaterFlow")
    el-checkbox( label="水插值" v-model="isShowWaterInterpolation")
    el-checkbox-group(v-model="handleList" @change="changeHandleType")
        el-checkbox( label="自动站" value="0")
        el-checkbox( label="手工站" value="1")
</template>

<script lang="ts" setup>
import type { CheckboxValueType } from 'element-plus'
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
    handleList: [], // 手工自动
    currCheckList: [] as strNum[]
})
data.currCheckList = data.level.map(item => item.level)
const checkLegend = (val: strNum) => {
    if (data.currCheckList.find(item => item === val))
        data.currCheckList = data.currCheckList.filter(item => item !== val)
    else data.currCheckList.push(val)
}
const changeHandleType = (val: CheckboxValueType[]) => {
    console.log(val, 'handle')
}
const { level, currCheckList, handleList, isShowWaterInterpolation, isShowWaterFlow } = toRefs(data)
</script>

<style lang="scss" scoped>
.water-legend {
    position: absolute;
    bottom: 32px;
    left: 464px;
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
