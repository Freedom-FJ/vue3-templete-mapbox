<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 15:30:51
 * @Description:
-->
<template lang="pug">
commonPanel(title="供水量" panelBg='panel-big' :height='248' :bigBgTop="14")
    template(#mainContent)
        .environmental-status
            .item-box.mgb16(v-for="(item, index) in list" :key="index")
                .top-value
                    .value.num-20 {{item.value}}
                    .unit {{item.unit}}
                img.left-img(src="@/assets/images/sewageTreatment/delivery-1.png")
                .right-text
                    .top-label.bg-gra-label {{item.name}}
</template>

<script lang="ts" setup>
const data = reactive({
    list: [
        { name: '本月供水量', value: '1142.02', unit: '万m³' },
        { name: '本年供水量', value: '1.02', unit: '亿m³' },
        { name: '人均供水量', value: '306.34', unit: 'L/人*日' },
    ],
})
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 20px 12px 0;

    .item-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .left-img {
            flex: none;
            width: 90px;
            margin-top: -20px;
            margin-bottom: 4px;
        }

        .unit {
            font-family: PingFangSC;
            font-size: 18px;
            font-weight: 500;
            line-height: 26px;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0;
        }

        .top-label {
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;

            /* 白色 */
            color: #fff;
            letter-spacing: 0;
        }

        .top-value {
            text-align: center;

            .value {
                margin-bottom: 6px;
                font-family: Furore;
                font-size: 20px;
            }

            .unit {
                font-family: TRENDS;
                font-size: 14px;
            }
        }
    }
}
</style>

