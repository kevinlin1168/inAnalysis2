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

        <el-col :span="18" class="main" :offset="3">
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
                            v-model="selectAllMissingValue"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="onselectAllMissingValueChange">
                        </el-switch> 
                    </el-col>
                    <el-col :span="5">
                        <el-select v-model="selectAllNormalizeAlgorithm" placeholder="please select" @change="selectAllNormalizeAlgorithmChange">
                            <el-option
                            v-for="item in normalizeOptionList"
                            :key="item.algoname"
                            :label="item.friendlyname"
                            :value="item.algoname">
                            </el-option>
                        </el-select> 
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="selectAllOutliersAlgo" placeholder="please select" @change="selectAllOutliersAlgoChange">
                            <el-option
                            v-for="item in outlierOptionList"
                            :key="item.algoname"
                            :label="item.friendlyname"
                            :value="item.algoname">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" v-if="isHasStringType">
                        <el-select v-model="selectAllCharterProcessing" placeholder="please select" multiple @change="selectAllCharterProcessingChange">
                            <el-option
                            v-for="item in characterProcessingOptionList"
                            :key="item.algoname"
                            :label="item.friendlyname"
                            :value="item.algoname">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="1"></el-col>
                </el-row>
                <el-row class="item" v-for="item in columnList" :key="item.name">
                    <!-- column -->
                    <el-col :span="4" :offset="formOffset"> {{item.name}} </el-col>
                    <el-col :span="5">
                        <el-switch
                                v-model="item.selectMissingValue"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="$forceUpdate()">
                        </el-switch>
                    </el-col>
                    <el-col :span="5">
                        <el-select v-if="item.type === 'int' || item.type === 'float'" v-model="item.selectNormalizeAlgorithm" placeholder="please select" @change="$forceUpdate()">
                            <el-option
                                    v-for="item in normalizeOptionList"
                                    :key="item.algoname"
                                    :label="item.friendlyname"
                                    :value="item.algoname">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'int' && item.type !== 'float'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-if="item.type === 'int' || item.type === 'float'" v-model="item.selectOutliersAlgo" placeholder="please select" @change="$forceUpdate()">
                            <el-option
                                    v-for="item in outlierOptionList"
                                    :key="item.algoname"
                                    :label="item.friendlyname"
                                    :value="item.algoname">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'int' && item.type !== 'float'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="5" v-if="isHasStringType">
                        <el-select v-model="item.selectCharterProcessing" placeholder="please select" multiple v-if="item.type === 'string'" @change="onSelectCharterProcessingChange(item)">
                            <el-option
                                    v-for="item in characterProcessingOptionList"
                                    :key="item.algoname"
                                    :label="item.friendlyname"
                                    :value="item.algoname">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'string'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="1" @click.native="onColumnPreviewClick(item)">
                        <i class="fas fa-eye"></i>
                    </el-col>
                </el-row>
                <el-row class="inputFileName">
                    <el-col :span="12" :offset="6">
                        <el-form ref="form" :model="form" label-width="200px" :rules="rules">
                            <el-form-item label="File Name After Processing" prop="fileNameAfterProcessing">
                                <el-input v-model="form.fileNameAfterProcessing" placeholder="please input file name"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="buttonBlock">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>

        </el-col>

        <!-- preview column popup-->
        <el-dialog class="previewPopup" :title='selectColumn.name + " Preview"' :visible.sync="isShowColumnPreviewPopup" :show-close='false' :before-close="onColumnPreviewClose">
            <div class="textBlock">
                {{showText}}
            </div>
            <div class="imgBlock" v-if="isHasImg">
                <div class="leftImg" v-html="leftImg">
                </div>
                <div class="rightImg" v-html="rightImg">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onColumnPreviewClose">Close</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import { file_getColumn_url, analytic_getPreprocessAlgo_url, analytic_doPreprocess_url, analytic_preprocessPreview_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
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
                selectColumn: {},
                projectID : '',
                fileID: '',
                fileName: '',
                form: {
                    fileNameAfterProcessing: ''
                },
                projectName: '',
                isHasStringType: true,
                columnList: [],
                isShowColumnPreviewPopup: false,
                isHasImg: true,
                normalizeOptionList: [],
                outlierOptionList: [],
                characterProcessingOptionList: [],
                formOffset: 0,
                selectAllMissingValue: true,
                selectAllNormalizeAlgorithm: '',
                selectAllOutliersAlgo: '',
                selectAllCharterProcessing: [''],
                storeSelectAllCharterProcessing: [],
                leftImg: '',
                rightImg: '',
                showText: '',
                rules: {
                    fileNameAfterProcessing: [
                        { required: true, message: 'please input file name', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            fetchData() {
                if(this.$route.name == 'filePreProcessing') {
                    this.projectName = window.localStorage.getItem('projectName');
                    this.fileName = window.localStorage.getItem('fileName');
                    this.projectID = this.$route.params.projectID;
                    this.fileID = this.$route.params.fileID;
                    let fileColumnForm = {
                        fileID: this.fileID,
                        token: window.localStorage.getItem('token')
                    }
                    this.isHasStringType = false;
                    post(file_getColumn_url, fileColumnForm).then((resp) => {
                        if(resp.body.status == 'success') {
                            console.warn(resp);
                            this.columnList = resp.body.data.cols;
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
                                friendlyname: 'Not processed',
                                algoname: ''
                            }];
                            this.outlierOptionList = [{
                                friendlyname: 'Not processed',
                                algoname: ''
                            }];
                            this.characterProcessingOptionList = [{
                                friendlyname: 'Not processed',
                                algoname: ''
                            }];
                            let _this = this;
                            post(analytic_getPreprocessAlgo_url, form).then((resp) => {
                                if(resp.body.status == 'success') {
                                    resp.body.data.normalize.forEach((item) => {
                                        this.normalizeOptionList.push(item);
                                    });
                                    resp.body.data.outlierFiltering.forEach((item) => {
                                        this.outlierOptionList.push(item);
                                    });
                                    resp.body.data.stringCleaning.forEach((item) => {
                                        this.characterProcessingOptionList.push(item);
                                    });
                                    _this.selectAllNormalizeAlgorithmChange();
                                    _this.selectAllOutliersAlgoChange();
                                    _this.selectAllCharterProcessingChange();
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
            onColumnPreviewClick(column) {
                console.warn('onColumnPreviewClick', column);
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
                    let action = []
                    let actionItem = {
                        'col': column.name,
                        "missingFiltering": (column.selectMissingValue) ? '1' : '0' ,
                        "outlierFiltering": (column.selectOutliersAlgo == '' || column.selectOutliersAlgo == undefined) ? '0': column.selectOutliersAlgo,
                        "normalize": (column.selectNormalizeAlgorithm == '' || column.selectNormalizeAlgorithm == undefined) ? '0': column.selectNormalizeAlgorithm,
                        "stringCleaning": JSON.stringify((column.selectCharterProcessing == undefined || column.selectCharterProcessing == '') ? Array('0'): column.selectCharterProcessing)
                    }
                    action.push(actionItem);
                    let processForm = {
                        fileID: this.fileID,
                        action: JSON.stringify(action),
                        token: window.localStorage.getItem('token')
                    }
                    let _this = this;
                    post(analytic_preprocessPreview_url, processForm).then((resp) => {
                        if(resp.body.status == 'success') {
                            if(resp.body.data.beforeComp != 'None') {
                                // 插入绘制script代码
                                _this.leftImg = resp.body.data.beforeComp.div;
                                _this.rightImg = resp.body.data.afterComp.div;
                                let bokehRunLeftScript = document.createElement('SCRIPT')
                                let bokehRunRightScript = document.createElement('SCRIPT')
                                bokehRunLeftScript.setAttribute('type', 'text/javascript')
                                bokehRunRightScript.setAttribute('type', 'text/javascript')
                                let t = document.createTextNode(resp.body.data.beforeComp.script)
                                bokehRunLeftScript.appendChild(t)
                                document.body.appendChild(bokehRunLeftScript)
                                t = document.createTextNode(resp.body.data.afterComp.script)
                                bokehRunRightScript.appendChild(t)
                                document.body.appendChild(bokehRunRightScript)
                                this.isHasImg = true;
                            }
                            this.showText = resp.body.data.msg;
                            this.isShowColumnPreviewPopup = true;
                            this.selectColumn = column;  
                        }
                        
                    })
                }
                
            },
            onColumnPreviewClose() {
                console.warn('onColumnPreviewClose')
                this.isShowColumnPreviewPopup = false;
                this.selectColumn = {};
                this.isHasImg = false
            },
            onselectAllMissingValueChange() {
                for(let column of this.columnList) {
                    column.selectMissingValue = this.selectAllMissingValue;
                }
            },
            selectAllNormalizeAlgorithmChange() {
                for(let column of this.columnList) {
                    if(column.type === 'int' || column.type === 'float')
                        column.selectNormalizeAlgorithm = this.selectAllNormalizeAlgorithm;
                }
            },
            selectAllOutliersAlgoChange() {
                for(let column of this.columnList) {
                    if(column.type === 'int' || column.type === 'float')
                        column.selectOutliersAlgo = this.selectAllOutliersAlgo;
                }
            },
            selectAllCharterProcessingChange() {
                if(this.selectAllCharterProcessing == '' || this.selectAllCharterProcessing.length == 0) {
                    this.selectAllCharterProcessing = ['']
                    for(let column of this.columnList) {
                        if(column.type === 'string') {
                            column.selectCharterProcessing = [''];
                            this.onSelectCharterProcessingChange(column);
                        }
                    }
                } else if(this.selectAllCharterProcessing.length > 1 && this.selectAllCharterProcessing.includes('')) {
                    if (!this.storeSelectAllCharterProcessing.includes('')) {
                        this.selectAllCharterProcessing = ['']
                        for(let column of this.columnList) {
                            if(column.type === 'string') {
                                column.selectCharterProcessing = ['']
                                this.onSelectCharterProcessingChange(column);
                            }
                        }
                    } else {
                        this.selectAllCharterProcessing = this.selectAllCharterProcessing.filter((item) => item != '')
                        for(let column of this.columnList) {
                            if(column.type === 'string') {
                                column.selectCharterProcessing = this.selectAllCharterProcessing
                                this.onSelectCharterProcessingChange(column);
                            }
                        }
                    }
                } else {
                    for(let column of this.columnList) {
                        if(column.type === 'string') {
                            column.selectCharterProcessing = this.selectAllCharterProcessing
                            this.onSelectCharterProcessingChange(column);
                        }
                    }
                }
                this.storeSelectAllCharterProcessing = this.selectAllCharterProcessing;
                
            },
            onSelectCharterProcessingChange(item) {
                if(item.selectCharterProcessing == '' || item.selectCharterProcessing.length == 0) {
                    item.selectCharterProcessing = ['']
                } else if(item.selectCharterProcessing.length > 1 && item.selectCharterProcessing.includes('')) {
                    if (!item.storeSelectCharterProcessing.includes('')) {
                        item.selectCharterProcessing = ['']
                    } else {
                        item.selectCharterProcessing = item.selectCharterProcessing.filter((item) => item != '')
                    }
                }
                item.storeSelectCharterProcessing = item.selectCharterProcessing
            },
            onConfirmClick() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let action = []
                        this.columnList.forEach((item) => {
                            let actionItem = {
                                'col': item.name,
                                "missingFiltering": (item.selectMissingValue) ? '1' : '0' ,
                                "outlierFiltering": (item.selectOutliersAlgo == '' || item.selectOutliersAlgo == undefined) ? '0': item.selectOutliersAlgo,
                                "normalize": (item.selectNormalizeAlgorithm == '' || item.selectNormalizeAlgorithm == undefined) ? '0': item.selectNormalizeAlgorithm,
                                "stringCleaning": JSON.stringify((item.selectCharterProcessing == undefined || item.selectCharterProcessing == '') ? Array('0'): item.selectCharterProcessing)
                            }
                            action.push(actionItem);
                        })
                        let processForm = {
                            fileID: this.fileID,
                            action: JSON.stringify(action),
                            fileNameAfterProcessing: this.form.fileNameAfterProcessing+'.'+window.localStorage.getItem('fileType'),
                            userID: window.localStorage.getItem('userID'),
                            projectID: this.projectID,
                            token: window.localStorage.getItem('token')
                        }
                        post(analytic_doPreprocess_url, processForm).then((resp) => {
                            if(resp.body.status == 'success') {
                                this.$router.push({name: 'project', params: {projectID: this.projectID}})
                            }
                        })
                    } else {
                        return false;
                    }
                });
                
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