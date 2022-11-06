<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-17 17:52:59
 * @Description:
-->
<template>
    <commonPanel title="饮用水源地" panel-bg="panel-big" :height="364" :big-bg-top="14">
        <template #rightTitle>
            <div class="text-14 cur title-detail" @click="$router.push({ path: '/closedLoop/ClosedLoopDrink' })">
                进入详情》
            </div>
        </template>
        <template #mainContent>
            <div class="main-box">
                <div class="top-line flex-bw-c mgb16">
                    <div class="top-line-item">
                        <img class="left-img mgr10" src="@/assets/images/ClosedLoopManagement/unDone.png"><div class="right-text-box">
                            <div class="right-title text-14 mgb8">
                                疑似问题
                            </div><div class="value-line num-24 red">
                                100
                            </div>
                        </div>
                    </div><div class="top-line-item">
                        <img class="left-img mgr10" src="@/assets/images/ClosedLoopManagement/done.png"><div class="right-text-box">
                            <div class="right-title text-14 mgb8">
                                已完成
                            </div><div class="value-line num-24 green">
                                40
                            </div>
                        </div>
                    </div>
                </div><div class="bar-warning-box mgb16">
                    <div class="top-title-line flex-bw-c mgb16">
                        <div class="top-title text-14">
                            断面报警
                        </div><div class="right-title unit-14">
                            已完成/问题数
                        </div>
                    </div><div class="bottom-bar flex-c">
                        <div class="bar-box">
                            <div class="curr-bar-value" :style="{ width: `${sectionWaring.done / sectionWaring.total * 100}%` }" />
                        </div><div class="right-value-box">
                            <span class="curr-value num-16 green mgr2">{{ sectionWaring.done }}</span><span class="total-value num-16">/{{ sectionWaring.total }}</span>
                        </div>
                    </div>
                </div><div class="bar-warning-box mgb16">
                    <div class="top-title-line flex-bw-c mgb16">
                        <div class="top-title text-14">
                            科技预警
                        </div><div class="right-title unit-14">
                            已完成/问题数
                        </div>
                    </div><div class="bottom-bar flex-c">
                        <div class="bar-box">
                            <div class="curr-bar-value" :style="{ width: `${technologyWaring.done / technologyWaring.total * 100}%` }" />
                        </div><div class="right-value-box">
                            <span class="curr-value num-16 green mgr2">{{ technologyWaring.done }}</span><span class="total-value num-16">/{{ technologyWaring.total }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    chartPieDom: ref(),
    barDom: ref(),
    chartPieData: [
        { name: '未处理', value: 4, rate: '1.4%' },
        { name: '已处理', value: 180, rate: '98.6%' },
    ],
    sectionWaring: {
        done: 48,
        total: 252
    },
    technologyWaring: {
        done: 2,
        total: 210
    }
})

const { chartPieDom, barDom, technologyWaring, sectionWaring } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 16px 12px 0;
}

.top-line {
    .top-line-item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 164px;
        height: 78px;
        padding: 0 8px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;

        .left-img {
            width: 66px;
            padding-top: 5px;
        }
    }
}

.bar-warning-box {
    box-sizing: border-box;
    width: 100%;
    height: 78px;
    padding: 16px 16px 0;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 8px;

    .bottom-bar {
        padding-right: 20px;

        .bar-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 12px;
            padding: 3px 0;
            margin-right: 7px;
            background: rgba(192, 196, 204, 0.1);

            .curr-bar-value {
                width: 84px;
                height: 6px;
                background: linear-gradient(270deg, #36eaaf 0%, #4bd2a3 99%);
            }
        }
    }
}

.title-detail {
    color: rgba(255, 255, 255, 0.7);
}

.title-detail:hover {
    color: #00e5ff;
}
</style>

