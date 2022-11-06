<template lang="pug">
commonPanel(title="布点现状" :height='184')
    template(#rightTitle)
        .btn-box
            .item-btn(:class="[!isHandle ? 'item-btn-check' : '']" @click="checkHandle(false)") 自动
            .item-btn(:class="[isHandle ? 'item-btn-check' : '']" @click="checkHandle(true)") 手工
    template(#mainContent)
        .warn-content
            .tab-item(v-for="(item,index) in list" :key="index" @click="checkDistribution(index)" :class="[ popStore.getCurrentPop === 'StatusDistributionPop' && popStore.getPopData.type === index   ?'panel-checked': '']")
                .back-img
                    .value {{item.count}}
                .bottom-label {{item.name}}
</template>

<script lang="ts" setup name="torrent-warning">
import { usePopStore } from '@/store/popControl'
import { globalKey } from '@/symbols'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import service from '@/service/api'
import type { distributionStatusApiTs } from '@/components/sewageTreatment/waterQuality/type'
const popStore = usePopStore()
const global = inject(globalKey)
const data = reactive({
    isHandle: true,
    list: [

    ] as distributionStatusApiTs[]
})
onMounted(() => {
    getData()
})

const getData = async () => {
    const treeData = await getSetTreeCode()
    const res = await service<distributionStatusApiTs[]>('waterQuality/situation', {
        monitoringMethods: data.isHandle ? 1 : 0,
        regionCode: treeData,
    })
    data.list = res.data || []
}
const checkDistribution = (index: number) => {
    if (popStore.getCurrentPop === 'StatusDistributionPop' && popStore.getPopData.type === index) {
        popStore.initPop()
        return
    }
    const type = index
    popStore.upDatePopup({
        currentPop: 'StatusDistributionPop',
        popData: {
            type,
            isHandle: data.isHandle
        }
    })
}
const checkHandle = (isHandle: boolean) => {
    if (data.isHandle === isHandle) return
    data.isHandle = isHandle
    getData()
    popStore.getCurrentPop === 'StatusDistributionPop' && popStore.upDatePopup({
        currentPop: 'StatusDistributionPop',
        popData: {
            type: popStore.getPopData.type,
            isHandle: data.isHandle
        }
    })
}
const { isHandle, list } = toRefs(data)
</script>

<style lang="scss" scoped>
.btn-box {
    display: flex;

    .item-btn {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 22px;
        padding: 5px 10px;
        margin-left: 4px;
        font-family: TRENDS;
        font-size: 12px;
        font-weight: normal;
        line-height: 12px;
        color: #fff;
        letter-spacing: 0;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .item-btn-check {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}

.warn-content {
    display: flex;
    justify-content: space-between;
    padding: 24px 12px 0;

    .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .back-img {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: url("../../../../assets/images/sewageTreatment/back.png");
            background-position: center;
            background-size: 100% 100%;

            .value {
                font-family: Furore;
                font-size: 28px;
                font-weight: normal;
                line-height: 28px;
                color: transparent;
                text-shadow: 0 2px 4px 0 #000;
                letter-spacing: 0;
                background: linear-gradient(to bottom, #fff, #92f4ff);
                -webkit-background-clip: text;
            }
        }

        .bottom-label {
            position: relative;
            width: 94px;
            height: 14px;
            margin-top: 13px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #fff;
            text-align: center;
            /* stylelint-disable-next-line color-function-notation */
            background: rgb(0 255 255 / 0.1);

            &::after {
                position: absolute;
                top: -1px;
                left: 0;
                width: 1px;
                height: 16px;
                content: "";
                background-color: #00a6ff;
            }

            &::before {
                position: absolute;
                top: -1px;
                right: 0;
                width: 1px;
                height: 16px;
                content: "";
                background-color: #00a6ff;
            }
        }
    }
}
</style>
