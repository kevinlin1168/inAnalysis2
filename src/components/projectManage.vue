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

        <el-col :span="24" v-show="isShowFileDetail">
            <el-table
                    :data="fileList"
                    style="width: 100%">
                <el-table-column
                    prop="name"
                    label="File Name"
                    min-width="20%">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="File Type"
                    min-width="40%">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status"
                    min-width="10%">
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
                        <el-button @click="onFilePreviewClick(scope.row.id)" type="text" size="medium">Preview</el-button>
                        <el-button @click="onFileDownloadClick(scope.row.id)" type="text" size="medium">Download</el-button>
                        <el-button @click="onPreProcessingClick(scope.row.id)" type="text" size="medium">Pre-processing</el-button>
                        <el-button @click="onSelectToTrainClick(scope.row.id)" type="text" size="medium">Select to train</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.status === 'Inuse'" type="text" size="medium" disabled>Delete</el-button>
                        <el-button v-if="scope.row.status !== 'Inuse'" @click="onFileDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    
        <!-- model block -->
        <el-col :span="16" class="gridSubTitle"> Model List </el-col>
        <el-col :span="3" class="gridSubTitle"> Total Models</el-col>
        <el-col :span="2" class="gridSubTitle"> {{modelSum}}</el-col>
        <el-col :span="2" class="gridSubTitle" v-show="fileList.length">
            <el-tooltip content="Add model" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="onAddModelClick"></i>
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
                        prop="name"
                        label="Model Name"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        prop="fileName"
                        label="Using File"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        prop="algo"
                        label="Algorithm Name"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status"
                    min-width="10%">
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
                        <el-button @click="onModelPreviewClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status === 'Training'">Preview</el-button>
                        <el-button @click="onModelPredictClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status !== 'Success'">Predict</el-button>
                        <el-button @click="onModelManagementClick(scope.row.id)" type="text" size="medium" :disabled="scope.row.status === 'Training'">Management</el-button>
                        <!-- Delete Button -->
                        <el-button v-if="scope.row.status === 'Training'" type="text" size="medium" disabled>Delete</el-button>
                        <el-button v-if="scope.row.status !== 'Training'" @click="onModelDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <!-- Popup -->

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

        <!-- add model popup-->
        <el-dialog :title='"Add Model"' :visible.sync="isShowAddModelPopup">
            <el-form :model="modelForm">
                <el-form-item label="Model Name" :label-width="labelWidth">
                    <el-input v-model="modelForm.modelName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="File" :label-width="labelWidth">
                    <el-select v-model="modelForm.fileID" placeholder="Please select file">
                        <el-option class="option" v-for="item in fileList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onAddModelCancel">Cancel</el-button>
                <el-button type="primary" @click="onAddModelConfirm">Confirm</el-button>
            </div>
        </el-dialog>

        <!-- select to train popup-->
        <el-dialog :title='"Add Model"' :visible.sync="isShowSelectToTrainPopup">
            <el-form :model="modelForm">
                <el-form-item label="Model Name" :label-width="labelWidth">
                    <el-input v-model="modelForm.modelName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onAddModelCancel">Cancel</el-button>
                <el-button type="primary" @click="onAddModelConfirm">Confirm</el-button>
            </div>
        </el-dialog>

        <!-- preview file popup-->
        <el-dialog class="filePreview" :title='selectFile.name + " Preview"' :visible.sync="isShowFilePreviewPopup" :show-close='false'>
            <el-form>
                <el-form-item label="Chart" :label-width="labelWidth">
                    <el-select v-model="selectChart" placeholder="Please select chart">
                        <el-option
                                v-for="item in chartOptionList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form v-if="selectChart" :rules="featureRule">
                <el-form-item label="Feature" :label-width="labelWidth" prop="feature">
                    <el-select v-for="(item, index) in featureOptionList" 
                                v-model="selectFeature[index]" 
                                placeholder="Please select feature"
                                @change="onSelectFeatureChange()" 
                                :key="index">
                        <el-option
                                v-for="option in item.option"
                                :key="option"
                                :label="option"
                                :value="option">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="imgBlock" v-if="isShowFilePreviewBlock">
                <div class="title">FilePreview</div>
                <el-carousel trigger="click" height="400px" :autoplay="false">
                    <el-carousel-item v-for="item in fileImgList" :key="item">
                        <div v-html="item">
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onFilePreviewClose">Close</el-button>
            </div>
        </el-dialog>

        <!-- preview model popup-->
        <el-dialog :title='selectModel.name + " Preview"' :visible.sync="isShowModelPreviewPopup" :show-close='false'>
            <div class="textBolck">
                <div class="title">TextPreview</div>
                
            </div>
            <div class="formBlock">
                <div class="title">FormPreview</div>
            </div>
            <div class="imgBlock">
                <div class="title">ModelPreview</div>
                <el-carousel trigger="click" height="400px" :autoplay="false">
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
    </el-row>


</template>

<script>
    import { file_upload_url } from '@/config/api.js';
    export default {
        name: "projectManage",
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data() {
            let validateFeature = (rule, value, callback) => {
                console.warn('test');
                let errorFlag = false;
                for (let i = 0; i < this.selectFeature.length - 1; i++) {
                    for (let j = i+1; i < this.selectFeature.length; j++) {
                        if (this.selectFeature[i] === this.selectFeature[j]) {
                            errorFlag = true;
                        }
                    }
                }
                if (errorFlag) {
                    callback(new Error('Select same feature'));
                } else {
                    callback();
                }
            };
            return {
                html: '',
                projectID: '',
                modelSum: 0,
                fileSum: 0,
                isShowModelDetail: false,
                isShowFileDetail: false,
                isShowAddModelPopup: false,
                isShowAddFilePopup: false,
                isShowSelectToTrainPopup: false,
                isShowFilePreviewPopup: false,
                isShowModelPreviewPopup: false,
                isShowUploadBlock: true,
                isSelectFectureError: false,
                isShowFilePreviewBlock: false,
                labelWidth: '120px',
                selectFile: {},
                selectModel: {},
                selectChart: '',
                selectFeature: [],
                fileImgList: [],
                modelImgList: [],
                modelList: [
                    {
                        name: 'aaa',
                        fileName: 'aaa',
                        id: '123',
                        algo: 'ccc',
                        status: 'Success'
                    }, {
                        name: 'abc',
                        fileName: 'aaa',
                        id: '456',
                        algo: 'csad',
                        status: 'Training'
                    }, {
                        name: 'aaasdfaa',
                        fileName: 'aaa',
                        id: '231',
                        algo: 'adf',
                        status: 'Fail'
                    }
                ],
                modelForm: {
                    modelName: '',
                    fileID: ''
                },
                fileForm: {
                    modelName: ''
                },
                fileList: [
                    {
                        name: 'aaa',
                        id: 'test1',
                        type: 'ccc',
                        status: 'Inuse'
                    }, {
                        name: 'abc',
                        id: 'test2',
                        type: 'csad',
                        status: 'NotInuse'
                    }, {
                        name: 'aaasdfaa',
                        id: 'test3',
                        type: 'adf',
                        status: 'NotInuse'
                    }
                ],
                chartOptionList: [
                    'test1', 'test2'
                ],
                featureOptionList: [
                    {
                        name: 'aaa',
                        option: [
                            'test',
                            'test1',
                            'sdf',
                            'asdf'
                        ]
                    },
                    {
                        name: 'bbb',
                        option: [
                            'test',
                            'test1'
                        ]
                    }
                ],
                featureRule: {
                    feature: [
                        { validator: validateFeature, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            fetchData() {
                this.projectID = this.$route.params.projectID;
                //TODO get modelSum fileSum by projectID && get project
            },
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
                this.$message({
                    type: 'info',
                    message: 'Add Canceled'
                });
                this.clearModelForm();
                this.isShowSelectToTrainPopup = false;
                this.isShowAddModelPopup = false;
            },
            onAddModelConfirm() {
                //TODO check status
                this.$message({
                    type: 'success',
                    message: 'Add Succeeded!'
                });
                let file = this.findSelectFile(this.modelForm.fileID);

                this.modelList.push({
                    name: this.modelForm.modelName,
                    fileName: file.name,
                    algo: '',
                    status: 'none'
                });
                this.clearModelForm();
                this.isShowSelectToTrainPopup = false;
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
                    //TODO delete file and refresh fileList
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
                let fileObj = params.file;
                let form = new FormData();
                form.append("file", fileObj);
                //TODO get type
                form.append("type", "num");
                form.append("userID", window.localStorage.getItem('userID'));
                form.append("token", window.localStorage.getItem('token'))
                this.$http.post(file_upload_url, form).then((response) => {
                    console.warn(response);
                })
                console.warn(fileObj);

                // TODO delete this block
                this.fileList.push({
                    name: fileObj.name,
                    id: fileObj.uid,
                    type: fileObj.type,
                    status: 'NotInuse'
                });
                this.$refs.upload.clearFiles();
                this.isShowUploadBlock = true;
                this.isShowAddFilePopup = false;
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
            },
            onSelectToTrainClick(fileID) {
                this.modelForm.fileID = fileID;
                this.isShowSelectToTrainPopup = true;
            },
            onPreProcessingClick(fileID) {
                this.findSelectFile(fileID);
                this.$router.push({name: 'filePreProcessing', params: {projectID: this.projectID,fileID: fileID}})
            },
            onFilePreviewClick(fileID) {
                this.selectFile = this.findSelectFile(fileID);
                this.isShowFilePreviewPopup = true;
            },
            onModelPreviewClick(modelID) {
                this.selectModel = this.findSelectModel(modelID);
                this.isShowModelPreviewPopup = true
            },
            onModelPredictClick(modelID) {
                this.$router.push({name: 'modelPredict', params: {projectID: this.projectID, modelID: modelID}})
            },
            onModelManagementClick(modelID) {
                this.$router.push({name: 'modelManagement', params: {projectID: this.projectID, modelID: modelID}})
            },
            onFileDownloadClick(fileID) {
                // TODO download file
                console.warn('Download', fileID);
            },
            clearModelForm() {
                this.modelForm = {
                    modelName: '',
                    fileID: ''
                }
            },
            findSelectFile(fileID) {
                let file = this.fileList.find(function(element) {
                    return fileID === element.id;
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
                this.selectFeature = [];
                this.isShowFilePreviewBlock = false;
            },
            onModelPreviewClose() {
                this.isShowModelPreviewPopup = false;
                this.selectModel = {};
            },
            onSelectFeatureChange() {
                console.warn('featureChange');
                this.isShowFilePreviewBlock = false;
                this.isSelectFectureError = false;
                let bokehVersion = '1.3.4';
                this.fileImgList = [];
                for(let i = 0; i < this.featureOptionList.length; i++) {
                    console.warn('selectFeature', this.selectFeature[i]);
                    if(this.selectFeature[i] === null || this.selectFeature[i] === undefined) {
                        this.isSelectFectureError = true;
                        break;
                    }
                    for(let j = i+1; j <= this.featureOptionList.length; j++) {
                        if(this.selectFeature[i] === this.selectFeature[j]) {
                            this.isSelectFectureError = true;
                            break;
                        }
                    }
                }
                console.log('isSelectFectureError', this.isSelectFectureError)
                if (!this.isSelectFectureError) {
                    this.isShowFilePreviewBlock = true;
                    let option = {
                        headers:{
                            'Content-Type': 'application/form-urlencoded',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                    let link = document.createElement('link')
                    link.setAttribute('rel', 'stylesheet')
                    link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css')
                    link.setAttribute('type', 'text/css')
                    document.head.appendChild(link)
                    // 在头部插入js代码
                    let script = document.createElement('script')
                    script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js')
                    script.async = 'async'
                    document.head.appendChild(script)
                    // cdn的js加载完毕后再请求bokeh参数
                    let _this = this;
                    script.onload = () => {
                        let content = {
                            "tokenstr": "ab",
                            "tokenint": "293",
                            "fileUid":"num",
                            "algoname":"lineXY",
                            "datacol":"{\"x\":\"a\",\"y\":\"b\"}"
                        }
                        _this.$http.post("http://140.112.26.135:8787/viz/data/do",content, {emulateJSON:true}).then((response) => {
                            console.warn('success',response);
                            let temp = response.data.data.div;
                            _this.fileImgList.push(temp)
                            // 插入绘制script代码
                            let bokehRunScript = document.createElement('SCRIPT')
                            bokehRunScript.setAttribute('type', 'text/javascript')
                            let t = document.createTextNode(response.data.data.script)
                            bokehRunScript.appendChild(t)
                            document.body.appendChild(bokehRunScript)
                            // 绘制代码执行完后关闭等待画面
                            _this.loading = false
                        }, (response) => {
                            console.warn('error',response);
                        });
                    }
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
        .imgBlock{
            .title {
                text-align: center;
                font-size: 18px;
            }
        }
    }

    .ModelPreview {
        .textBlock {

        }
        .formBlock {

        }
        .imgBlock{
            .title {
                text-align: center;
                font-size: 18px;
            }
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