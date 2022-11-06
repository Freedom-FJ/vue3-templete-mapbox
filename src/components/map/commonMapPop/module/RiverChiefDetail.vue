<!--
 * @Author: Tian
 * @Date: 2022-09-29 14:37:11
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 16:59:20
 * @Description:t
-->
<template lang="pug">
popup-panel(:height='352' :width="288" :titleHeight="32" :isMapPop="true")
    template(#title)
        .title-label(:title='detail.name') {{detail.name}}
    .main-content
        .common-line(:title='detail.watershedName') 所属水系：{{detail.watershedName}}
        .common-line(:title='detail.regionName') 所属区划：{{detail.regionName}}
        .common-line(:title='detail.address') 地址：{{detail.address}}
        .common-line 河长：{{detail.chiefName}}
        .pic-list
            el-carousel(height="160px" indicator-position="outside")
                el-carousel-item(v-for='item in detail.picList')
                    img.pic(:src='item' v-if='item')
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { returnDataTs } from '@/utils/map/mapPoint'
const props = defineProps({
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    }
})
const popData = reactive({
    detail: {
        name: '',
        address: '',
        chiefName: '',
        watershedName: '',
        regionName: '',
        picList: [] as string[]
    }
})
const dataInit = () => {
    popData.detail.name = props.properties.name || '--'
    popData.detail.address = props.properties.address || '--'
    popData.detail.chiefName = props.properties.chiefName || '--'
    popData.detail.watershedName = props.properties.watershedName || '--'
    popData.detail.regionName = props.properties.regionName || '--'
    const picArr = props.properties.pictureUrls && props.properties.pictureUrls.length > 5 ? props.properties.pictureUrls.split('#@#') : []
    popData.detail.picList = picArr.length
        ? picArr.map((item: string) => {
            return `http://${item}`
        })
        : []
}
dataInit()
const { detail } = toRefs(popData)
</script>

<style lang="scss" scoped>
:deep(.el-carousel__button) {
    width: 6px;
    height: 6px;
    background: #f5f7f9;
    border-radius: 50%;
}

:deep(.el-carousel__indicator.is-active button) {
    background: #0df;
}

.title-label {
    font-family: TRENDS;
    font-size: 16px;

    @include text-overflow;
}

.main-content {
    padding: 12px 16px 0;
    font-family: TRENDS;
    font-size: 14px;

    .common-line {
        margin-bottom: 12px;

        @include text-overflow;
    }

    .pic-list {
        .pic {
            width: 100%;
            height: 160px;
        }
    }
}
</style>
