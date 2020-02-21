<template>
    <el-row>
        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <router-link :to="{name:'project',params:{projectID:this.projectID}}" replace>{{projectName}}</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{modelName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="22" class="main" :offset="1">
            <trainModelComponent
            :algorithmList='algorithmList'
            :parameterList='parameterList'
            :correlationAlgorithmList='correlationAlgorithmList'
            :columnList='columnList'
            :modelIndex='modelIndex'
            :algoInputList='algoInputList'
            :algoOutputList='algoOutputList'
            @onSelectAlgorithmChange="onSelectAlgorithmChange">
            </trainModelComponent>
            <!-- <div class="buttonBlock" v-if="selectAlgorithm !== ''"> -->
            <div class="buttonBlock">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import trainModelComponent from './trainModelComponent';
    import {analytic_getCorrelationAlgo_url,
            analytic_doCorrelation_url,
            analytic_getAnalyticsAlgoByProject_url, 
            analytic_getAnalyticAlgoParam_url, 
            file_getColumn_url,
            analytic_doModelTrain_url} from "@/config/api.js"
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'modelManagement',
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data: function () {
            return {
                projectID : '',
                modelIndex: '',
                modelName: '',
                projectName: '',
                selectAlgorithm: '',
                correlationImg: '',
                correlationAlgorithmList: [],
                algorithmList: [],
                columnList: [],
                orginalColumnList: [],
                algoInputList: [],
                parameterList: [],
                algoOutputList: [],
            }
        },
        methods:{
            fetchData() {
                if(this.$route.name == 'modelManagement') {
                    this.projectName = JSON.parse(window.localStorage.getItem('project')).projectName;
                    this.modelName = JSON.parse(window.localStorage.getItem('model')).modelName;
                    this.projectID = this.$route.params.projectID;
                    this.modelIndex = this.$route.params.modelIndex;
                    this.active = 0;
                    this.selectCorrelationAlgorithm = '';
                    this.selectAlgorithm = '';

                    let form = {
                        projectID: this.projectID,
                        token: window.localStorage.getItem('token')
                    }
                    post(analytic_getAnalyticsAlgoByProject_url, form).then((resp) => {
                        if(resp.data.status == 'success') {
                            this.algorithmList = resp.data.data;
                            post(analytic_getCorrelationAlgo_url, form).then((resp) => {
                                if(resp.data.status == 'success') {
                                    this.correlationAlgorithmList = resp.data.data;
                                }
                            }).catch((error) => {
                                console.error('getCorrelationAlgoError', error);
                            })
                        }
                    }).catch((error) => {
                        console.error('getAnalyticsAlgoByProjectError', error);
                    })
                    let fileForm = {
                        fileID: JSON.parse(window.localStorage.getItem('file')).fileID,
                        token: window.localStorage.getItem('token')
                    }
                    post(file_getColumn_url,fileForm).then((resp) => {
                        if(resp.data.status == 'success') {
                            this.columnList = resp.data.data.cols;
                            this.orginalColumnList = this.columnList.slice();
                        } else {
                            console.warn('getColumn Error', resp.data.msg)
                        }
                    }).catch((error) => {
                        console.warn('getColumn Error', error)
                    })
                    this.algoInputList.forEach((item) => {
                        item['selection'] = [];
                    })
                    this.algoOutputList.forEach((item) => {
                        item['selection'] = [];
                    })
                }
                
            },
            onSelectCorrelationAlgorithmChange() {
                    let bokehVersion = '1.3.4';
                    let link = document.createElement('link');
                    link.setAttribute('rel', 'stylesheet');
                    link.setAttribute('href', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.css');
                    link.setAttribute('type', 'text/css');
                    document.head.appendChild(link);
                    // 在header插入js
                    let script = document.createElement('script');
                    script.setAttribute('src', 'https://cdn.pydata.org/bokeh/release/bokeh-' + bokehVersion + '.min.js');
                    script.async = 'async';
                    document.head.appendChild(script);
                    // cdn的js載入完畢再请求bokeh參數
                    script.onload = () => {
                        let form = {
                            token: window.localStorage.getItem('token'),
                            modelIndex: this.modelIndex,
                            correlationAlgoName: this.selectCorrelationAlgorithm
                        }
                        console.warn(form)
                        let _this = this;
                        post(analytic_doCorrelation_url, form).then((resp) => {
                            if(resp.data.status == 'success') {
                                this.active = 3;
                                _this.correlationImg = resp.data.data.div;
                                let bokehRunScript = document.createElement('SCRIPT');
                                bokehRunScript.setAttribute('type', 'text/javascript');
                                let t = document.createTextNode(resp.data.data.script);
                                bokehRunScript.appendChild(t);
                                document.body.appendChild(bokehRunScript);
                            }
                        }).catch((error) => {
                            console.error('doCorrelation Error', error);
                        });
                    }
                
            },
            onSelectAlgorithmChange(algo) {
                this.selectAlgorithm = algo;
                this.active = 1
                let project = JSON.parse(window.localStorage.getItem('project'));
                let form = {
                    dataType: project.dataType,
                    projectType: project.projectType,
                    algoName: algo,
                    token: window.localStorage.getItem('token')
                }
                post(analytic_getAnalyticAlgoParam_url, form).then((resp) => {
                    if(resp.data.status == 'success') {
                        this.parameterList = resp.data.data.param;
                        this.algoInputList = resp.data.data.input;
                        this.algoOutputList = resp.data.data.output;
                        this.parameterList.forEach((item) => {
                            if(item.default !== "" || item.default !== undefined) {
                                if(item.type == 'bool') {
                                    item.value = (item.default == '1' ? true : false)
                                } else if (item.type == 'float' || item.type == 'int') {
                                    item.value = Number(item.default);
                                    if(item.type == 'float') {
                                        // TODO can modify 1000 to config;
                                        item['step'] = (item.upperBound - item.lowerBound) / 1000;
                                    }
                                } else {
                                    item.value = item.default;
                                }
                            }
                        })
                        this.algoInputList.forEach((item) => {
                            item['selection'] = [];
                        })
                        this.algoOutputList.forEach((item) => {
                            item['selection'] = [];
                        })
                        this.columnList = this.orginalColumnList.slice();
                    }
                }).catch((error) => {
                    console.error('getAnalyticAlgoParam Error', error)
                });
            },
            onConfirmClick() {
                let isError = false;
                let errorMassage = '';
                this.algoInputList.forEach((inputItem) => {
                    // check length
                    if(inputItem.amount == "single") {
                        if(inputItem.selection.length > 1) {
                            isError = true;
                            errorMassage += ' Select more than one Label';
                        }
                    }
                    if(inputItem.selection.length == 0) {
                        isError = true;
                        errorMassage += ' Do not select label';
                    }
                    if(this.checkLabelType(inputItem)) {
                        isError = true;
                        errorMassage += ' Input type error';
                    }
                })

                this.algoOutputList.forEach((outputItem) => {
                    if(this.checkLabelType(outputItem)) {
                        isError = true;
                        errorMassage += ' Output type error';
                    }
                })
                if(isError == true) {
                    this.$message.error(errorMassage);
                } else {
                    let project = JSON.parse(window.localStorage.getItem('project'));
                    let params = {}
                    this.parameterList.forEach((param) => {
                        if(param.type == 'bool') {
                            params[param.name] = param.value ? 1 : 0;
                        } else {
                            params[param.name] = param.value;
                        }  
                    })
                    let input = {};
                    this.algoInputList.forEach((item) => {
                        input[item.name] = [];
                        item.selection.forEach((select) => {
                            input[item.name].push(select.name)
                        })
                    })
                    let output = {};
                    this.algoOutputList.forEach((item) => {
                        output[item.name] = item.selection[0].name;
                    })
                    let form = {
                        modelIndex: this.modelIndex,
                        token: window.localStorage.getItem('token'),
                        dataType: project.dataType,
                        projectType: project.projectType,
                        algoName: this.selectAlgorithm,
                        param: JSON.stringify(params),
                        input: JSON.stringify(input),
                        output: JSON.stringify(output)
                    }
                    post(analytic_doModelTrain_url, form).then((resp) => {
                        if(resp.data.status == "success") {
                            this.$message({
                                message: 'manage model successfully',
                                type: 'success'
                            });
                            this.$router.push({name: 'project', params: {projectID: this.projectID}});
                        }
                    }).catch((error)=>{
                        // console.warn(error.response.data.msg);
                       this.$message.error(error.data.msg);
                    });

                    
                }
            },
            checkLabelType(item) {
                let isError = false;
                
                item.selection.forEach((select) => {
                    if(item.type == 'classifiable') {
                        if(select.classifiable !== 1) {
                            isError = true;
                        }
                    }else if(item.type == 'float') {
                        if (select.type != 'float' && select.type!= 'int'){
                            isError = true;
                        }
                    }else {
                        // string && path
                        if (select.type != item.type) {
                            isError = true;
                        }
                    }
                })
                return isError;
            }
        },
        components: {
            trainModelComponent
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
        border-style:solid;
        border-top: none;
        border-width: 1px;
        padding: 10px;
        border-radius:10px;


        .buttonBlock {
            margin-top: 10px;
            .el-button {
                display:table;
                margin:0 auto;
            }
        }
    }
</style>