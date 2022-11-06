<template lang="pug">
commonPanel(title="河长履职" :height='244')
    template(#mainContent)
        .warn-content
            .top-count
                .top-count-item(v-for="(item,index) in list" :key="index")
                    img(:src="item.img")
                    .top-count-label {{item.name}}
                    .top-count-value {{item.value}}
            .table-box
                .table-header
                    .table-header-item
                    .table-header-item(style="color: #F00F00;")  重大问题
                    .table-header-item(style="color: #F0C800;") 一般问题
                    .table-header-item 轻微问题
                .table-body
                    .table-body-line
                        .table-body-item.text-14 发现问题
                        .table-body-item.num-14 6
                        .table-body-item.num-14 394
                        .table-body-item.num-14 982
                    .table-body-line
                        .table-body-item.text-14 解决率
                        .table-body-item.num-14(style="color: #F00F00;") 100%
                        .table-body-item.num-14(style="color: #F0C800;") 100%
                        .table-body-item.num-14(style="color: #00C8FF;") 99.6%
</template>

<script lang="ts" setup name="torrent-warning">
import hz1 from '@/assets/images/sewageTreatment/hz-1.png'
import hz2 from '@/assets/images/sewageTreatment/hz-2.png'
import hz3 from '@/assets/images/sewageTreatment/hz-3.png'
import hz4 from '@/assets/images/sewageTreatment/hz-4.png'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    isHandle: true,
    list: [
        { name: '河长总数', value: 801, img: hz1 },
        { name: '总巡查次数', value: 14499, img: hz2 },
        { name: '发现问题数', value: 1382, img: hz3 },
        { name: '总解决率', value: '99.7%', img: hz4 },
    ]
})

const { isHandle, list } = toRefs(data)
</script>

<style lang="scss" scoped>
.warn-content {
    width: 100%;
    height: 100%;
    padding: 16px 12px 0;

    .top-count {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 11px;

        .top-count-item {
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
                width: 36px;
                height: 36px;
            }

            .top-count-label {
                margin: 8px 0;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
                letter-spacing: 0;
            }

            .top-count-value {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;

                /* 主题色 */
                color: #0df;
                letter-spacing: 0;
            }
        }
    }

    .table-box {
        width: 106%;
        margin-top: 8px;
        transform: translateX(-3%);

        .table-header {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: 100%;
            height: 28px;
            padding: 0;
            background: rgba(2, 48, 87, 0.5);
            border-color: rgba(96, 162, 225, 0.5);
            border-style: solid;
            border-width: 0 0 1px;

            .table-header-item {
                flex: 1;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #00c8ff;
                text-align: center;
                letter-spacing: 0;
            }
        }

        .table-body {
            .table-body-line {
                display: flex;
                align-items: center;

                .table-body-item {
                    flex: 1;
                    height: 28px;
                    line-height: 28px;
                    text-align: center;
                }
            }
        }
    }
}
</style>
