<template>
    <el-row>
        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item @click="onBreadcrumbProjectClick">
                    <router-link :to="{name:'project',params:{projectID:this.projectID}}" replace>{{projectName}}</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{fileName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="18" class="main" :offset="3" v-if="isReady">
            <preprocessingComponent 
            :normalizeOptionList='normalizeOptionList'
            :outlierOptionList='outlierOptionList'
            :characterProcessingOptionList='characterProcessingOptionList'
            :fileID='fileID'
            :isHasStringType='isHasStringType'
            :columnList='columnList'
            :selectAllMissingValue='selectAllMissingValue'>
            </preprocessingComponent>
            <el-row class="inputFileName">
                <el-col :span="12" :offset="6">
                    <el-form ref="form" :model="form" label-width="200px" :rules="rules">
                        <el-form-item label="File Name After Processing" prop="fileNameAfterProcessing">
                            <el-input v-model="form.fileNameAfterProcessing" placeholder="please input file name"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class="buttonBlock">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>

        </el-col>
    </el-row>
</template>
<script>
    import { file_getColumn_url, analytic_getPreprocessAlgo_url, analytic_doPreprocess_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    import preprocessingComponent from './preprocessingComponent'
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
                fileName: '',
                form: {
                    fileNameAfterProcessing: ''
                },
                projectName: '',
                isHasStringType: true,
                columnList: [],
                normalizeOptionList: [],
                outlierOptionList: [],
                characterProcessingOptionList: [],
                selectAllMissingValue: true,
                rules: {
                    fileNameAfterProcessing: [
                        { required: true, message: 'please input file name', trigger: 'blur' }
                    ]
                },
                isReady: false
            }
        },
        methods:{
            fetchData() {
                if(this.$route.name == 'filePreProcessing') {
                    this.projectName = JSON.parse(window.localStorage.getItem('project')).projectName;
                    this.fileName = JSON.parse(window.localStorage.getItem('file')).fileName;
                    this.projectID = this.$route.params.projectID;
                    this.fileID = this.$route.params.fileID;
                    let fileColumnForm = {
                        fileID: this.fileID,
                        token: window.localStorage.getItem('token')
                    }
                    this.isHasStringType = false;
                    post(file_getColumn_url, fileColumnForm).then((resp) => {
                        if(resp.data.status == 'success') {
                            console.warn(resp);
                            this.columnList = resp.data.data.cols;
                            for(let column of this.columnList) {
                                if(column.type == 'string') {
                                    this.isHasStringType = true
                                }
                                column.selectMissingValue = this.selectAllMissingValue;
                            }

                            let form = {
                                token: window.localStorage.getItem('token')
                            }
                            this.normalizeOptionList = [{
                                friendlyname: 'Not to process',
                                algoname: ''
                            }];
                            this.outlierOptionList = [{
                                friendlyname: 'Not to process',
                                algoname: ''
                            }];
                            this.characterProcessingOptionList = [{
                                friendlyname: 'Not to process',
                                algoname: ''
                            }];
                            post(analytic_getPreprocessAlgo_url, form).then((resp) => {
                                if(resp.data.status == 'success') {
                                    resp.data.data.normalize.forEach((item) => {
                                        this.normalizeOptionList.push(item);
                                    });
                                    resp.data.data.outlierFiltering.forEach((item) => {
                                        this.outlierOptionList.push(item);
                                    });
                                    resp.data.data.stringCleaning.forEach((item) => {
                                        this.characterProcessingOptionList.push(item);
                                    });
                                    this.isReady = true;
                                } else {
                                    console.error(resp);
                                }
                            });
                                } else {
                                    console.error(resp);
                                }
                            });
                }
                this.projectID = this.$route.params.projectID;
                this.fileID = this.$route.params.fileID;
                this.form.fileNameAfterProcessing = '';
                //TODO get file column list && set item.selectMissingValue = true
            },
            onBreadcrumbProjectClick() {
               this.$router.push({name: 'project', params: {projectID: this.projectID}});
            },
            onConfirmClick() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let action = [];
                        let isAlert = false;
                        let alertColumnName = '';
                        this.columnList.forEach((item) => {
                            if(item.classifiable == "1" && ((item.selectMissingValue) || !(item.selectOutliersAlgo == '' || item.selectOutliersAlgo == undefined) || !(item.selectNormalizeAlgorithm == '' || item.selectNormalizeAlgorithm == undefined) || !(item.selectCharterProcessing == undefined || item.selectCharterProcessing == ''))) {
                                isAlert = true;
                                alertColumnName = alertColumnName.concat(item.name, ' ');
                            }
                            let actionItem = {
                                'col': item.name,
                                "missingFiltering": (item.selectMissingValue) ? '1' : '0' ,
                                "outlierFiltering": (item.selectOutliersAlgo == '' || item.selectOutliersAlgo == undefined) ? '0': item.selectOutliersAlgo,
                                "normalize": (item.selectNormalizeAlgorithm == '' || item.selectNormalizeAlgorithm == undefined) ? '0': item.selectNormalizeAlgorithm,
                                "stringCleaning": (item.selectCharterProcessing == undefined || item.selectCharterProcessing == '') ? Array('0'): item.selectCharterProcessing
                            }
                            action.push(actionItem);
                        })
                        let processForm = {
                            fileID: this.fileID,
                            action: JSON.stringify(action),
                            fileNameAfterProcessing: this.form.fileNameAfterProcessing+'.'+JSON.parse(window.localStorage.getItem('file')).fileType,
                            userID: JSON.parse(window.localStorage.getItem('user')).userID,
                            projectID: this.projectID,
                            token: window.localStorage.getItem('token')
                        }
                        if(isAlert) {
                            this.$confirm('You are trying to modify a classifiable column ' + alertColumnName + '. Continue?', 'Really?', {
                                confirmButtonText: 'Confirm',
                                cancelButtonText: 'Cancel',
                                type: 'warning'
                            }).then(() => {
                                post(analytic_doPreprocess_url, processForm).then((resp) => {
                                    if(resp.data.status == 'success') {
                                        this.$message({
                                            type: 'success',
                                            message: 'Preprocess successfully'
                                        });
                                        this.$router.push({name: 'project', params: {projectID: this.projectID}})
                                    }
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: 'Preprocess cancel'
                                });          
                            });
                        } else {
                            post(analytic_doPreprocess_url, processForm).then((resp) => {
                                if(resp.data.status == 'success') {
                                    this.$message({
                                        type: 'success',
                                        message: 'Preprocess successfully'
                                    });
                                    this.$router.push({name: 'project', params: {projectID: this.projectID}})
                                }
                            })
                        }
                        
                    } else {
                        return false;
                    }
                });
                
            }
        },
        components: {
            preprocessingComponent
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
        border-radius: 0px;

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
        border-style:solid;
        border-top: none;
        border-width: 1px;
        padding: 10px;
        border-radius:10px;

        .title {
            font-size: 18px;
        }

        .preProcessing {
            margin-top: 5px;
            font-size: 14px; 
            

            .selectAll {
                display:  flex;
                align-items: center;
                margin-top: 10px;
            }

            .item {
                display:  flex;
                align-items: center;
                margin-top: 10px;
            }

            .inputFileName {
                display:  flex;
                align-items: center;
                margin-top: 10px;
            }

            .el-switch {
                display:table;
                margin:0 auto;
            }

            .el-select {
                display:table;
                margin:0 auto;
            }

            .fa-eye {
                display:table;
                margin:0 auto;
                cursor: pointer;
            }
        }

        .buttonBlock {
            margin-top: 10px;
            .el-button {
                display:table;
                margin:0 auto;
            }
        }
    }

    .previewPopup {
        .textBlock {
            font-size: 16px;
        }

        .imgBlock {
            margin-top: 10px;
            display:  flex;
            align-items: center;
            
            .leftImg {
                width: 300px;
                height: 200px;
                display:  flex;
                align-items: center;
            }

            .rightImg {
                margin-left: 20px;
                width: 300px;
                height: 200px;
                display:  flex;
                align-items: center;
            }
        }
    }
</style>