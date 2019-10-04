<template>
    <el-row>

        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item>{{projectName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <!-- file block -->
        <el-col :span="16" class="gridSubTitle"> File List </el-col>
        <el-col :span="3" class="gridSubTitle"> Total Files</el-col>
        <el-col :span="2" class="gridSubTitle"> {{fileList.length}}</el-col>
        <el-col :span="2" class="gridSubTitle">
            <el-tooltip content="Add file" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="onAddFileClick"></i>
            </el-tooltip>
        </el-col>
        <el-col :span="1" class="gridSubTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowFileDetail" @click="onShowFileClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowFileDetail" @click="onShowFileClick"></i>
        </el-col>

        <el-col :span="24" v-show="isShowFileDetail">
            <el-table
                    :data="fileList"
                    style="width: 100%">
                <el-table-column
                    prop="fileName"
                    label="File Name"
                    min-width="20%">
                </el-table-column>
                <el-table-column
                    prop="fileType"
                    label="File Type"
                    min-width="40%">
                </el-table-column>
                <el-table-column
                    prop="fileStatus"
                    label="Status"
                    min-width="10%">
                    <template slot-scope="scope">
                        <el-tag
                        style="width: 80px; text-align: center;"
                        size = 'medium'
                        :type="fileTagTransform(scope.row.fileStatus)"
                        disable-transitions> Inuse
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="30%">
                    <template slot-scope="scope" style="text-align: right">
                        <el-button @click="onFilePreviewClick(scope.row)" type="text" size="medium">Preview</el-button>
                        <el-button @click="onFileDownloadClick(scope.row)" type="text" size="medium">Download</el-button>
                        <el-button @click="onPreProcessingClick(scope.row)" type="text" size="medium">Pre-processing</el-button>
                        <el-button @click="onSelectToTrainClick(scope.row.fileID)" type="text" size="medium">Select to train</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.fileStatus === 0" @click="onFileDeleteClick(scope.row.fileID)" type="text" size="medium" style="color: red">Delete</el-button>
                        <el-button v-if="scope.row.fileStatus !== 0" @click="onFileDeleteClick(scope.row.fileID)" type="text" size="medium" style="color: red" disabled>Delete</el-button> 
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    
        <!-- model block -->
        <el-col :span="16" class="gridSubTitle"> Model List </el-col>
        <el-col :span="3" class="gridSubTitle"> Total Models</el-col>
        <el-col :span="2" class="gridSubTitle"> {{modelList.length}}</el-col>
        <el-col :span="2" class="gridSubTitle" v-show="fileList.length">
            <el-tooltip content="Add model" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="onModelAddClick"></i>
            </el-tooltip>
        </el-col>
        <!-- for space-->
        <el-col :span="2" class="gridSubTitle" v-show="!fileList.length">
            <div>
                &nbsp
            </div>
        </el-col>
        <el-col :span="1" class="gridSubTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowModelDetail" @click="onShowDetailClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowModelDetail" @click="onShowDetailClick"></i>
        </el-col>

        <!-- Model Detail Block -->
        <el-col :span="24" v-show="isShowModelDetail">
            <el-table
                    :data="modelList"
                    style="width: 100%">
                <el-table-column
                        prop="modelName"
                        label="Model Name"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        prop="fileName"
                        label="Using File"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        prop="algoName"
                        label="Algorithm Name"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status"
                    min-width="10%">
                    <template slot-scope="scope">
                        <el-tooltip v-if="scope.row.status == 'fail'" class="item" effect="dark" :content="scope.row.failReason" placement="bottom">
                            <el-tag
                            style="width: 80px; text-align: center;"
                            size = 'medium'
                            :type="modelTagTransform(scope.row.status)"
                            disable-transitions>{{scope.row.status}}
                            </el-tag>
                        </el-tooltip>
                            <el-tag
                            v-if="scope.row.status != 'fail'"
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
                        <el-button @click="onModelPreviewClick(scope.row)" type="text" size="medium" :disabled="scope.row.status !== 'success'">Preview</el-button>
                        <el-button @click="onModelTestClick(scope.row)" type="text" size="medium" :disabled="scope.row.status !== 'success'">Test</el-button>
                        <el-button @click="onModelPredictClick(scope.row)" type="text" size="medium" :disabled="scope.row.status !== 'success'">Predict</el-button>
                        <el-button @click="onModelManagementClick(scope.row)" type="text" size="medium" :disabled="scope.row.status === 'train'">Management</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.status === 'train'" @click="onModelStopClick(scope.row.modelIndex)" type="text" size="medium" style="color: #E6A23C">Stop</el-button>
                        <el-button v-if="scope.row.status !== 'train'" @click="onModelDeleteClick(scope.row.modelIndex)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <!-- Popup -->

        <!-- add file pop up -->
        <el-dialog :title='"Add File"' :visible.sync="isShowAddFilePopup" width="400px" :before-close="onUploadSelectFileCloce">
            <el-upload
                    ref = "upload"
                    class = "upload-demo"
                    action="no use"
                    :http-request="uploadSelectionFile"
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

        <!-- add model popup-->
        <el-dialog :title='"Add Model"' :visible.sync="isShowAddModelPopup" :before-close="onAddModelCancel">
            <el-form :model="modelForm" :rules="modelRule" ref="modelForm">
                <el-form-item label="Model Name" :label-width="labelWidth" prop="modelName">
                    <el-input v-model="modelForm.modelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="File" :label-width="labelWidth" prop="fileID">
                    <el-select v-model="modelForm.fileID" placeholder="Please select file">
                        <el-option class="option" v-for="item in fileList" :label="item.fileName" :value="item.fileID" :key="item.fileID"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onAddModelCancel">Cancel</el-button>
                <el-button type="primary" @click="onAddModelConfirm">Confirm</el-button>
            </div>
        </el-dialog>

        <!-- select to train popup-->
        <el-dialog :title='"Add Model"' :visible.sync="isShowSelectToTrainPopup" :before-close="onAddModelCancel">
            <el-form :model="modelForm" ref="modelForm" :rules="modelRule">
                <el-form-item label="Model Name" :label-width="labelWidth" prop="modelName">
                    <el-input v-model="modelForm.modelName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onAddModelCancel">Cancel</el-button>
                <el-button type="primary" @click="onAddModelConfirm">Confirm</el-button>
            </div>
        </el-dialog>

        <!-- preview file popup-->
        <el-dialog class="filePreview" :title='selectFile.fileName + " Preview"' :visible.sync="isShowFilePreviewPopup" :before-close="onFilePreviewClose" :show-close='false' width="665px">
            <el-form>
                <el-form-item label="Chart" :label-width="labelWidth">
                    <el-select v-model="selectChart" @change="onSelectChartChange" placeholder="Please select chart">
                        <el-option
                                v-for="item in chartOptionList"
                                :key="item.algoname"
                                :label="item.friendlyname"
                                :value="item.algoname">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form v-if="selectChart">
                <el-form-item v-for="(item, index) in featureList" :label="'Feature: ' + item.name" :label-width="labelWidth" prop="feature" :key="index">
                    <el-select  v-model="selectColumn[index]" 
                                placeholder="Please select feature"
                                @change="onSelectColumnChange()" >
                        <template v-for="option in columnList">
                            <el-option
                                v-if="option.type == featureList[index].type || (option.type == 'int' && featureList[index].type == 'float')"
                                :key="option.name"
                                :label="option.name"
                                :value="option.name">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="imgBlock" v-if="isShowFilePreviewBlock">
                <div class="title">FilePreview</div>
                <div v-html="filePreviewImg">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onFilePreviewClose">Close</el-button>
            </div>
        </el-dialog>

        <!-- preview model popup-->
        <el-dialog class="modelPreview" :title='selectModel.modelName + " Preview"' :visible.sync="isShowModelPreviewPopup" :before-close="onModelPreviewClose" :show-close='false' width="665px">
            <div class="textBlock">
                <div class="title"> Text Preview</div>
                <div class="textPreview">{{textPreview}}</div>
            </div>
            <div class="imgBlock">
                <div class="title">Chart Preview</div>
                <el-carousel trigger="click" height="400px" width= "625px" :autoplay="false">
                    <el-carousel-item v-for="item in modelImgList" :key="item">
                        <div v-html="item">
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onModelPreviewClose">Close</el-button>
            </div>
        </el-dialog>

        <!-- test model popup-->
        <el-dialog class="filePreview" :title='selectModel.modelName + " Test"' :visible.sync="isShowModelTestPopup" :before-close="onModelTestClose" :show-close='false' width="665px">
            <el-form>
                <el-form-item label="File" :label-width="labelWidth">
                    <el-select v-model="selectTestFileID" @change="OnSelectTestFileChange" placeholder="Please select file">
                        <template v-for="item in fileList">
                            <el-option
                                    v-if="item.fileID !== selectModel.fileID"
                                    :key="item.fileID"
                                    :label="item.fileName"
                                    :value="item.fileID">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="Label" :label-width="labelWidth" v-if="projectType == 'abnormal'">
                    <el-select  v-model="selectTestLabel" @change="OnSelectTestLabelChange" placeholder="Please select a label">
                        <template v-for="label in testLabelList">
                            <el-option
                                    :key="label"
                                    :label="label"
                                    :value="label">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="textBlock" v-if="isShowTestImg">
                <div class="title"> Text Preview</div>
                <div class="textPreview">{{textPreview}}</div>
            </div>
            <div class="imgBlock" v-if="isShowTestImg">
                <div class="title">Chart Preview</div>
                <el-carousel trigger="click" height="400px" width= "625px" :autoplay="false">
                    <el-carousel-item v-for="item in modelImgList" :key="item">
                        <div v-html="item">
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onModelTestClose">Close</el-button>
            </div>
        </el-dialog>

        <!-- predict model popup-->
        <el-dialog class="filePreview" :title='selectModel.modelName + " Predict"' :visible.sync="isShowModelPredictPopup" :before-close="onModelPredictClose" :show-close='false' width="665px">
            <el-form :model="predictForm" ref="predictForm" :rules="predictRules">
                <el-form-item label="File" :label-width="labelWidth" prop="selectPredictFileID">
                    <el-select v-model="predictForm.selectPredictFileID" placeholder="Please select file">
                        <template v-for="item in fileList">
                            <el-option
                                    v-if="item.fileID !== selectModel.fileID"
                                    :key="item.fileID"
                                    :label="item.fileName"
                                    :value="item.fileID">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="Preprocess" :label-width="labelWidth">
                    <el-switch v-model="predictForm.isPreprocess" active-color="#13ce66" inactive-color="#ff4949" @change="$forceUpdate()"></el-switch>
                </el-form-item>
                <el-form-item label="Preprocess File Name" :label-width="labelWidth" v-if="predictForm.isPreprocess" prop="preprocessFileName">
                    <el-input v-model="predictForm.preprocessFileName"></el-input>
                </el-form-item>
                <el-form-item label="Predict File Name" :label-width="labelWidth" prop="predictFileName">
                    <el-input v-model="predictForm.predictFileName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onModelPredictConfirm">Confirm</el-button>
                <el-button type="primary" @click="onModelPredictClose">Close</el-button>
            </div>
        </el-dialog>
    </el-row>


</template>

<script>
    import { file_upload_url, 
            file_getFileList_url, 
            file_delete_url, 
            file_getColumn_url, 
            file_download_url, 
            visualize_getAlgo_url, 
            visualize_doVisualize_url, 
            model_addModel_url,
            model_getModelByProjectID_url,
            model_deleteModel_url,
            analytic_getModelPreview_url,
            analytic_doModelTest_url,
            analytic_doModelPredict_url,
            analytic_stopModelTraining_url,
            analytic_getModelParameter_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: "projectManage",
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data() {
            return {
                html: '',
                projectID: '',
                projectType: '',
                projectName: '',
                modelSum: 0,
                fileSum: 0,
                isShowModelDetail: false,
                isShowFileDetail: false,
                isShowAddModelPopup: false,
                isShowAddFilePopup: false,
                isShowSelectToTrainPopup: false,
                isShowFilePreviewPopup: false,
                isShowModelPreviewPopup: false,
                isShowModelTestPopup: false,
                isShowModelPredictPopup: false,
                isShowUploadBlock: true,
                isSelectFectureError: false,
                isShowFilePreviewBlock: false,
                isShowTestImg: false,
                labelWidth: '160px',
                selectFile: {},
                selectTestFileID: '',
                selectTestLabel: '', //for abnormal
                selectModel: {},
                selectChart: '',
                selectColumn: [],
                filePreviewImg: '',
                fileImgList: [],
                modelImgList: [],
                textPreview: '',
                columnList: [],
                modelList: [],
                modelForm: {
                    modelName: '',
                    fileID: ''
                },
                fileForm: {
                    modelName: ''
                },
                predictForm: {
                    selectPredictFileID: '',
                    preprocessFileName: '',
                    predictFileName: '',
                    isPreprocess: true
                },
                fileList: [],
                testLabelList: [], //for abnormal
                chartOptionList: [],
                featureList: [],
                loading: {},
                predictRules: {
                    selectPredictFileID: [
                        { required: true, message: 'Please select file', trigger: 'blur' }
                    ],
                    preprocessFileName: [
                        { required: true, message: 'Please input preprocess file mame', trigger: 'blur' }
                    ],
                    predictFileName: [
                        { required: true, message: 'Please input predict file name', trigger: 'blur' }
                    ]
                },
                modelRule: {
                    modelName: [
                        { required: true, message: 'Please input model name', trigger: 'blur' }
                    ],
                    fileID: [
                        { required: true, message: 'Please select file', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            fetchData() {
                if(this.$route.name == 'project') {
                    this.fullScreenLoading()
                    this.projectName = JSON.parse(window.localStorage.getItem('project')).projectName;
                    this.projectType = JSON.parse(window.localStorage.getItem('project')).projectType;
                    this.projectID = this.$route.params.projectID;
                    let form = {
                        projectID: this.projectID,
                        token: window.localStorage.getItem('token')
                    }
                    post(file_getFileList_url, form).then((resp) => {
                        if(resp.data.status == "success") {
                            this.fileList = resp.data.data.fileList;
                            let form = {
                                projectID: this.projectID,
                                token: window.localStorage.getItem('token')
                            }
                            post(model_getModelByProjectID_url, form).then((resp) => {
                                if(resp.data.status == "success") {
                                    this.modelList = resp.data.data.modelList;
                                    this.modelList.forEach((model) => {
                                        // TODO get model status
                                        if(model.status == undefined) {
                                            model.status = 'none';
                                        }
                                        if(model.algoName == null) {
                                            model.algoName = '--'
                                        }
                                        model['fileName'] = this.fileList.filter(item => item.fileID == model.fileID)[0].fileName
                                    })
                                    this.loadingClose();
                                } else {
                                    console.error('getModelListError', resp.data.msg)
                                }
                            })
                        } else {
                            console.error('getFileListError', resp.data.msg)
                        }
                    });
                    form = {
                        token: window.localStorage.getItem('token')
                    }
                    post(visualize_getAlgo_url, form).then((resp) => {
                        if(resp.data.status == "success") {
                            this.chartOptionList = resp.data.data.algos
                        }
                    
                    });
                }
                //TODO get modelSum fileSum by projectID && get project
            },
            onShowDetailClick() {
                this.isShowModelDetail = !this.isShowModelDetail;
            },
            onShowFileClick() {
                this.isShowFileDetail = !this.isShowFileDetail;
            },
            onModelAddClick() {
                this.isShowAddModelPopup = true;
            },
            onAddFileClick() {
                this.isShowAddFilePopup = true;
            },
            onAddModelCancel() {
                this.$message({
                    type: 'info',
                    message: 'Add Canceled'
                });
                this.clearModelForm();
                this.isShowSelectToTrainPopup = false;
                this.isShowAddModelPopup = false;
            },
            onAddModelConfirm() {
                this.$refs['modelForm'].validate((valid) => {
                    if(valid) {
                        this.fullScreenLoading();
                        let form = {
                            projectID: this.projectID,
                            fileID: this.modelForm.fileID,
                            userID: JSON.parse(window.localStorage.getItem('user')).userID,
                            modelName: this.modelForm.modelName,
                            token: window.localStorage.getItem('token')
                        }
                        post(model_addModel_url, form).then((resp) => {
                            if(resp.data.status == "success") {
                                this.$message({
                                    type: 'success',
                                    message: 'Add Model successfully!'
                                });
                                this.clearModelForm();
                                this.isShowSelectToTrainPopup = false;
                                this.isShowAddModelPopup = false;
                                this.fetchData();
                            } else {
                                console.error(resp.data.msg);
                            }
                            this.loadingClose();
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                })
                
                
            },
            onSelectToTrainClick(fileID) {
                this.modelForm.fileID = fileID;
                this.isShowSelectToTrainPopup = true;
            },
            onModelStopClick(modelIndex) {
                let form = {
                    modelIndex: modelIndex,
                    token: window.localStorage.getItem('token')
                }
                post(analytic_stopModelTraining_url, form).then((resp) => {
                    if(resp.data.status != 'success') {
                        console.error('stopModelTraining Error', resp.data.data.msg)
                    }
                    this.fetchData();
                }).catch((error) => {
                    console.error('stopModelTraining Error', error);
                    this.fetchData();
                })
            },
            onModelDeleteClick(modelIndex) {
                this.$confirm('Are you sure you want to delete this model?', 'Really?', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let form = {
                        modelIndex: modelIndex,
                        token: window.localStorage.getItem('token')
                    }
                    post(model_deleteModel_url, form).then((resp) => {
                        if(resp.data.status == 'success') {
                            this.$message({
                                type: 'success',
                                message: 'Delete successfully!'
                            });
                            this.fetchData();
                        }
                    }).catch((error) => {
                        console.error('Delete model error', error)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete Canceled'
                    });
                });
            },
            onFileDeleteClick(fileID) {
                this.$confirm('Are you sure you want to delete this file?', 'Really?', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let form = {
                        fileID: fileID,
                        token: window.localStorage.getItem('token')
                    }
                    post(file_delete_url, form).then((resp) => {
                        if(resp.data.status == "success") {
                            this.$message({
                                type: 'success',
                                message: 'Delete successfully!'
                            });
                            this.fetchData();
                        }
                    })
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete Canceled'
                    });
                });
            },
            onUploadSelectFileCloce() {
                this.$refs.upload.clearFiles();
                this.isShowUploadBlock = true;
                this.isShowAddFilePopup = false;
            },
            uploadSelectionFile(params) {
                let fileObj = params.file;
                let form = new FormData();
                form.append("file", fileObj);
                form.append("type", JSON.parse(window.localStorage.getItem('project')).dataType);
                form.append("userID", JSON.parse(window.localStorage.getItem('user')).userID);
                form.append("projectID", this.projectID)
                form.append("token", window.localStorage.getItem('token'))
                post(file_upload_url, form).then((response) => {
                    if (response.data.status == "success") {
                        this.fetchData();
                    }
                })

                this.$refs.upload.clearFiles();
                this.isShowUploadBlock = true;
                this.isShowAddFilePopup = false;
            },
            handleExceed() {
                this.$message({
                    type: 'error',
                    message: 'You can only upload one file at a time'
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
                if(status === 'success') {
                    return 'success';
                } else if (status === 'train') {
                    return 'warning';
                } else if (status === 'fail') {
                    return 'danger';
                } else {
                    return 'info';
                }
            },
            fileTagTransform(status) {
                if(status) {
                    return 'warning';
                } else {
                    return 'info';
                }
            },
            onPreProcessingClick(file) {
                window.localStorage.setItem('file', JSON.stringify(file))
                this.$router.push({name: 'filePreProcessing', params: {projectID: this.projectID,fileID: file.fileID}})
            },
            onFilePreviewClick(file) {
                this.selectFile = file
                let fileColumnForm = {
                        fileID: file.fileID,
                        token: window.localStorage.getItem('token')
                    }
                post(file_getColumn_url, fileColumnForm).then((resp) => {
                    if(resp.data.status == 'success') {
                        this.columnList = resp.data.data.cols;
                        this.isShowFilePreviewPopup = true;
                    } else {
                        console.error(resp);
                    }
                })
                
            },
            onModelPreviewClick(model) {
                this.selectModel = model;
                this.modelImgList = [];
                let bokehVersion = '1.3.4';
                let link = document.createElement('link')
                link.setAttribute('rel', 'stylesheet')
                link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css')
                link.setAttribute('type', 'text/css')
                document.head.appendChild(link)
                // 在header插入js
                let script = document.createElement('script')
                script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js')
                script.async = 'async'
                document.head.appendChild(script)
                // cdn的js載入完畢再请求bokeh參數
                let _this = this;
                script.onload = () => {
                    let link1 = document.createElement('link')
                    link1.setAttribute('rel', 'stylesheet')
                    link1.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.css')
                    link1.setAttribute('type', 'text/css')
                    document.head.appendChild(link1)
                    let script1 = document.createElement('script')
                    script1.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.js')
                    script1.async = 'async'
                    document.head.appendChild(script1)
                    script1.onload = () => {
                        let form = {
                            modelIndex: model.modelIndex,
                            token: window.localStorage.getItem('token')
                        }
                        post(analytic_getModelPreview_url, form).then((resp) => {
                            if(resp.data.status == 'success') {
                                _this.textPreview = resp.data.data.text;
                                let figObject = resp.data.data.fig;
                                let imgKeyList = Object.keys(figObject);
                                imgKeyList.forEach((key) => {
                                    _this.modelImgList.push(figObject[key].div);
                                    let bokehRunScript = document.createElement('SCRIPT');
                                    bokehRunScript.setAttribute('type', 'text/javascript');
                                    let t = document.createTextNode(figObject[key].script);
                                    bokehRunScript.appendChild(t);
                                    document.body.appendChild(bokehRunScript);
                                })
                                this.isShowModelPreviewPopup = true;
                            }
                         })
                    }
                }
            },
            onModelTestClick(model) {
                this.selectModel = model;
                this.isShowModelTestPopup = true;
            },
            doModelTest(modelIndex, fileID, token, label='') {
                this.isShowTestImg = false;
                this.fullScreenLoading();
                this.modelImgList = [];
                let bokehVersion = '1.3.4';
                let link = document.createElement('link')
                link.setAttribute('rel', 'stylesheet')
                link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css')
                link.setAttribute('type', 'text/css')
                document.head.appendChild(link)
                // 在header插入js
                let script = document.createElement('script')
                script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js')
                script.async = 'async'
                document.head.appendChild(script)
                // cdn的js載入完畢再请求bokeh參數
                let _this = this;
                script.onload = () => {
                    let link1 = document.createElement('link')
                    link1.setAttribute('rel', 'stylesheet')
                    link1.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.css')
                    link1.setAttribute('type', 'text/css')
                    document.head.appendChild(link1)
                    let script1 = document.createElement('script')
                    script1.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-widgets-' + bokehVersion + '.min.js')
                    script1.async = 'async'
                    document.head.appendChild(script1)
                    let form = {}
                    script1.onload = () => {
                        if (label != '') {
                            form = {
                                modelIndex: modelIndex,
                                fileID: fileID,
                                token: token,
                                label: label
                            }
                        } else {
                            form = {
                                modelIndex: modelIndex,
                                fileID: fileID,
                                token: token,
                            }
                        }
                        console.warn(form)
                        post(analytic_doModelTest_url, form).then((resp) => {
                            if(resp.data.status == 'success') {
                                _this.textPreview = resp.data.data.text;
                                let figObject = resp.data.data.fig;
                                let imgKeyList = Object.keys(figObject);
                                imgKeyList.forEach((key) => {
                                    _this.modelImgList.push(figObject[key].div);
                                    let bokehRunScript = document.createElement('SCRIPT');
                                    bokehRunScript.setAttribute('type', 'text/javascript');
                                    let t = document.createTextNode(figObject[key].script);
                                    bokehRunScript.appendChild(t);
                                    document.body.appendChild(bokehRunScript);
                                })
                                this.loadingClose();
                                this.isShowTestImg = true;
                            } else {
                                this.$message.error('Test file error please select other files');
                                this.loadingClose();
                                this.isShowTestImg = false;
                            }
                        }).catch((error) => {
                            console.error('Test Model Error', error);
                            this.$message.error('Test file error please select other files');
                            this.loadingClose();
                            this.isShowTestImg = false;
                        });
                    }
                }
            },
            OnSelectTestFileChange() {
                
                if(this.projectType != 'abnormal') {
                    this.doModelTest(this.selectModel.modelIndex, this.selectTestFileID, window.localStorage.getItem('token'))
                } else {
                    let form = {
                        modelIndex: this.selectModel.modelIndex,
                        token: window.localStorage.getItem('token')
                    };
                    console.warn(form)
                    post(analytic_getModelParameter_url, form).then((resp) => {
                        if(resp.data.status == 'success') {
                            let form = {
                                fileID: this.selectTestFileID,
                                token: window.localStorage.getItem('token')
                            }
                            post(file_getColumn_url, form).then((response) => {
                                if(response.data.status == "success") {
                                    this.testLabelList = [];
                                    let fileColumn = [];
                                    let inputColumn = [];
                                    let inputObj = JSON.parse(resp.data.data.input);
                                    for(let input in inputObj) {
                                        for(let index in inputObj[input]) {
                                            inputColumn.push(inputObj[input][index])
                                        }
                                    }
                                    response.data.data.cols.forEach((col) => {
                                        fileColumn.push(col.name)
                                    })
                                    fileColumn.forEach((label) => {
                                        if(!inputColumn.includes(label)) {
                                            this.testLabelList.push(label)
                                        }
                                    })
                                    this.loadingClose();
                                } else {
                                    this.loadingClose();
                                }
                            }).catch((error) => {
                                console.error('getModelParameter Error', error);
                                this.loadingClose();
                            });
                        }
                        
                    }).catch((error) => {
                        console.error('Get Model Parameter Error:', error)
                        this.loadingClose();
                    })
                }
            },
            OnSelectTestLabelChange() {
                this.doModelTest(this.selectModel.modelIndex, this.selectTestFileID, window.localStorage.getItem('token'), this.selectTestLabel)
            },
            onModelPredictClick(model) {
                this.selectModel = model;
                this.isShowModelPredictPopup = true;
                // this.$router.push({name: 'modelPredict', params: {projectID: this.projectID, modelIndex: model.modelIndex}})
            },
            onModelManagementClick(model) {
                let file = this.fileList.find(function(item) {
                    return model.fileID === item.fileID;
                });
                window.localStorage.setItem('model', JSON.stringify(model));
                window.localStorage.setItem('file', JSON.stringify(file));
                this.$router.push({name: 'modelManagement', params: {projectID: this.projectID, modelIndex: model.modelIndex}})
            },
            onFileDownloadClick(file) {
                let fileForm = {
                    fileID: file.fileID,
                    fileName: file.fileName+'.'+file.fileType,
                    token: window.localStorage.getItem('token')
                }
                post(file_download_url, fileForm, {responseType: 'blob'}).then((resp) => {
                    let blob = new Blob([resp.data], {type:resp.headers['content-type']});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileForm.fileName;
                    link.click();
                }).catch((error) => {
                    console.error(error)   
                })
            },
            clearModelForm() {
                this.modelForm = {
                    modelName: '',
                    fileID: ''
                }
            },
            findSelectFile(fileID) {
                let file = this.fileList.find(function(element) {
                    return fileID === element.fileID;
                });
                return file;
            },
            findSelectModel(modelID) {
                let model = this.modelList.find(function(element) {
                    return modelID === element.id;
                });
                return model;
            },
            onFilePreviewClose() {
                this.isShowFilePreviewPopup = false;
                this.selectChart = '';
                this.selectColumn = [];
                this.isShowFilePreviewBlock = false;
            },
            onModelPreviewClose() {
                this.isShowModelPreviewPopup = false;
                this.selectModel = {};
            },
            onModelTestClose() {
                this.selectTestLabel = '';
                this.selectTestFileID = '';
                this.isShowTestImg = false;
                this.isShowModelTestPopup = false;
            },
            onModelPredictConfirm() {
                this.$refs['predictForm'].validate((valid) => {
                    if(valid) {
                        let form = {
                            fileID: this.predictForm.selectPredictFileID,
                            modelIndex: this.selectModel.modelIndex,
                            preprocess: (this.predictForm.isPreprocess ? 1 : 0),
                            preprocessFileName: this.predictForm.preprocessFileName,
                            predictFileName: this.predictForm.predictFileName,
                            token: window.localStorage.getItem('token'),
                            projectID: this.projectID,
                            userID: JSON.parse(window.localStorage.getItem('user')).userID
                        }
                        console.warn(form)
                        post(analytic_doModelPredict_url, form).then((resp) => {
                            if(resp.data.status == 'success') {
                                if((resp.data.data.isPreprocess == 0) && this.predictForm.isPreprocess) {
                                    this.$message({
                                        message: 'Your file does not need to be preprocessed',
                                        type: 'warning'
                                    });
                                }
                                this.onModelPredictClose();
                                this.fetchData();
                            }
                        }).catch((error) => {
                            console.error('Predict Error', error)
                            this.$message.error('Error when predicting. Please select other files or try again.')
                        })
                    }
                });
            },
            onModelPredictClose() {
                this.isShowModelPredictPopup = false;
                this.predictForm = {
                    selectPredictFileID: '',
                    preprocessFileName: '',
                    predictFileName: '',
                    isPreprocess: true
                }
            },
            onSelectChartChange() {
                this.featureList = [];
                this.selectColumn = [];
                this.isShowFilePreviewBlock = false;
                let selectChartList = this.chartOptionList.filter(item => item.algoname == this.selectChart);
                let dataKeyList = Object.keys(selectChartList[0].data);
                dataKeyList.forEach((key) => {
                    if(selectChartList[0].data[key] !== 'none') {
                        let featureItem = {
                            name: key,
                            type: selectChartList[0].data[key]
                        }
                        this.featureList.push(featureItem);
                    }
                });
            },
            onSelectColumnChange() {
                this.isShowFilePreviewBlock = false;
                this.isSelectFectureError = false;
                let bokehVersion = '1.3.4';
                this.filePreviewImg = '';
                for(let i = 0; i < this.featureList.length; i++) {
                    if(this.selectColumn[i] === null || this.selectColumn[i] === undefined) {
                        this.isSelectFectureError = true;
                        break;
                    }
                    for(let j = i+1; j <= this.featureList.length; j++) {
                        if(this.selectColumn[i] === this.selectColumn[j]) {
                            this.isSelectFectureError = true;
                            break;
                        }
                    }
                }
                console.log('isSelectFectureError', this.isSelectFectureError)
                if (!this.isSelectFectureError) {
                    let link = document.createElement('link')
                    link.setAttribute('rel', 'stylesheet')
                    link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css')
                    link.setAttribute('type', 'text/css')
                    document.head.appendChild(link)
                    // 在header插入js
                    let script = document.createElement('script')
                    script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js')
                    script.async = 'async'
                    document.head.appendChild(script)
                    // cdn的js載入完畢再请求bokeh參數
                    let _this = this;
                    script.onload = () => {
                        let dataCol = {}
                        this.featureList.forEach((item, index) => {
                            dataCol[item.name] = this.selectColumn[index];
                        })
                        let form = {
                            'fileID': this.selectFile.fileID,
                            'algoName': this.selectChart,
                            'dataCol': JSON.stringify(dataCol),
                            'token': window.localStorage.getItem('token')
                        }
                        post(visualize_doVisualize_url,form, {emulateJSON:true}).then((response) => {
                            _this.filePreviewImg = response.data.data.div;
                            // _this.fileImgList.push(temp)
                            // 插入绘制script代码
                            let bokehRunScript = document.createElement('SCRIPT')
                            bokehRunScript.setAttribute('type', 'text/javascript')
                            let t = document.createTextNode(response.data.data.script)
                            bokehRunScript.appendChild(t)
                            document.body.appendChild(bokehRunScript)
                            _this.isShowFilePreviewBlock = true;
                        }, (response) => {
                            console.error('error',response);
                        });
                    }
                }
            },
            fullScreenLoading() {
                this.loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            },
            loadingClose() {
                this.loading.close();
            }
        }
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
    }

    .gridSubTitle {
        border-bottom-style: solid;
        font-size: 18px;
        border-width: 1px;
        margin-top: 5px;
        border-radius: 0px;

        .projectInfo {
            margin: auto;
        }
    }

    .filePreview {
        .textBlock {
            .textPreview {
                margin-top: 10px;
                white-space: pre-wrap;
            }
        }
        .imgBlock{
            width: 625px;
            .title {
                text-align: center;
                font-size: 18px;
            }
        }
    }

    .modelPreview {
        .textBlock {
            .textPreview {
                margin-top: 10px;
                white-space: pre-wrap;
            }
        }
        .imgBlock{
            margin-top: 10px;
        }
        .title {
            font-size: 18px;
        }
    }

    .el-select {
        width: 100%;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    
</style>