<!--
 * @Author: mjh
 * @Date: 2022-10-13 11:08:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-16 15:20:44
 * @Description:
-->
<template lang="pug">
commonPanel(title="事件处理" panelBg='panel-big' :height='176' :bigBgTop="14")
    template(#rightTitle)
        .btn-list.flex
            .btn.mgr4.global-btn-common(v-for="item,index in btnList" :key="index" :class="[btnType===index ? 'global-btn-check' : '']" @click="btnType=index") {{item}}
    template(#mainContent)
        .environmental-status.flex-bw-c
            .box.flex-c.mgr12
                img.left-img.mgr8(src="@/assets/images/sewageTreatment/mhww.png")
                .right-box
                    .title.text-14.mgb8 民呼我为
                    .value.blue-0.num-20 92.68%
            .box.flex-c
                img.left-img.mgr8(src="@/assets/images/sewageTreatment/jcjk.png")
                .right-box
                    .title.text-14.mgb8 监测监控
                    .value.blue-0.num-20 95%
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    btnList: ['类型统计', '异常列表', '区域分布'],
    btnType: 0
})
const { btnList, btnType } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    width: 100%;
    height: 100%;
    padding: 20px 10px;

    img {
        width: 48px;
    }

    .box {
        box-sizing: border-box;
        width: 166px;
        height: 72px;
        padding: 15px 12px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}
</style>
