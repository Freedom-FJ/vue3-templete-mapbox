<!--
 * @Author: mjh
 * @Date: 2022-10-13 09:55:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 16:10:00
 * @Description:
-->
<template lang="pug">
commonPanel(title="事件统计" :height='228')
    template(#mainContent)
        .warn-content
            .top-title-line.flex.flex-son-1.mgb10
                .water-title.text-14 涉水监管（2021）
                .title-box
                    .title-line.text-14.mgb10 涉水审批
                    .title-num.num-16.mg-auto 120
                .title-box
                    .title-line.text-14.mgb10 水土保持
                    .title-num.num-16.mg-auto 108
                .title-box
                    .title-line.text-14.mgb10 取水许可
                    .title-num.num-16.mg-auto 48
            .bar-line.mgb16
                .water-bar(:style="{flex: 120}")
                .water-soil-bar(:style="{flex: 108}")
                .water-intake(:style="{flex: 48}")
            .bottom-box.flex-bw-c
                .box(v-for="item,index in list" :key="index" )
                    .title.text-12.mg-auto {{item.name}}
                    .num-box.flex-c-c
                        .num.num-24 {{item.value}}
</template>

<script lang="ts" setup name="torrent-warning">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    list: [
        { name: '检查次数', value: 4 },
        { name: '发现问题数', value: 0 },
        { name: '整改数', value: 0 },
        { name: '整改率', value: '100%' },
    ]
})

const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    width: 100%;
    height: 100%;
    padding: 16px 11px 0;

    .water-title {
        flex: 2.2;
        padding-top: 25px;
    }

    .bar-line {
        display: flex;
        width: 100%;
        height: 8px;
        overflow: hidden;
        border-radius: 4px;

        & > div {
            height: 100%;
        }

        .water-bar {
            background: linear-gradient(270deg, #36eaaf 0%, #4bd2bb 100%);
        }

        .water-soil-bar {
            background: #0aaeff;
        }

        .water-intake {
            background: #db5a6b;
        }
    }

    .box {
        width: 72px;
        height: 80px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .num {
        text-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.6);
    }

    .bottom-box {
        .num-box {
            width: 72px;
            height: 66px;
        }

        .box:nth-child(1) {
            .title {
                padding-bottom: 2px;
                color: #34eae3;
            }

            .num-box {
                background-image: url(../../../../assets/images/sewageTreatment/jccs.png);
            }

            .num {
                color: #34eae3;
            }
        }

        .box:nth-child(2) {
            .title {
                padding-bottom: 2px;
                color: #f54455;
            }

            .num-box {
                background-image: url(../../../../assets/images/sewageTreatment/fxwt.png);
            }

            .num {
                color: #f54455;
            }
        }

        .box:nth-child(3) {
            .title {
                padding-bottom: 2px;
                color: #ff9902;
            }

            .num-box {
                background-image: url(../../../../assets/images/sewageTreatment/zgs.png);
            }

            .num {
                color: #ff9902;
            }
        }

        .box:nth-child(4) {
            .title {
                padding-bottom: 2px;
                color: #2ac94f;
            }

            .num-box {
                background-image: url(../../../../assets/images/sewageTreatment/zgl.png);
            }

            .num {
                color: #2ac94f;
            }
        }
    }
}
</style>
