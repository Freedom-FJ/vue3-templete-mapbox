<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:24:07
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-05 18:05:07
 * @Description:
-->
<template lang="pug">
commonPanel(title="应急管控" panelBg='panel-1' :height='208')
    template(#mainContent)
        .emergency
            .one(v-for='item, index in list')
                .top(:class='`bg-${index}`')
                    .num {{item .value}}
                .bottom {{item.text}}
</template>

<script setup lang="ts">
const data = reactive({
    list: [
        { text: '今日（次）', value: 2 },
        { text: '累计（次）', value: 2 },
        { text: '应急演练（次)', value: 5 }
    ]
})
const { list } = toRefs(data)
</script>

<style scoped lang="scss">
.emergency {
    padding: 12px 8px 0 8px;
    display: flex;
    justify-content: space-between;
    .one {
        width: 104px;
        height: 120px;
    }
    .top {
        width: 100px;
        height: 101px;
        position: relative;

        .num {
            position: absolute;
            width: 100px;
            height: 101px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Furore;
            font-size: 28px;
        }
    }
    .bg-0 {
        background: url(@/assets/images/sewageTreatment/orange.png);
        background-size: 100px 101px;
    }
    .bg-1 {
        color: #02C6FC;
        background: url(@/assets/images/sewageTreatment/blur.png);
        background-size: 100px 101px;
    }
    .bg-2 {
        background: url(@/assets/images/sewageTreatment/green.png);
        background-size: 100px 101px;
    }
    .bottom {
        width: 104px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-family: TRENDS;
        font-size: 14px;
        background: radial-gradient(49% 49% at 50% 0%, rgba(0,126,255,0.70) 0%, rgba(0,126,255,0.19) 47%, rgba(0,126,255,0.00) 84%), radial-gradient(50% 50% at 50% 100%, #007EFF 0%, rgba(0,48,97,0.00) 100%), linear-gradient(90deg, rgba(0,48,97,0.00) 0%, #003061 50%, rgba(0,48,97,0.00) 99%);
    }
}
</style>
