<!--
 * @Author: mjh
 * @Date: 2022-09-07 14:48:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-08 11:07:55
 * @Description:
-->
<template lang="pug">
commonPanel(title="园区简介" :height='316' panelBg='panel-big')
    template(#mainContent)
        .environmental-status
            img.top-img(src="@/assets/images/sewageTreatment/video.png")
            el-scrollbar.bottom-text.text-14 赛银国际位于杭州大城西“未来科技城”CBD的核心区块，毗邻未来科技城海创园，阿里巴巴淘宝城，是浙江省、杭州政府打造集高新技术产业、高等教育、高尚居住区及休闲旅游于一体的城市商业综合体。
</template>

<script lang="ts" setup name="IntroductionPark">
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    list: [
        { name: '工业园区', value: '1254', img: 'backBlue' },
        { name: '生活小区', value: '2146', img: 'backYellow' },
        { name: '镇街', value: '2146', img: 'backGreen' },
    ],
    rankList: [
        { name: '中泰', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '闲林', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '余杭', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '仓前', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '五常', yellow: '30%', blue: '40%', green: '40%', value: 94 },
        { name: '径山', yellow: '30%', blue: '40%', green: '40%', value: 94 }
    ]
})
onMounted(() => {
    //
})
const { list, rankList } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    width: 100%;
    height: 100%;
    padding: 12px 12px 0;

    .top-img {
        width: 344px;
        height: 160px;
        margin-bottom: 2px;
    }

    .bottom-text {
        width: 344px;
        height: 80px;
        overflow-y: auto;
        line-height: 20px;
    }
}
</style>
