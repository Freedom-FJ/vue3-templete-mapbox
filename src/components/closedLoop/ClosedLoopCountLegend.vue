<!--
 * @Author: mjh
 * @Date: 2022-09-08 15:54:29
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-18 15:06:01
 * @Description:
-->
<template>
    <div class="right-boxs">
        <div class="img-content bf-blur flex-bw-c">
            <div v-for="(item, index) in countList" :key="index" class="list-line">
                <div class="list-title text-16 mgb5 t-c">
                    {{ item.label }}
                </div>
                <div class="list-num num-20 t-c" :class="[item.class]">
                    {{ item.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const data = reactive({
    countList: [
        { label: '问题总数', value: 24396, class: 'blue' },
        { label: '已完成', value: 24396, class: 'green' },
        { label: '未完成', value: 24396, class: 'red' },
    ],
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
})

const { countList, selectYearList, selectAreaList } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-boxs {
    position: absolute;
    top: 110px;
    left: 460px;
    z-index: 9;
    width: fit-content;

    .img-content {
        width: 352px;
        height: 60px;
        padding: 0 50px;
        background: url(@/assets/images/ClosedLoopManagement/legend-tips.png)  no-repeat;
        background-size: 100% 100%;
    }

    .list-num {
        text-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.3);
    }
}
</style>
