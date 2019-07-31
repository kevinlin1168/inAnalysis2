<template>
    <el-row>
        <el-col :span="24" class="grid-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/manage' }">Management</el-breadcrumb-item>
                <el-breadcrumb-item>Project name</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "projectManage",
        created: function() {
            console.warn(this.$route.params.id);
        }
    }
</script>

<style lang="scss" scoped>
    .grid-title {
        border-bottom-style: solid;
        font-size: 24px;
        border-width: 2px;

        .el-breadcrumb__item {
            font-size: 24px;
            margin-bottom: 5px;
        }
    }
</style>