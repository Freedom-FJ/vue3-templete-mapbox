<template lang="pug">
popup-panel(  :height='408' :width="736" :titleHeight="32" :isMapPop="true" )
    template(#title)
        .title-box.flex
            .title-box.text-16 {{properties.name}}
    .main-content
</template>

<script lang="ts" setup name="SurfaceStationDetail">
import type { PropType } from 'vue'
const props = defineProps({
    properties: {
        type: Object as PropType<any>,
        default: () => {
            return {}
        }
    }
})
</script>

<style scoped lang="scss">
.main-content {
    width: 736px;
    height: 408px;
    padding: 16px;
}

.flex-g {
    display: flex;
    align-items: center;
}

.row {
    & > div {
        width: 55%;
        margin-top: 0 !important;
    }
}

.status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 16px;
    font-family: TRENDS;
    font-size: 12px;
    font-weight: normal;
    line-height: 12px;
    color: #fff;
    letter-spacing: 0;
    border-radius: 10px;
}

.common-pop-container {
    position: relative;
    width: 884px;
}

.common-pop-title {
    display: flex;
    margin-bottom: 24px;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    font-weight: 700;
    color: #fff;
}

.close-icon {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 18px;
    cursor: pointer;
}

.info-item-box {
    display: flex;
    margin-bottom: 10px;

    & > div {
        flex: 1;
    }
}

.common-pop-basic-info {
    margin: 0 12px 16px;
}

.row > div {
    width: 180px;
}

.info-item {
    .item-name {
        font-family: TRENDS;
        font-size: 14px;
        font-weight: normal;
        line-height: 14px;

        /* 白色 */
        color: #fff;
        letter-spacing: 0;
        white-space: nowrap;
    }

    .item-value {
        font-family: TRENDS;
        font-size: 12px;
        font-weight: normal;
        line-height: 12px;
        color: #fff;
        letter-spacing: 0;
    }
}

.common-pop-basic-info {
    background: transparent;
}

.camera-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 12px 10px;
    color: #00c365;
    white-space: nowrap;

    .camera-item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 32px 2px 0;
        font-family: TRENDS;
        font-size: 14px;
        font-weight: 10;
        font-weight: normal;
        line-height: 14px;
        color: #0df;
        letter-spacing: 0;
        cursor: pointer;

        img {
            width: 12.5px;
            height: 15px;
            margin-right: 8px;
        }
    }
}

.common-bottom-content {
    box-sizing: border-box;
    width: 376px;
    height: 242px;
    padding: 12px 12px 0;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;
}

.analysis-btn {
    position: absolute;
    top: 2px;
    right: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    cursor: pointer;
    background: #023057;
    border: 1px solid #286c9d;
    border-radius: 4px;
}

.drink-btn-box {
    display: flex;
    margin-left: 20px;

    & > div {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1px 10px;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .now-btn {
        margin-right: 4px;
    }

    .isCheck {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.drink-box {
    width: 688px !important;
    height: 242px !important;
}

.common-chart-size-box {
    width: 296px;
    height: 242px;
}
</style>
