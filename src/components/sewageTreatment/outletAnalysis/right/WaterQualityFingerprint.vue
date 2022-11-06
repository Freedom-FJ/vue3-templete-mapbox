<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 16:41:14
 * @Description:
-->
<template>
    <commonPanel title="水质指纹" :height="437">
        <template #mainContent>
            <div class="center-box">
                <div class=" river-box mgb16">
                    <div class="border" />
                    <img class="mgr16" src="@/assets/images/sewageTreatment/outlet.png" alt="">
                    <div class="top-title text-16 mgr80">
                        可疑污染源总数
                    </div>
                    <div class="right-value">
                        <span class="value-num">
                            32
                        </span>
                        <span class="unit-14">个</span>
                    </div>
                </div>
                <div class="bottom-table-box">
                    <div class="title text-14 mgb8">
                        可疑企业列表
                    </div>
                    <PopupTable
                        :option="colunms"
                        :data="tableData"
                        :height="200"
                        :line-style="{
                            padding: '8px 8px',
                        }"
                        :header-line-style="{
                            background: 'transparent',
                            border: '1px solid rgba(96, 162, 225, 0.5)',
                            borderTop: '0px',
                            borderRight: '0px',
                            borderLeft: '0px',
                        }"
                    />
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { usePopStore } from '@/store/popControl'
const popStore = usePopStore()
const data = reactive({
    colunms: [
        {
            key: 'index',
            label: '序号',
            flex: 1,
            rowStyle: {
                fontSize: '12px'
            }
        },
        {
            key: 'name',
            label: '名称',
            flex: 7,
            rowStyle: {
                fontSize: '12px'
            }
        },
        {
            key: 'rate',
            label: '可疑概率',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'Furore',
                color: '#00DDFF'

            }
        },
        {
            key: 'distance',
            label: '距离',
            flex: 2,
            rowStyle: {
                fontSize: '12px',
                fontFamily: 'Furore',
                color: '#00DDFF'
            }
        },
    ],
    tableData: [
        { name: '杭州多宝电子有限责任公司', num: '7', distance: '3000', rate: '70%', index: 1 },
        { name: '达利（中国）有限责任公司', num: '5', distance: '1000', rate: '50%', index: 2 },
        { name: '杭州临安浮玉堂有限责任公司', num: '4', distance: '200', rate: '40%', index: 3 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 4 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 5 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 6 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 7 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 8 },
        { name: '杭州建德污水处理有限公司', num: '3', distance: '100', rate: '30%', index: 9 },
    ],
})
onMounted(() => {
    //
})

const { colunms, tableData } = toRefs(data)
</script>

<style lang="scss" scoped>
.center-box {
    padding: 16px 0 0;

    .river-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 72px;
        padding: 10px 22px 10px 24px;
        background: #2e2414;
        border-top: 1px solid rgba(238, 142, 1);
        border-bottom: 1px solid rgba(238, 142, 1);

        img {
            width: 52px;
            height: 52px;
        }

        .value-num {
            font-family: Furore;
            font-size: 24px;
            font-weight: normal;
            line-height: 24px;
            color: transparent;
            letter-spacing: 0;
            background: linear-gradient(to bottom, rgb(255, 255, 255), #fffc4f);
            -webkit-background-clip: text;
            background-clip: text;
        }

        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(180deg, rgba(238, 142, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(180deg, rgba(238, 142, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }

        .border::after {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, rgba(238, 142, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }

        .border::before {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 1px;
            height: 10px;
            content: "";
            background: linear-gradient(0deg, rgba(238, 142, 1) 0%, rgba(0, 0, 0, 0) 100%);
        }
    }

    .bottom-table-box {
        box-sizing: border-box;
        width: 100%;
        height: 278px;
        padding: 12px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}
</style>
