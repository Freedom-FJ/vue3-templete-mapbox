<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 18:19:05
 * @Description:
-->
<template>
    <commonPanel title="红黑榜" panel-bg="panel-big" :height="372" :big-bg-top="14">
        <template #mainContent>
            <div class="main-box">
                <div class="text-16 mgb14">
                    红榜
                </div>
                <div class="rank-box mgb16">
                    <el-scrollbar>
                        <div style="height: 100px;">
                            <div v-for="(item, index) in redList" :key="index" class="mgb16 text-14">
                                {{ item }}
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="text-16  mgb14">
                    黑榜
                </div>
                <div class="rank-box">
                    <el-scrollbar>
                        <div style="height: 100px;">
                            <div v-for="(item, index) in blackList" :key="index" class="mgb16 text-14">
                                {{ item }}
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    redList: [
        '杭州市近岸海域水质问题已完成整改',
        '衢州市衢江工业园区截污纳管问题已完成整改',
        '上虞工业园区截污纳管问题已完成整改',
    ],
    blackList: [
        '台州市近岸海域水质问题整改未达时序进度',
        '嘉兴市衢江工业园区截污纳管问题未整改',
        '绍兴工业园区截污纳管问题整改未达时序进度',
    ],

})
onMounted(() => {
    //
})

const { blackList, redList } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 24px 12px 0;

    .rank-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 344px;
        height: 98px;
        padding: 12px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;
    }
}
</style>

