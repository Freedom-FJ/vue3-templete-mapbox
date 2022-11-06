<!--
 * @Author: mjh
 * @Date: 2022-10-13 09:55:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:28:32
 * @Description:
-->
<template>
    <commonPanel title="督查在线" :height="176">
        <template #subTitle>
            <div class="text-14 cur title-detail" @click="$router.push({ path: '/closedLoop/ClosedLoopSupervision' })">
                &nbsp; 进入详情》
            </div>
        </template>
        <template #mainContent>
            <div class="warn-content">
                <div class="bottom-box flex-bw-c">
                    <div v-for="item, index in list" :key="index" class="box">
                        <div class="title text-14 mgb8 t-c">
                            {{ item.name }}
                        </div><div class="num-box flex-c-c mg-a">
                            <div class="num num-24">
                                {{ item.value }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="torrent-warning">
import { getSetTreeCode } from '@/utils/treeDataUtils'
import { hangZhouKey } from '@/symbols'
import service from '@/service/api'
const hangZhouInfo = inject(hangZhouKey)
interface xingxiang {
        'jkbh': '0024'
        'ywc': '644'
        'zs': '713'
        'xzqh': '330110'
        'dywc': 0
        'dzs': 0
        'createTime': '2021-12-21 09:52:48'
        'updateTime': '2022-11-04 14:54:14'
    }

const data = reactive({
    list: [
        { name: '问题数', value: 100 },
        { name: '未达序时进度', value: 90 },
        { name: '已达序时进度', value: 50 },
        { name: '已完成', value: 40 },
    ]
})

onMounted(() => {
})

const getData = async () => {
    const areaCode = await getSetTreeCode()
    const idList = ['0024', '0001', '0002', '0023']
    const resList = await Promise.all(idList.map(item => getCentralSupervision(areaCode, item)))
    // 计算总的问题数
    data.list[0].value = resList.reduce((pre, cur) => {
        return pre + cur.uncompet
    }, 0)
    data.list[3].value = resList.reduce((pre, cur) => {
        return pre + cur.competed
    }, 0)
}

const getCentralSupervision = async (areaCode: string, jkbh: string) => {
    const res = await service< xingxiang[]>('close/enforceGetData', { areaCode, jkbh }, {
        token: hangZhouInfo?.token ?? '',
        authorization: `Bearer ${hangZhouInfo?.authorization}`
    })
    let competed = 0
    let uncompet = 0
    if (res.data && Array.isArray(res.data)) {
        res.data.forEach((item) => {
            competed += parseInt(item.ywc)
            uncompet += parseInt(item.zs)
        })
    }
    return {
        competed, // 已完成
        uncompet // 总问题数 （变量名称取得有点歧义，忽略）
    }
}

watch(() => hangZhouInfo?.authorization, (val) => {
    if (!val) return
    getData()
}, { immediate: true })
const { list } = toRefs(data)
</script>

<style lang="scss" scoped>
.title-detail {
    color: rgba(255, 255, 255, 0.7);
}

.title-detail:hover {
    color: #00e5ff;
}

.warn-content {
    width: 100%;
    height: 100%;
    padding: 16px 11px 0;

    .bottom-box {
        .num-box {
            width: 72px;
            height: 66px;
        }

        .box:nth-child(1) {
            .title {
                padding-bottom: 2px;
                color: #34eae3;
            }

            .num-box {
                background-image: url(@/assets/images/sewageTreatment/jccs.png);
            }

            .num {
                color: #34eae3;
            }
        }

        .box:nth-child(2) {
            .title {
                padding-bottom: 2px;
                color: #f54455;
            }

            .num-box {
                background-image: url(@/assets/images/sewageTreatment/fxwt.png);
            }

            .num {
                color: #f54455;
            }
        }

        .box:nth-child(3) {
            .title {
                padding-bottom: 2px;
                color: #ff9902;
            }

            .num-box {
                background-image: url(@/assets/images/sewageTreatment/zgs.png);
            }

            .num {
                color: #ff9902;
            }
        }

        .box:nth-child(4) {
            .title {
                padding-bottom: 2px;
                color: #2ac94f;
            }

            .num-box {
                background-image: url(@/assets/images/sewageTreatment/zgl.png);
            }

            .num {
                color: #2ac94f;
            }
        }
    }
}
</style>
