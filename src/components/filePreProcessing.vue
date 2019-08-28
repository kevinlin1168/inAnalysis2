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
                        <el-select v-model="item.selectCharterProcessing" placeholder="please select" multiple v-if="item.type === 'string'" @change="$forceUpdate()">
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
                    <el-col :span="6" :offset="6"> File Name After Processing </el-col>
                    <el-col :span="6">
                        <el-input v-model="fileNameAfterProcessing" placeholder="please input file name"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="buttonBlock">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>

        </el-col>

        <!-- preview column popup-->
        <el-dialog :title='selectColumn.name + " Preview"' :visible.sync="isShowColumnPreviewPopup" :show-close='false'>
            <div class="imgBlock">
                <el-carousel trigger="click" height="400px" :autoplay="false">
                    <el-carousel-item v-for="item in imgList" :key="item">
                        <div v-html="item">
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onColumnPreviewClose">Close</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import { file_getColumn_url, analytic_getPreprocessAlgo_url, analytic_doPreprocess_url } from '@/config/api.js';
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
                fileNameAfterProcessing: '',
                projectName: '',
                isHasStringType: true,
                columnList: [
                    {
                        'name': 'col1_name',
                        'type': 'int'
                    }, {
                        'name': 'col2_name',
                        'type': 'float',
                    },{
                        'name': 'col3_name',
                        'type': 'string'
                    }],
                isShowColumnPreviewPopup: false,
                normalizeOptionList: [],
                outlierOptionList: [],
                characterProcessingOptionList: [],
                formOffset: 0, //Todo change offset when isHasStringType change 0 or3
                selectAllMissingValue: true,
                selectAllNormalizeAlgorithm: '',
                selectAllOutliersAlgo: '',
                selectAllCharterProcessing: [],
                imgList: []
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
                    this.$http.post(file_getColumn_url, fileColumnForm).then((resp) => {
                        if(resp.body.status == 'success') {
                            this.columnList = resp.body.data.cols;
                            for(let column of this.columnList) {
                                if(column.type == 'string') {
                                    this.isHasStringType = true
                                }
                                column.selectMissingValue = this.selectAllMissingValue;
                            }
                        } else {
                            console.error(resp);
                        }
                    });
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
                    this.$http.post(analytic_getPreprocessAlgo_url, form).then((resp) => {
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
                }
                this.projectID = this.$route.params.projectID;
                this.fileID = this.$route.params.fileID;
                //TODO get file column list && set item.selectMissingValue = true
            },
            onBreadcrumbProjectClick() {
               this.$router.push({name: 'project', params: {projectID: this.projectID}});
            },
            onColumnPreviewClick(column) {
                console.warn('onColumnPreviewClick', column);
                this.isShowColumnPreviewPopup = true;
                this.selectColumn = column;
            },
            onColumnPreviewClose() {
                this.isShowColumnPreviewPopup = false;
                this.selectColumn = {};
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
                for(let column of this.columnList) {
                    if(column.type === 'string')
                        column.selectCharterProcessing = this.selectAllCharterProcessing;
                }
            },
            onConfirmClick() {
                console.warn(this.columnList);
                let action = []
                this.columnList.forEach((item) => {
                    let actionItem = {
                        'col': item.name,
                        "missingFiltering": (item.selectMissingValue) ? '1' : '0' ,
                        "outlierFiltering": (item.selectOutliersAlgo == '') ? '0': item.selectOutliersAlgo,
                        "normalize": (item.selectNormalizeAlgorithm == '') ? '0': item.selectNormalizeAlgorithm,
                        "stringCleaning": JSON.stringify((item.characterProcessingOptionList == undefined) ? Array('0'): item.characterProcessingOptionList)
                    }
                    action.push(actionItem);
                })
                let processForm = {
                    fileID: this.fileID,
                    action: JSON.stringify(action),
                    fileNameAfterProcessing: this.fileNameAfterProcessing+'.'+window.localStorage.getItem('fileType'),
                    userID: window.localStorage.getItem('userID'),
                    projectID: this.projectID,
                    token: window.localStorage.getItem('token')
                }
                console.warn(processForm)
                this.$http.post(analytic_doPreprocess_url, processForm).then((resp) => {
                    console.warn(resp);
                })
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
</style>