<!--
 * @Author: mjh
 * @Date: 2022-09-08 15:54:29
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-06 20:58:41
 * @Description:
-->
<template>
    <div class="left-boxs">
        <div class="img-content bf-blur flex">
            <div v-if="option.includes('year')" class="year-select mgr12 flex-c-c">
                <SelectPanel :option="selectYearList" arrow="line" :label-style="{ fontSize: '16px' }" :arrow-scale="1.2" :select-box-style="{ width: '128px' }" />
            </div>
            <div v-if="option.includes('area')" class="year-select mgr12 flex-c-c">
                <SelectPanel :option="selectAreaList" arrow="line" :label-style="{ fontSize: '16px' }" :arrow-scale="1.2" :select-box-style="{ width: '128px' }" />
            </div>
            <div v-if="option.includes('river')" class="year-select mgr12 flex-c-c">
                <SelectPanel :option="selectRiverList" arrow="line" :label-style="{ fontSize: '16px' }" :arrow-scale="1.2" :select-box-style="{ width: '128px' }" />
            </div>
            <div v-if="option.includes('control')" class="year-select mgr12 flex-bw-c">
                <span class="text-16 cur" :class="[!type ? 'curr-check' : '']" @click="checkType(0)">统计</span>
                <span class="text-16 cur" :class="[type ? 'curr-check' : '']" @click="checkType(1)">预警</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
    option: {
        type: Array as PropType<('year' | 'area' | 'river' | 'control')[]>,
        default: () => {
            return ['year', 'area', 'control']
        }
    },
    type: {
        type: Number,
        default: 0
    }
})
const emit = defineEmits(['update:type'])
const data = reactive({
    selectYearList: [
        {
            value: '2021',
            label: '2021年'
        },
        {
            value: '2020',
            label: '2'
        },
        {
            value: '2019',
            label: '201'
        }
    ],
    selectAreaList: [
        {
            value: '330110',
            label: '余杭区'
        }
    ],
    selectRiverList: [
        {
            value: '',
            label: '八大水系'
        },
        {
            value: '31100223',
            label: '鳌江'
        },
        {
            value: '31100223',
            label: '苕溪'
        },
        {
            value: '31100223',
            label: '京杭运河'
        },
        {
            value: '31100223',
            label: '钱塘江'
        },
        {
            value: '31100223',
            label: '甬江'
        },
        {
            value: '31100223',
            label: '椒江'
        },
        {
            value: '31100223',
            label: '瓯江'
        },
        {
            value: '31100223',
            label: '飞云江'
        }
    ],
})
const checkType = (num: number) => {
    if (props.type === num) return
    emit('update:type', num)
}

const { selectRiverList, selectYearList, selectAreaList } = toRefs(data)
</script>

<style lang="scss" scoped>
.left-boxs {
    position: absolute;
    top: 110px;
    right: 480px;
    z-index: 9;
    width: fit-content;

    .year-select {
        width: 160px;
        height: 36px;
        padding: 0 35px;
        background: url(@/assets/images/ClosedLoopManagement/legend-select.png)  no-repeat;
        background-size: 100% 100%;

        & > span {
            line-height: 36px;
        }
    }

    .curr-check {
        /* stylelint-disable-next-line max-line-length */
        background: radial-gradient(49% 49% at 50% 0%, rgb(0, 126, 255, 0.7) 0%, rgb(0, 126, 255, 0.19) 47%, rgb(0, 126, 255, 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgb(0, 48, 97, 0) 100%), linear-gradient(90deg, rgb(0, 48, 97, 0) 0%, #003061 50%, rgb(0, 48, 97, 0) 99%);
    }
}
</style>
