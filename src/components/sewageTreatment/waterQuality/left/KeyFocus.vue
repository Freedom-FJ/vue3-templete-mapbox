<template lang="pug">
.environmental-status
    .key-factors
        .factor-title 重点因子（{{currYear}}）
        .factor-box
            .factor-top
                .factor-top-name  断面达标率后三名
                .right-select
                    select-panel(:option="keySelectList" :defaultSelect='0' @change="keyFactorsCheck")
            .factor-body
                .factor-body-item(v-for="item in keyFactorsList" :key="item.name")
                    img.fator-pie(src="@/assets/images/sewageTreatment/percent-bg.png")
                    .factor-value {{ typeof item.rate === 'number'? `${item.rate}%` : '--' }}
                    .factor-name {{ item.name }}
    .key-factors
        .factor-title 重点月份（{{currYear-5}}~{{currYear}}年）
        .factor-box
            .factor-top
                .factor-top-name  I~III类比例后三名
                .right-select
                    select-panel(:option="keySelectList" :defaultSelect='0' @change="MonthCheck")
            .factor-body
                .factor-body-item(v-for="item in monthFactorsList" :key="item.name")
                    img.fator-pie(src="@/assets/images/sewageTreatment/percent-bg.png")
                    .factor-value(style="margin: 6px 0 37px;") {{ typeof item.rate === 'number'? `${item.rate}%` : '--' }}
                    .factor-name {{ item.name }}
</template>

<script lang="ts" setup name="environmental-status">
import dayjs from 'dayjs'
import type { mainMonthApiTs } from '../type'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { getSetTreeCode } from '@/utils/treeDataUtils'
// import { usePopStore } from '@/store/popControl'
import service from '@/service/api'

// const popStore = usePopStore()
const data = reactive({
    currYear: Number(dayjs().format('YYYY')),
    keyFactorsList: [] as mainMonthApiTs[],
    monthFactorsList: [] as mainMonthApiTs[],
    keySelectList: [
        { label: '国控', value: '001' },
        { label: '省控', value: '001,002' },
        { label: '市控', value: '001,002,003' },
        { label: '县控以上', value: '001,002,003,004' },
    ],
    factorGroupId: ''
})
onMounted(async () => {
    const factorObj = await getFactorGroupList('surfaceSection')
    data.factorGroupId = factorObj?.id ?? ''
    getMainMonthData()
    getMainFactorData()
})

/**
 * @name: 重点月份数据
 */
const getMainMonthData = async (controlLevel = '001') => {
    const treeData = await getSetTreeCode()
    const params = {
        treeId: treeData.slice(0, 6),
        treeType: 1,
        beginTime: dayjs().add(-5, 'years').startOf('year').valueOf(),
        endTime: dayjs().endOf('year').valueOf(),
        queryTimeType: 'year',
        factorFlag: true,
        factor: data.factorGroupId,
        controlLevel
    }
    const res = await service<mainMonthApiTs[]>('waterQuality/month', params)
    const resData = res.data || []
    data.monthFactorsList = resData.slice(-3)
}
/**
 * @name: 重点因子数据
 */
const getMainFactorData = async (controlLevel = '001') => {
    const treeData = await getSetTreeCode()
    const params = {
        treeId: treeData.slice(0, 6),
        treeType: 1,
        beginTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        queryTimeType: 'year',
        factorFlag: true,
        factor: data.factorGroupId,
        controlLevel
    }
    const res = await service<mainMonthApiTs[]>('waterQuality/factor', params)
    const resData = res.data || []
    data.keyFactorsList = resData.slice(0, 3)
}

const keyFactorsCheck = (item: { value: string; label: string }) => {
    getMainFactorData(item.value)
}
const MonthCheck = (item: { value: string; label: string }) => {
    getMainMonthData(item.value)
}

const { keyFactorsList, monthFactorsList, currYear, keySelectList } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    width: 100%;
    height: 100%;
    padding: 10px;
    margin-top: -7px;

    .key-factors {
        height: 50%;
    }

    .factor-title {
        margin-top: 18px;
        font-family: TRENDS;
        font-size: 16px;
        font-weight: normal;
        line-height: 16px;
        color: #fff;
        letter-spacing: 0;
    }

    .factor-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .factor-top-name {
            margin-bottom: 12px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #fff;
            letter-spacing: 0;
        }
    }

    .factor-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 136.41px;
        padding: 12px 16px;
        margin-top: 18px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }

    .factor-body {
        display: flex;
        justify-content: space-between;
        padding: 0 16px;

        .factor-body-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 78px;

            .fator-pie {
                position: absolute;
                top: -9px;
                left: -40px;
                width: 160px;
                height: 100px;

                // transform: translateX(-50%);
            }

            .factor-value {
                margin: 6px 0 28px;
                font-family: Furore;
                font-size: 20px;
                font-weight: normal;
                line-height: 30px;
                color: #0df;
                letter-spacing: 0;
            }

            .factor-name {
                width: 85px;
                font-family: TRENDS;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #fff;
                text-align: center;
                letter-spacing: 0;
            }
        }
    }
}
</style>
