<template>
    <el-row>
        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <router-link :to="{name:'project',params:{projectID:this.projectID}}" replace>Project Name</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>Model name</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'modelPredict',
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data: function () {
            return {
                projectID : '',
                modelID: ''
            }
        },
        methods:{
           fetchData() {
                this.projectID = this.$route.params.projectID;
                this.modelID = this.$route.params.modelID;
           }
        },
        components: {
        },
        computed: {
        },
    }
</script>
<style lang="scss" scoped>
    .gridTitle {
        border-bottom-style: solid;
        font-size: 24px;
        border-width: 2px;

        .el-breadcrumb__item {
            font-size: 24px;
            margin-bottom: 5px;
        }

        a { 
            text-decoration: none;
        }
    }
</style>