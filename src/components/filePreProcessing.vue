<template>
    <el-row>
        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item @click="onBreadcrumbProjectClick">
                    <router-link :to="{name:'project',params:{projectID:this.projectID}}" replace>Project Name</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>File name</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="18" class="main" offset="3">
            <div class="title">
                File Pre-Processing
            </div>
            <div class="preProcessing">
                <el-row>
                    <!-- Head -->
                    <el-col :span="4" :offset="formOffset"> Column Name </el-col>
                    <el-col :span="5" style="text-align: center"> Filter Missing Value </el-col>
                    <el-col :span="5" style="text-align: center"> Normalize Algorithm </el-col>
                    <el-col :span="4" style="text-align: center"> Outliers Filter </el-col>
                    <el-col :span="5" v-if="isHasStringType" style="text-align: center"> Character processing </el-col>
                </el-row>
                <el-row class="selectAll">
                    <!-- Select All -->
                    <el-col :span="4" :offset="formOffset"> Select All </el-col>
                    <el-col :span="5"> 
                        <el-switch
                            v-model="value"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch> 
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> 
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" v-if="isHasStringType">
                        <el-select v-model="value" placeholder="请选择" multiple>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'filePreprocessing',
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data: function () {
            return {
                projectID : '',
                fileID: '',
                isHasStringType: true,
                columnList: [],
                normalizeOptionList: [],
                outlierOptionList: [],
                characterProcessingOptionList: [],
                formOffset: 1
            }
        },
        methods:{
           fetchData() {
                this.projectID = this.$route.params.projectID;
                this.fileID = this.$route.params.fileID;
                //TODO get file column list
           },
           onBreadcrumbProjectClick() {
               this.$router.push({name: 'project', params: {projectID: projectID}});
           },

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

    .main {
        margin-top: 5px;

        .title {
            font-size: 18px;
        }

        .preProcessing {
            margin-top: 5px;
            font-size: 14px; 
            

            .selectAll {
                display:  flex;
                align-items: center;
            }

            .el-switch {
                display:table;
                margin:0 auto;
            }

            .el-select {
                padding-right: 5px;
            }
        }
    }
</style>