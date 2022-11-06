<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:24:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 10:00:28
 * @Description:
-->
<template lang="pug">
commonPanel(title="日常巡查" panelBg='panel-1' :height='448')
    template(#mainContent)
        .river-chief
            .river-item(v-for='item in list')
                .text {{item.name}}
                .box
                    .box-one
                        .top-text 隐患数
                        .center-text
                            span {{item.add}}
                            span 次
                        img(src='@/assets/images/sewageTreatment/bar-bg.png')
                    .box-one
                        .top-text 处置率
                        .center-text
                            span(style='color: rgba(255, 255, 255, 0.87);') {{item.total}}
                            span %
                        img(src='@/assets/images/sewageTreatment/bar-bg.png')
</template>

<script setup lang="ts">
const data = reactive({
    list: [
        { name: '今日', add: 24, total: 80.2, dispose: 126 },
        { name: '累计', add: 24, total: 80.2, dispose: 126 },
    ]
})
const { list } = toRefs(data)
</script>

<style scoped lang="scss">
.river-chief {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 8px 0;

    .river-item {
        width: 330px;
        height: 170.94px;
        padding: 12px 32px;
        margin-bottom: 16px;
        background: rgb(0 47 93 / 30%);
        border: 1px solid #00366a;
        border-radius: 4px;

        .text {
            margin-bottom: 2px;
            font-family: TRENDS;
            font-size: 16px;
        }

        .box {
            display: flex;
            justify-content: space-between;
            height: 144px;
            padding: 16px 16px 0 0;

            .box-one {
                position: relative;
                width: 96px;
                height: 94px;
                text-align: center;

                img {
                    position: absolute;
                    top: 7px;
                    left: -40px;
                    width: 176px;
                    height: 149px;
                }
            }

            .top-text {
                margin-bottom: 12px;
                font-family: TRENDS;
                font-size: 14px;
            }

            .center-text {
                span:nth-child(1) {
                    margin-right: 4px;
                    font-family: Furore;
                    font-size: 24px;
                    color: #ff9902;
                    text-shadow: 0 1px 17px 0 rgb(27 126 242 / 44%);
                }

                span:nth-child(2) {
                    font-family: TRENDS;
                    font-size: 12px;
                    color: rgb(255 255 255 / 70%);
                }
            }
        }
    }
}
</style>
