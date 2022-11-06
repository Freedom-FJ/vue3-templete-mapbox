<!--
 * @Author: Tian
 * @Date: 2022-09-19 09:49:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 19:41:09
 * @Description:
-->
<template lang="pug">
.map-layer.bf-blur(ref='mapLayer')
    .map-bg
    .map-select
        .map-text
            span 图层
            img(src='@/assets/images/map/close.png' @click="closePop")
        el-scrollbar.layer-list
            .list-one(v-for='item, index in layerList' :key='index')
                .check-main
                    el-checkbox(
                        v-model="checkAll[item.name]"
                        :indeterminate="isIndeterminateObj[item.name]"
                        @change="handleCheckAllChange($event, item.name)") {{item.name}}
                    el-icon(:size='15' @click="foldClick(item.name)" v-if='!showObj[item.name]')
                        ArrowDown
                    el-icon(v-else :size='15' @click="foldClick(item.name)")
                        ArrowUp
                el-checkbox-group(
                    v-model="checkedSites[item.name]"
                    @change="handleCheckedSitesChange($event, item.name)"
                    v-show='!showObj[item.name]'
                )
                    el-checkbox(v-for="station in item.children" :key="station.name" :label="station.name")
                        .layer-item
                            .icon(v-if='item.stationCodes && (station.iconName !== "006" && station.iconName !== "007" && station.iconName !== "009")' :style='{backgroundImage: `url(${getAssetsFile(`map/point/${station.stationCodes === "1" || station.stationCodes === "-1" ? station.iconName : station.stationCodes}.png`)})`}')
                            .layer-name {{station.name}}
                            //- .layer-count (23)
</template>

<script lang="ts" setup name="set-map-style">
import { cloneDeep } from 'lodash-es'
import { useMapStore } from '@/store/map'
import { getMapLayerList } from '@/utils/waterUtils'
import { DataType, getAssetsFile } from '@/utils/tools'
import service from '@/service/api'
import { useBaseInfoStore } from '@/store/baseInfo'
/**
 * 关闭弹框事件
 */
const emit = defineEmits(['close-layer-pop', 'change-map-layer'])
const mapStore = useMapStore()
const data = reactive({
    layerList: [] as Record<string, any>[],
    showObj: {} as Record<string, any>,
    checkAll: {} as Record<string, any>,
    isIndeterminateObj: {} as Record<string, any>,
    siteTypeListObj: {} as Record<string, any>,
    checkedSites: {} as Record<string, any>,
})
const mapLayer = ref()

watch(() => mapStore.controlMapLayerHandle, (val) => {
    if (!val) return
    getLayerData(val)
})
onMounted(() => {
    getHeight()
})
/**
 * 复选框全选
 */
const handleCheckAllChange = (val: any, name: string) => {
    const resultList = data.siteTypeListObj.get(name).children.map((item: Record<string, any>) => {
        return item.name
    })
    data.checkedSites[name] = val ? resultList : []
    data.isIndeterminateObj[name] = false
    dealEmitData()
}
/**
 * 复选框单个选中
 */
const handleCheckedSitesChange = (value: any[], name: string) => {
    const checkedCount = value.length
    data.checkAll[name] = checkedCount === data.siteTypeListObj.get(name).children.length
    data.isIndeterminateObj[name] = checkedCount > 0 && checkedCount < data.siteTypeListObj.get(name).children.length
    data.checkedSites[name] = value
    dealEmitData()
}
/**
 * 图层选中数据处理和存储
 */
const dealEmitData = () => {
    const targetArr = []
    for (const key in data.checkedSites) {
        const ibj = {
            name: key,
            value: data.checkedSites[key]
        }
        targetArr.push(ibj)
    }
    targetArr.forEach((item: Record<string, any>) => {
        data.layerList.forEach((data: Record<string, any>) => {
            if (item.name === data.name && item.value.length) {
                const list = data.children.filter((child: Record<string, any>) =>
                    item.value.includes(child.name)
                )
                item.stationCodes = data.stationCodes
                item.children = list
            }
        })
    })
    mapStore.setMapLayerSelectedSites(targetArr)
}
/**
 * 获取所有图层数据
 */
const getLayerData = async (name: Arrayable<string> | Record<string, string[]>) => {
    const res = await getMapLayerList()
    data.layerList = res as Record<string, any>[]
    const dataMap: Map<string, any> = new Map<string, any>()
    data.layerList.forEach((item) => {
        getIcon(item)
        dataMap.set(item.name, item)
        data.checkedSites[item.name] = []
    })
    data.siteTypeListObj = dataMap
    setDefaultLayer(name)
}
/**
 * 获取站点数量
 */
const getLayerCount = async () => {
    const baseInfo = useBaseInfoStore()
    const treeData = baseInfo.getTreeCodeData
    Promise.all([service<Record<string, any>, true>('common/getMapLayerCount', {
        treeType: 1,
        treeId: '330110',
        stationCodes: '1,2,3,5,6,8,10,12,38,40,51,52,53,54,56,57,58,59,108'
    }), service<Record<string, any>, true>('common/getMapLayerPomsCount', {
        treeType: 1,
        treeId: '330110',
        stationCodes: '-1'
    })]).then((res) => {
        //
        // console.log(res, 'dddddfggggg')
    })
}
getLayerCount()
/**
 * 图标获取
 */
const getIcon = (item: Record<string, any>) => {
    // 添加判断：1：水环境，交接断面： border；-1：重点源、非重点源；-1,50：海洋；51,53,54,56,57：设施
    switch (item.stationCodes) {
    case '1':
        item.children.forEach((child: Record<string, any>) => {
            if (child.name.includes('断面'))
                child.iconName = 'border'
            else
                child.iconName = child.attributes[0].value
        })
        break
    case '-1':
        item.children.forEach((child: Record<string, any>, index: number) => {
            if (child.stationCodes === '-1')
                child.iconName = `-1-${index}`
        })
        break
    case '-1,50':
        item.children.forEach((child: Record<string, any>, index: number) => {
            if (child.stationCodes === '-1')
                child.iconName = '-1-A'
        })
        break
    case '51,53,54,56,57':
        item.children.forEach((child: Record<string, any>) => {
            if (child.name === '雨水管网' || child.name === '污水管网')
                child.stationCodes = 'ps'
            else if (child.name === '供水管网')
                child.stationCodes = 'gs'
        })
        break
    }
}
/**
 * 根据路由设置图层的默认选中
 */
const setDefaultLayer = (nameOrList: Arrayable<string> | Record<string, string[]>) => {
    // 当前全选，其他取消全选
    for (const key in data.checkAll)
        data.checkAll[key] = false
    function setLayerByName(name: string) {
        const resultList = data.siteTypeListObj.get(name).children.map((item: Record<string, any>) => {
            return item.name
        })
        data.checkedSites[name] = resultList
        data.checkAll[name] = true
        data.isIndeterminateObj[name] = false
    }
    if (typeof nameOrList === 'string') {
        setLayerByName(nameOrList)
    }
    else if (DataType(nameOrList, 'array')) {
        (nameOrList as string[]).forEach((item) => {
            setLayerByName(item)
        })
    }
    else {
        Object.keys(nameOrList).forEach((item) => {
            data.checkedSites[item] = (nameOrList as Record<string, string[]>)[item]
        })
    }
    dealEmitData()
}

/**
 * 监听路由变化
 */
/**
 * 动态获取高度
 */
const getHeight = () => {
    nextTick()
    // 计算的高度
    const calculateHeight = document.documentElement.clientHeight - 360
    mapLayer.value.style.height = `${calculateHeight}px`
}
/**
 * 点击箭头
 */
const foldClick = (name: string) => {
    data.showObj[name] = !data.showObj[name]
    data.showObj = cloneDeep(data.showObj)
}
const closePop = () => {
    emit('close-layer-pop', false)
}

const { layerList, showObj, isIndeterminateObj, checkAll, checkedSites } = toRefs(data)
</script>

<style lang="scss" scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #00b4d0;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #00b4d0;
}

.map-layer {
    position: absolute;
    right: 530px;
    bottom: 60px;
    z-index: 14;
    width: 240px;
    height: 428px;

    // background: rgba(0,0,0,0.25);
    border-radius: 8px;

    .map-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .map-select {
        position: absolute;
        width: 100%;
        height: 100%;

        .map-text {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: calc(100% - 16px);
            height: 40px;
            padding: 0 8px;
            margin: 0 8px;
            font-family: TRENDS;
            font-size: 14px;
            border-bottom: 1px solid rgba(7, 131, 250, 0.5);

            img {
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
        }

        .layer-list {
            height: calc(100% - 40px);
            padding: 8px 0;

            .check-main {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: calc(100% - 32px);
                height: 32px;
                padding: 0 8px;
                margin: 0 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;

                :deep(.el-checkbox) {
                    font-family: TRENDS;
                    font-size: 14px;
                    color: #fff;
                }

                .el-icon {
                    cursor: pointer;
                }
            }

            :deep(.el-checkbox-group) {
                padding: 0 24px;

                .el-checkbox {
                    width: 100%;

                    .el-checkbox__label {
                        color: #fff;

                        .icon {
                            background-color: rgba(255, 255, 255, 0.1);
                        }
                    }
                }

                .is-checked {
                    .el-checkbox__label {
                        color: #0df;

                        .icon {
                            background-color: rgba(0, 221, 255, 0.3);
                        }
                    }
                }
            }

            .layer-item {
                display: flex;
                align-items: center;
                font-family: TRENDS;
                font-size: 14px;

                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 8px;
                    background-position: center center;

                    // background-image: url(@/assets/images/map/point/001.png);
                    background-size: 16px 16px;
                    border-radius: 12px;
                }
            }
        }
    }
}
</style>

