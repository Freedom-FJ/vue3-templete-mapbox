<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 16:30:55
 * @Description:
-->
<template>
    <commonPanel title="7天播报" panel-bg="panel-big" :height="224" :big-bg-top="14">
        <template #mainContent>
            <div class="main-box">
                <el-scrollbar>
                    <div class="rolling-box">
                        <div v-for="(item, index) in type === 'surface' ? sevenThing : sevenThingDrink" :key="index" class="detail-item mgb20 text-overflow">
                            <span class="title text-14 green-3">【{{ item.level }}】</span>
                            <span class="time num-16">{{ item.time }}</span>
                            <span class="text-14 red">{{ item.factor }}</span>
                            <span class="text-14">{{ item.detail }}</span>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { globalKey } from '@/symbols'
const props = defineProps({
    type: {
        type: String as PropType<'surface' | 'drink'>,
        default: 'surface'
    }
})

const global = inject(globalKey)

const data = reactive({
    sevenThing: [
        { level: '国控', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '超标预警' },
        { level: '省控', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '超标预警' },
        { level: '市控', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
        { level: '省控', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
        { level: '省控', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
    ],
    sevenThingDrink: [
        { level: '千吨万人', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '超标预警' },
        { level: '千吨万人', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '超标预警' },
        { level: '非法入侵', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
        { level: '疑似建筑', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
        { level: '非法入侵', time: '2021-09-05 16:00', factor: '氨氮(NH3-N)', detail: '事件描述事件描述事事件描述事件描述事' },
    ]
})
onMounted(() => {
    //
})

const { sevenThing, sevenThingDrink } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 23px 12px 0;

    .rolling-box {
        height: 120px;
    }
}
</style>

