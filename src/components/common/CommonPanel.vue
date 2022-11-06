<template lang="pug">
.common-panel.bf-blur(:style='{height: pxToRem(height), width: pxToRem(width)}')
    .common-bg(:style='{height: pxToRem(height), borderImageSource: `url(${getAssetsFile(`panel/${panelBg}.png`)})`}')
    .panel-content
        .top-title(:style='{marginTop: pxToRem(bigBgTop)}')
            .text-box
                .left
                    el-tooltip(
                        v-if="title.length > 16"
                        class="box-item"
                        effect="dark"
                        :content="title"
                        placement="top"
                    )
                        .main-title {{title}}
                    .main-title(v-else) {{title}}
                    .sub
                        slot(name="subTitle")
                            span {{subTitle}}
                .right
                    slot(name='rightTitle')
        .common-content
            slot(name='mainContent')
</template>

<script lang="ts" setup name="common-panel">
import { getAssetsFile, pxToRem } from '@/utils/tools'
defineProps({
    /**
     * 背景图高度
     */
    height: {
        type: Number,
        default: 176
    },
    /**
     * 背景图宽度
     */
    width: {
        type: Number,
        default: undefined
    },
    /**
     * 背景图
     */
    panelBg: {
        type: String,
        default: 'panel-1'
    },
    /**
     * 主标题
     */
    title: {
        type: String,
        default: ''
    },
    /**
     * 副标题
     */
    subTitle: {
        type: String,
        default: ''
    },
    /**
     * 当图片为panel-big时，主标题的marginTop
     */
    bigBgTop: {
        type: Number,
        default: 0
    }
})
</script>

<style lang="scss" scoped>
.common-panel {
    position: relative;
    width: 400px;

    .common-bg {
        position: absolute;
        width: 100%;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-slice: 30 70 30 70 fill;
    }

    .panel-content {
        position: absolute;
        width: 100%;
        padding: 8px 16px;
    }

    .top-title {
        position: relative;
        z-index: 9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 34px;
        padding-left: 28px;
        background-size: 100% 100%;
        border-top: 17px solid;
        border-right: 30px solid;
        border-bottom: 18px solid;
        border-left: 30px solid;

        // background: url(@/assets/images/layouts/title.png);
        border-image-source: url(@/assets/images/layouts/title.png);
        border-image-slice: 17 30 18 30  fill;

        .text-box {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: calc(100% + 17px);
            height: 35px;
            transform: translateY(-18px);
        }

        .left {
            display: flex;
            align-items: center;

            .main-title {
                max-width: 320px;
                font-family: PangMenZhengDao;
                font-size: 20px;
                color: #d8f1ff;

                @include text-overflow;
            }

            .sub {
                font-family: Furore;
                font-size: 14px;
                /* stylelint-disable-next-line color-function-notation */
                color: rgb(255 255 255 / 0.6);
            }
        }
    }
}
</style>
