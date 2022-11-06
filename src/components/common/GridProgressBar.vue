<!--
 * @Author: mjh
 * @Date: 2022-08-29 09:23:11
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 11:11:14
 * @Description:
-->
<template>
    <div
        ref="gridBarDom" class="grid-progress-bar" :style="{
            backgroundColor,
            flexDirection: baseLine === 'height' ? 'column-reverse' : 'row',

        }"
    >
        <div
            v-if="gridNum" class="check-box" :style="{
                height: baseLine === 'height' ? `${getCurrCheckNum * (gridWidth + gridMid) - gridMid}px` : undefined,
                width: baseLine === 'width' ? `${getCurrCheckNum * (gridWidth + gridMid) - gridMid}px` : undefined,
                display: baseLine === 'width' ? 'flex' : '',
                backgroundColor: checkBoxBack,
            }"
        >
            <div
                v-for="(index) in getCurrCheckNum" :key="index" class="check-bar" :style="{
                    height: baseLine === 'height' ? `${gridWidth}px` : undefined,
                    width: baseLine === 'width' ? `${gridWidth}px` : undefined,
                    background: getCheckColor(index),
                    marginRight: baseLine === 'width' ? `${gridMid}px` : '',
                    marginBottom: baseLine === 'height' ? `${gridMid}px` : '',
                    transform: `rotate(${gridRotate}deg)`,
                    ...gridStyle,
                }"
            />
        </div>
        <div
            v-if="gridNum" class="default-box" :style="{
                height: baseLine === 'height' ? `${(gridNum - getCurrCheckNum) * (gridWidth + gridMid) + gridMid}px` : undefined,
                width: baseLine === 'width' ? `${(gridNum - getCurrCheckNum) * (gridWidth + gridMid) + gridMid}px` : undefined,
                display: baseLine === 'width' ? 'flex' : '',
                backgroundColor: defaultBoxBack,
            }"
        >
            <div
                v-for="(index) in new Array(gridNum - getCurrCheckNum)" :key="index" class="default-bar" :style="{
                    height: baseLine === 'height' ? `${gridWidth}px` : undefined,
                    width: baseLine === 'width' ? `${gridWidth}px` : undefined,
                    marginLeft: baseLine === 'width' ? `${gridMid}px` : '',
                    marginBottom: baseLine === 'height' ? `${gridMid}px` : '',
                    background: defaultColor,
                    transform: `rotate(${gridRotate}deg)`,
                    ...gridStyle,
                }"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
    /**
     * 0~100之间的数字
     */
    value: {
        type: Number,
        default: 0
    },
    /**
     * 选中格子的颜色
     */
    checkColor: {
        type: String,
        default: ''
    },
    /**
     * 选中区域的颜色
     */
    checkBoxBack: {
        type: String,
        default: ''
    },
    /**
     * 不选中格子的颜色
     */
    defaultColor: {
        type: String,
        default: ''
    },
    /**
     * 未选择区域的颜色
     */
    defaultBoxBack: {
        type: String,
        default: ''
    },
    /**
     * 格子的样式
     */
    gridStyle: {
        type: Object,
        default: () => {
            return {}
        }
    },
    /**
     * 格子的宽度
     */
    gridWidth: {
        type: Number,
        default: 0
    },
    /**
     * 格子间隔
     */
    gridMid: {
        type: Number,
        default: 0
    },
    /**
     * 整个背景色
     */
    backgroundColor: {
        type: String,
        default: ''
    },
    /**
     * 表格进度条是横向的还是竖的
     */
    baseLine: {
        type: String as PropType<'height' | 'width'>,
        default: 'height'
    },
    /**
     * 格子倾斜角度
     */
    gridRotate: {
        type: Number,
        default: 0
    },
    /**
     * 渐变开始颜色 (不支持透明度的颜色)
     */
    linearStartColor: {
        type: String,
        default: ''
    },
    /**
     * 渐变结束颜色 (不支持透明度的颜色)
     */
    linearEndColor: {
        type: String,
        default: ''
    }

})
const data = reactive({
    gridBarDom: ref(),
    hiddenGride: 0,
    barHeight: 0,
    currCheckNum: 0,
    gridNum: 0,
    linearColorList: []
})
/**
 * @name 获取选中格子数
 * @param index 索引
 * @computed
 */
const getCurrCheckNum = computed(() => {
    const height = data.gridBarDom?.offsetHeight ?? 0
    const width = data.gridBarDom?.offsetWidth ?? 0
    const isHeight = props.baseLine === 'height'
    const useValue = isHeight ? height : width
    const gridNum = Math.ceil((useValue + props.gridMid) / ((props.gridMid || 0) + (props.gridWidth || 0)))
    data.gridNum = gridNum
    const currCheckNum = Math.round(gridNum / 100 * props.value)
    data.currCheckNum = currCheckNum
    return currCheckNum
})

/**
 * @name 获取当前格子选中颜色
 * @param index 索引
 * @computed
 */
const getCheckColor = computed(() => (index: number) => {
    if (props.linearEndColor && props.linearStartColor) {
        if (!data.currCheckNum) return ''
        const colorList = gradientColors(props.linearStartColor, props.linearEndColor, data.currCheckNum + 1)
        const color = `linear-gradient(to ${props.baseLine === 'height' ? 'top' : 'right'}, ${colorList[index - 1]}, ${colorList[index]})`
        return color
    }
    else { return props.checkColor }
})
onMounted(() => {
    const height = data.gridBarDom?.offsetHeight ?? 0
    const width = data.gridBarDom?.offsetWidth ?? 0
    const isHeight = props.baseLine === 'height'
    const useValue = isHeight ? height : width
    const gridNum = Math.ceil((useValue + props.gridMid) / ((props.gridMid || 0) + (props.gridWidth || 0)))
    data.gridNum = gridNum
    const currCheckNum = Math.round(gridNum / 100 * props.value)
    data.currCheckNum = currCheckNum
})

/**
 * @name 获取渐变色数组
 * @param start 开始颜色
 * @param end 结束颜色
 * @param steps 颜色数量
 */
const gradientColors = function (start: string, end: string, steps: number, gamma?: number) {
    const output = []; const so = []
    let i, j, ms, me
    gamma = gamma || 1
    const normalize = function (channel: number) {
        return (channel / 255) ** (gamma || 1)
    }
    const startColor = !start.includes('rgb') ? start : colorRGBtoHex(start)
    const endColor = !end.includes('rgb') ? end : colorRGBtoHex(end)
    const startNum = parseColor(startColor as string).map(normalize)
    const endNum = parseColor(endColor as string).map(normalize)
    for (i = 0; i < steps; i++) {
        ms = i / (steps - 1)
        me = 1 - ms
        for (j = 0; j < 3; j++)
            so[j] = pad(Math.round((startNum[j] * me + endNum[j] * ms) ** (1 / gamma) * 255).toString(16))

        output.push(`#${so.join('')}`)
    }
    return output
}

const parseColor = function (hexStr: string) {
    return hexStr.length === 4
        ? hexStr.substr(1).split('').map((s) => {
            return 0x11 * parseInt(s, 16)
        })
        : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map((s) => {
            return parseInt(s, 16)
        })
}

const colorRGBtoHex = (color: string) => {
    const rgb = color.split(',')
    const r = parseInt(rgb[0].split('(')[1])
    const g = parseInt(rgb[1])
    const b = parseInt(rgb[2].split(')')[0])
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    return hex
}
const pad = function (s: string) {
    return (s.length === 1) ? `0${s}` : s
}
const { gridBarDom, gridNum } = toRefs(data)
</script>

<style lang="scss" scoped>
.grid-progress-bar {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .check-box {
        .check-bar:last-child {
            margin-right: 0 !important;
            margin-bottom: 0 !important;
        }

        .check-bar {
            width: 100%;
            height: 100%;
        }
    }

    .default-box {
        .default-bar {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
