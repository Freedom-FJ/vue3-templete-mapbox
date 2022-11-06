<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 11:23:40
 * @Description:
-->
<template>
    <div class="container">
        <div class="select-box" :class="[isShowBack ? 'select-box-father' : '']" :style="boxStyle" @click.stop="clickSelect">
            <div class="label" :style="labelStyle">
                <span v-show="activeIndex !== -1">{{ label }}</span>
                <span v-show="activeIndex === -1" class="placeholder">{{ placeholder }}</span>
            </div>
            <div v-if="arrow === 'box'" class="arrow-white tran05" :class="isShowOption ? 'ro-180' : ''" />
            <div v-if="arrow === 'line'" class="arrow-line tran05" :class="isShowOption ? 'arrow-line-ro' : ''" />
        </div><transition name="height-to-down">
            <el-scrollbar v-show="isShowOption" :id="id" ref="optionListDom" class="option-list" :style="selectBoxStyle">
                <div v-for="(item, index) in option" :key="index" class="select-item" :style="selectItemStyle" :class="[activeIndex === index ? 'select-item-check' : '']" @click="clickCurrItem(item, index)">
                    {{ item.selectLabel || item.label }}
                </div>
            </el-scrollbar>
        </transition>
    </div>
</template>

<script lang="ts" setup name="SelectPanel">
import type { PropType } from 'vue'
import type { selectPanelTs } from '@/types/common'

const props = defineProps({
    /**
     * 配置项用于生成表格
     */
    option: {
        type: Array as PropType<selectPanelTs[]>,
        default: () => {
            return []
        }
    },
    /**
     * 默认选择index
     */
    defaultSelect: {
        type: Number,
        default: undefined
    },
    boxStyle: {
        type: Object,
        default: undefined
    },
    labelStyle: {
        type: Object,
        default: undefined
    },
    selectBoxStyle: {
        type: Object,
        default: undefined
    },
    selectItemStyle: {
        type: Object,
        default: undefined
    },
    placeholder: {
        type: String,
        default: ''
    },
    /**
     * 箭头类型
     */
    arrow: {
        type: String as PropType<'box' | 'line'>,
        default: 'box'
    },
    /**
     * 箭头大小比例
     */
    arrowScale: {
        type: Number,
        default: 1
    },
    /**
     * 是否显示背景
     */
    isShowBack: {
        type: Boolean,
        default: false
    },
})
const emit = defineEmits(['change'])
const data = reactive({
    isShowOption: false,
    label: '--',
    activeIndex: 0,
    width: '65px',
    optionListDom: ref(),
    id: `optionList${Math.random()}`
})
const getWidth = (option: selectPanelTs[]) => {
    // const fontWidth = props.selectItemStyle?.fontSize ?? 14
    // const lengthList = option.map((item) => {
    //     const str = item.selectLabel || item.label
    //     if (str) return str.length
    //     return 0
    // })
    // let max = Math.max(...lengthList)
    // if (max < 3) max = 3
    // data.width = `${max * (fontWidth - 3) + 20 + 8}px`
}
watch(() => props.option, (val) => {
    if (val && val.length) {
        getWidth(val)
        if (props.defaultSelect === -1) {
            data.activeIndex = props.defaultSelect
        }
        else if (typeof props.defaultSelect === 'number') {
            const currData = val[props.defaultSelect]
            data.label = currData.label
            data.activeIndex = props.defaultSelect
        }
        else {
            data.label = val[0].label
            data.activeIndex = 0
        }
    }
}, { deep: true, immediate: true })
let listener: any
onMounted(() => {
    listener = document.addEventListener('mouseup', (e) => {
        const pop = document.getElementById(data.id)
        if (data.isShowOption && pop) {
            if (!pop.contains(e.target as Node)) {
                setTimeout(() => {
                    data.isShowOption = false
                })
            }
        }
    })
})
onUnmounted(() => {
    listener && listener.removeEventListener()
})

const clickSelect = () => {
    data.isShowOption = !data.isShowOption
}
/**
 * @name: table 获取表格列数据
 * @param {*} item 当前列对象
 * @param {*} index 索引
 */
const clickCurrItem = (item: selectPanelTs, index: number) => {
    data.activeIndex = index
    data.isShowOption = false
    data.label = item.label
    emit('change', item, index)
}
const selectListHeight = computed(() => {
    return props.selectBoxStyle ? props.selectBoxStyle.height || '116px' : '116px'
})

const buttomMax = computed(() => {
    return `-${selectListHeight.value + 4}px`
})
const buttomMin = computed(() => {
    return '-4px'
})
const { isShowOption, label, activeIndex, optionListDom, id, width } = toRefs(data)
</script>

<style scoped lang="scss">
// 使用变量承接
$select-height: v-bind(selectListHeight);
$select-min: v-bind(buttomMin);
$select-max: v-bind(buttomMax);

.container {
    position: relative;
    width: 100%;

    .select-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .label {
            margin-right: 4px;
            overflow: hidden;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #fff;
            text-overflow: ellipsis;
            letter-spacing: 0;
            white-space: nowrap;
        }

        .arrow-white {
            width: 0;
            height: 0;
            border-top: 4px solid white;
            border-right: 4px solid transparent;
            border-bottom: 0 solid transparent;
            border-left: 4px solid transparent;
            transform: scale(v-bind(arrowScale));
        }
    }

    .placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .option-list {
        position: absolute;
        bottom: -120px;
        left: 50%;
        z-index: 15;
        width: fit-content;
        min-width: 60px;
        height: 116px;
        padding: 4px;
        background: #0a1824;
        border: 1px solid #286c9d;
        border-radius: 4px;
        transform: translateX(-50%);

        .select-item {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 3px 6px;
            margin-bottom: 4px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            color: #fff;
            white-space: nowrap;
            cursor: pointer;
            background: rgba(2, 48, 87, 0.5);
            border: 1px solid rgba(40, 108, 157, 0.2);
            border-radius: 4px;
        }

        .select-item-check {
            background: #008dce;
            border: 1px solid #00e5ff;
        }
    }

    .height-to-down-enter-from {
        bottom: -4px;
        height: 0 !important;
        transition: all 0.3s;
    }

    // 开始过渡了
    .height-to-down-enter-active {
        transition: all 0.3s;
    }

    // 过渡完成
    .height-to-down-enter-to {
        bottom: -120px;
        height: 116px !important;
        transition: all 0.3s;
    }

    // 离开的过渡
    .height-to-down-leave-from {
        bottom: -120px;
        height: 116px !important;
        transition: all 0.3s;
    }

    // 离开中过渡
    .height-to-down-leave-active {
        transition: all 0.3s;
    }

    // 离开完成
    .height-to-down-leave-to {
        bottom: -4px;
        height: 0 !important;
        transition: all 0.3s;
    }

    .arrow-line {
        width: 6px;
        height: 6px;
        margin-left: 4px;
        border-right: 1px solid #60a2e1;
        border-bottom: 1px solid #60a2e1;
        transform: rotate(45deg) translateY(-50%) scale(v-bind(arrowScale));
        transform-origin: center;
    }

    .arrow-line-ro {
        transform: rotate(225deg) !important;
    }

    .select-box-father {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        // width: 120px;
        // height: 24px;
        width: 100%;
        height: 100%;
        padding: 5px 8px;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;

        .label {
            width: 95%;
        }
    }
}
</style>
