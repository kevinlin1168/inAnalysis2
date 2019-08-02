<template>
    <el-row>

        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item>Project name</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <!-- file block -->
        <el-col :span="16" class="gridSubTitle"> File List </el-col>
        <el-col :span="3" class="gridSubTitle"> Total Files</el-col>
        <el-col :span="2" class="gridSubTitle"> {{fileSum}}</el-col>
        <el-col :span="2" class="gridSubTitle">
            <el-tooltip content="Add model" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="onAddFileClick"></i>
            </el-tooltip>
        </el-col>
        <el-col :span="1" class="gridSubTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowFileDetail" @click="onShowFileClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowFileDetail" @click="onShowFileClick"></i>
        </el-col>

            <!-- add file pop up -->
            <el-dialog :title='"Add File"' :visible.sync="isShowAddFilePopup" width="400px">
                <el-upload
                    ref = "upload"
                    class = "upload-demo"
                    action="no use"
                    :http-request="uploadSectionFile"
                    :limit= "1"
                    :on-exceed = "handleExceed"
                    :multiple = "false"
                    :auto-upload= "false"
                    :on-change = 'uploadFileChange'
                    :on-remove = 'uploadFileRemove'	
                    :drag = 'isShowUploadBlock'>
                    <i class="el-icon-upload" v-if="isShowUploadBlock"></i>
                    <div class="el-upload__text" v-if="isShowUploadBlock">Drag file to upload or <em>Click to upload</em></div>
                </el-upload>
                <div slot="footer" class="dialog-footer" v-if="!isShowUploadBlock">
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitClick">Submit</el-button>
                </div>
            </el-dialog>

        <el-col :span="24" v-show="isShowFileDetail">
            <el-table
                    :data="fileList"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="File Name">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="File Type">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status">
                    <template slot-scope="scope">
                        <el-tag
                        style="width: 80px; text-align: center;"
                        size = 'medium'
                        :type="fileTagTransform(scope.row.status)"
                        disable-transitions> Inuse
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="30%">
                    <template slot-scope="scope" style="text-align: right">
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium">Preview</el-button>
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium">Download</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.status === 'Inuse'" type="text" size="medium" disabled>Delete</el-button>
                        <el-button v-if="scope.row.status !== 'Inuse'" @click="onFileDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    
        <!-- modle block -->
        <el-col :span="16" class="gridSubTitle"> Model List </el-col>
        <el-col :span="3" class="gridSubTitle"> Total Models</el-col>
        <el-col :span="2" class="gridSubTitle"> {{modelSum}}</el-col>
        <el-col :span="2" class="gridSubTitle">
            <el-tooltip content="Add model" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="onAddModelClick"></i>
            </el-tooltip>
        </el-col>
        <el-col :span="1" class="gridSubTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowModelDetail" @click="onShowDetailClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowModelDetail" @click="onShowDetailClick"></i>
        </el-col>

            <!-- add model popup-->
            <el-dialog :title='"Add Model"' :visible.sync="isShowAddModelPopup">
                <el-form :model="modelForm">
                    <el-form-item label="Model Name" :label-width="addModlePopupWidth">
                        <el-input v-model="modelForm.modelName" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="onAddModelCancel">Cancel</el-button>
                    <el-button type="primary" @click="onAddModelConfirm">Confirm</el-button>
                </div>
            </el-dialog>

        <!-- Model Detail Block -->
        <el-col :span="24" v-show="isShowModelDetail">
            <el-table
                    :data="modelList"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="Model Name"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                        prop="algo"
                        label="Algorithm Name"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status"
                    min-width="20%">
                    <template slot-scope="scope">
                        <el-tag
                        style="width: 80px; text-align: center;"
                        size = 'medium'
                        :type="modelTagTransform(scope.row.status)"
                        disable-transitions>{{scope.row.status}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="30%">
                    <template slot-scope="scope" style="text-align: right">
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status !== 'Success'">Preview</el-button>
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status !== 'Success'">Predict</el-button>
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status === 'Training'">Management</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.status === 'Training'" type="text" size="medium" disabled>Delete</el-button>
                        <el-button v-if="scope.row.status !== 'Training'" @click="onModelDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "projectManage",
        created: function() {
            this.projectID = this.$route.params.id;

            //TODO get modelSum fileSum by projectID
        },
        data: function() {
            return {
                projectID: '',
                modelSum: 0,
                fileSum: 0,
                isShowModelDetail: false,
                isShowFileDetail: false,
                isShowAddModelPopup: false,
                isShowAddFilePopup: false,
                isShowUploadBlock: true,
                addModlePopupWidth: '120px',
                modelList: [
                    {
                        name: 'aaa',
                        algo: 'ccc',
                        status: 'Success'
                    }, {
                        name: 'abc',
                        algo: 'csad',
                        status: 'Training'
                    }, {
                        name: 'aaasdfaa',
                        algo: 'adf',
                        status: 'Fail'
                    }
                ],
                modelForm: {
                    modelName: ''
                },
                fileForm: {
                    modelName: ''
                },
                fileList: [
                    {
                        name: 'aaa',
                        type: 'ccc',
                        status: 'Inuse'
                    }, {
                        name: 'abc',
                        type: 'csad',
                        status: 'NotInuse'
                    }, {
                        name: 'aaasdfaa',
                        type: 'adf',
                        status: 'NotInuse'
                    }
                ],
                uploadFileList: []
            }
        },
        methods:{
            onShowDetailClick() {
                this.isShowModelDetail = !this.isShowModelDetail;
            },
            onShowFileClick() {
                this.isShowFileDetail = !this.isShowFileDetail;
            },
            onAddModelClick() {
                this.isShowAddModelPopup = true;
            },
            onAddFileClick() {
                this.isShowAddFilePopup = true;
            },
            onAddModelCancel() {
                this.modelForm = {
                    modelName: ''
                };
                this.$message({
                    type: 'info',
                    message: 'Add Canceled'
                });
                this.isShowAddModelPopup = false;
            },
            onAddModelConfirm() {
                //TODO check status
                this.$message({
                    type: 'success',
                    message: 'Add Succeeded!'
                })
                this.modelList.push({
                    name: this.modelForm.modelName,
                    algo: '',
                    status: 'none'
                })
                this.isShowAddModelPopup = false;
            },
            onModelDeleteClick(modelID) {
                console.warn(modelID);
                this.$confirm('Do you want to confirm the deletion?', 'Hint', {
                    confirmButtonText: 'Conform',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: 'Delete Succeeded!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete Canceled'
                    });
                });
            },
            onFileDeleteClick(fileID) {
                console.warn(fileID);
                this.$confirm('Do you want to confirm the deletion?', 'Hint', {
                    confirmButtonText: 'Conform',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: 'Delete Succeeded!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete Canceled'
                    });
                });
            },
            uploadSectionFile(params) {
                console.warn('params',params);
                let fileObj = params.file;
                let FileController = "http://140.112.26.135:8787/upload";
                let form = new FormData();
                form.append("file", fileObj);
                form.append("type", "num");
                form.append("tokenstr", "ab");
                form.append("tokenint", "293")
                let xhr = new XMLHttpRequest();
                xhr.open("post", FileController, true);
                xhr.onload = function () {
                    console.warn(xhr.response);
                    this.$message({
                        message: '恭喜你，上传成功!',
                        type: 'success'
                    });
                };
                xhr.send(form);
            },
            handleExceed() {
                this.$message({
                    type: 'error',
                    message: 'Only one file can be uploaded at a time'
                });
            },
            uploadFileChange(file, fileList) {
                if(fileList.length === 1) {
                    this.isShowUploadBlock = false;
                }
            },
            uploadFileRemove() {
                this.isShowUploadBlock = true;
            },
            onSubmitClick() {
                this.$refs.upload.submit();
            },
            modelTagTransform(status) {
                if(status === 'Success') {
                    return 'success';
                } else if (status === 'Training') {
                    return 'warning';
                } else if (status === 'Fail') {
                    return 'danger';
                } else {
                    return 'info';
                }
            },
            fileTagTransform(status) {
                if(status === 'Inuse') {
                    return 'warning';
                } else if (status === 'NotInuse') {
                    return 'info';
                }
            }
        }
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
    }

    .gridSubTitle {
        border-bottom-style: solid;
        font-size: 18px;
        border-width: 1px;
        margin-top: 5px;

        .projectInfo {
            margin: auto;
        }
    }
    
</style>