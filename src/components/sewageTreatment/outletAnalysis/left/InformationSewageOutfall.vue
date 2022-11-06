<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 14:52:53
 * @Description:
-->
<template>
    <commonPanel title="入河排污口信息" :height="328">
        <template #mainContent>
            <div class="center-box">
                <img class="information-img mgb10" src="@/assets/images/sewageTreatment/information.png" alt="">
                <div class="bottom-list flex-bw-c flex-w w-100">
                    <div v-for="(item, index) in labelList" :key="index" class="bottom-item w-50 flex-n mgb8">
                        <span class="text-14">{{ item.label }}：</span>
                        <span class="text-14">{{ detailObj[item.key] }}</span>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    labelList: [
        { label: '所属区域', key: 'address' },
        { label: '排放去向', key: 'qx' },
        { label: '受纳水体', key: 'st' },
        { label: '排水方式', key: 'fs' },
        { label: '排放规律', key: 'gl' },
        { label: '排水口类型', key: 'lx' },
        { label: '污水类型', key: 'wslx' },
        { label: '是否安装检测设备', key: 'equipment' },
    ],
    detailObj: {
        address: '余杭街道',
        st: '入河',
        gl: '余杭塘河',
        lx: '暗渠',
        qx: '不规则连续排放',
        fs: '雨污混排',
        wslx: '生活污水',
        equipment: '是',
    } as record
})
onMounted(() => {
    //
})

const { detailObj, labelList } = toRefs(data)
</script>

<style lang="scss" scoped>
.center-box {
    padding: 12px;

    .information-img {
        width: 344px;
        height: 160px;
    }
}
</style>
