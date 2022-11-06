<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:24:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 13:52:27
 * @Description:
-->
<template lang="pug">
commonPanel(title="日常管控" panelBg='panel-1' :height='448')
    template(#mainContent)
        .river-chief
            .river-item(v-for='item in list')
                .text {{item.name}}
                .box
                    .box-one
                        .top-text 今日新增
                        .center-text
                            span {{item.add}}
                            span 次
                        img(src='@/assets/images/sewageTreatment/bar-bg.png')
                    .box-one
                        .top-text 累计
                        .center-text
                            span(style='color: rgba(255, 255, 255, 0.87);') {{item.total}}
                            span 次
                        img(src='@/assets/images/sewageTreatment/bar-bg.png')
                    .box-one
                        .top-text 已处理
                        .center-text
                            span(style='color: #2AC94F;') {{item.dispose}}
                            span 次
                        img(src='@/assets/images/sewageTreatment/bar-bg.png')
</template>

<script setup lang="ts">
const data = reactive({
    list: [
        { name: '监测预警', add: 24, total: 135, dispose: 126 },
        { name: '科技预警', add: 24, total: 135, dispose: 126 },
    ]
})
const { list } = toRefs(data)
</script>

<style scoped lang="scss">
.river-chief {
    padding: 16px 8px 0;

    .river-item {
        margin-bottom: 16px;

        .text {
            margin-bottom: 10px;
            font-family: TRENDS;
            font-size: 16px;
        }

        .box {
            display: flex;
            justify-content: space-between;
            height: 144px;
            padding: 27px 16px 0;
            background: rgba(0, 47, 93, 0.3);
            border: 1px solid #00366a;
            border-radius: 4px;

            .box-one {
                position: relative;
                width: 96px;
                height: 94px;
                text-align: center;

                img {
                    position: absolute;
                    top: 0;
                    left: -40px;
                    width: 176px;
                    height: 139px;
                }
            }

            .top-text {
                margin-bottom: 4px;
                font-family: TRENDS;
                font-size: 14px;
            }

            .center-text {
                span:nth-child(1) {
                    margin-right: 4px;
                    font-family: Furore;
                    font-size: 24px;
                    color: #ff9902;
                    text-shadow: 0 1px 17px 0 rgba(27, 126, 242, 0.44);
                }

                span:nth-child(2) {
                    font-family: TRENDS;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                }
            }
        }
    }
}
</style>
