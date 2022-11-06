<!--
 * @Author: Tian
 * @Date: 2022-09-23 08:48:41
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 11:24:19
 * @Description:
-->
<template>
    <div class="eva-res">
        <el-scrollbar class="img-content">
            <MainCentent @show-dialog="showDialog" />
        </el-scrollbar>
        <el-dialog
            v-model="dialogVisible"
            style="width: 1380px;"
        >
            <FiveResultDialog @close-panel="closePanel" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="five-water-index-eva-res">
const data = reactive({
    dialogVisible: false
})
const showDialog = () => {
    data.dialogVisible = true
}

const closePanel = () => {
    data.dialogVisible = false
}

const { dialogVisible } = toRefs(data)
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
    background: rgba(0, 0, 0, 0.01);
}

:deep(.el-dialog__header) {
    display: none;
}

.eva-res {
    width: 100%;
    height: 100%;

    .img-content {
        position: absolute;
        top: 112px;
        left: 0;
        z-index: 6;
        width: 100%;
        height: calc(100vh - 112px);
        padding: 0 32px;
    }
}
</style>
