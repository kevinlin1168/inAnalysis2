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
            <div class="titleBlock">
                <el-row class="title">
                    <el-col :span="8" style="text-align: center">
                        Model Management
                    </el-col>
                    <el-col :span="14" :offset="2">
                        <el-steps :space="200" :active="active" finish-status="success">
                            <el-step title="Algorithm"></el-step>
                            <el-step title="Parameter"></el-step>
                            <el-step title="Correlation"></el-step>
                            <el-step title="Feature"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
            </div>
            <div class="manageBlock">
                <el-row class="selectBlock">
                    <el-col :span="8" :offset="4" style="text-align: center">Select Algorithm</el-col>
                    <el-col :span="8">
                        <el-select v-model="selectAlgorithm" placeholder="Please select algorithm" @change="onSelectAlgorithmChange">
                            <el-option
                                    v-for="item in algorithmList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="parametersBlock" v-if="selectAlgorithm !== '' && parameterList !== []">
                    <el-col :span="12">
                        <template v-for="(parameter, index) in parameterList" >
                            <el-row v-if="(index % 2) === 0" class="parameterItem" :key="parameter.name">
                                <div  class="parameter">
                                    <el-tooltip :content="parameter.description" placement="top">
                                        <el-col  :span="11" :offset="2" :key="index">
                                            {{parameter.name}}
                                        </el-col>
                                    </el-tooltip>
                                    <el-col :span="11">
                                        <el-slider v-model="parameter.value" v-if="parameter.type == 'float'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="0.1"  @input="$forceUpdate()"> </el-slider>
                                        <el-slider v-model="parameter.value" v-if="parameter.type == 'int'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="1" @input="$forceUpdate()"> </el-slider>
                                        <el-switch v-model="parameter.value" v-if="parameter.type == 'bool'" active-color="#13ce66" inactive-color="#ff4949" @change="$forceUpdate()"></el-switch>
                                        <el-select v-model="parameter.value" v-if="parameter.type == 'enum'" placeholder="please select" @change="$forceUpdate()">
                                            <el-option v-for="item in parameter.list" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                        <el-input v-model="parameter.value" v-if="parameter.type == 'string'"></el-input>
                                    </el-col>
                                </div>
                            </el-row>
                        </template>
                    </el-col>
                    <el-col :span="12">
                        <template v-for="(parameter, index) in parameterList" >
                            <el-row v-if="(index % 2) !== 0" class="parameterItem" :key="index">
                                <div  class="parameter">
                                    <el-tooltip :content="parameter.description" placement="top">
                                        <el-col  :span="11" :offset="2" :key="index">
                                            {{parameter.name}}
                                        </el-col>
                                    </el-tooltip>
                                    <el-col :span="11">
                                        <el-slider v-model="parameter.value" v-if="parameter.type == 'float'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="0.1"  @input="$forceUpdate()"> </el-slider>
                                        <el-slider v-model="parameter.value" v-if="parameter.type == 'int'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="1"  @input="$forceUpdate()"> </el-slider>
                                        <el-switch v-model="parameter.value" v-if="parameter.type == 'bool'" active-color="#13ce66" inactive-color="#ff4949" @change="$forceUpdate()"></el-switch>
                                        <el-select v-model="parameter.value" v-if="parameter.type == 'enum'" placeholder="please select" @change="$forceUpdate()">
                                            <el-option v-for="item in parameter.list" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                        <el-input v-model="parameter.value" v-if="parameter.type == 'string'"></el-input>
                                    </el-col>
                                </div>
                            </el-row>
                        </template>
                    </el-col>
                </el-row>
                <el-row class="labelBlock" v-if="selectAlgorithm !== ''">
                    <el-col :span="8" :offset="3" class="selectFeature">
                        Select Feature
                        <draggable class="list-group selectItem" :list="columnList" group="label" @change="onLabelChange">
                            <div
                                    class="list-group-item"
                                    v-for="selection in columnList"
                                    :key="selection.name">
                                <div class="itemTitle">
                                            {{ selection.name }}
                                </div>
                                <div class="classImg">
                                    <img v-if="selection.classifiable == 1" src="@/assets/classifiable.png" height="25" width="25">
                                </div>
                                <div class="itemImg">
                                    <img v-if="selection.type == 'classifiable'" src="@/assets/classifiable.png" height="25" width="25">
                                    <img v-if="selection.type === 'float' || selection.type === 'int'" src="@/assets/float.png" height="25" width="25">
                                    <img v-if="selection.type === 'string'" src="@/assets/nlp.png" height="25" width="25">
                                    <img v-if="selection.type === 'path'" src="@/assets/image.png" height="25" width="25">
                                </div>
                            </div>
                        </draggable>
                    </el-col>
                    <el-col :span="8" :offset="1" class="selectBlockWrapper">
                        <el-row class="selectBlock">
                            <el-col :span="15" :offset="1" class="selectBlockTitle" style="text-align: center">Select Correlation Algorithm</el-col>
                            <el-col :span="8" class="selectBlockMenu">
                                <el-select v-model="selectCorrelationAlgorithm" placeholder="Please select correlation algorithm" @change="onSelectCorrelationAlgorithmChange">
                                    <el-option
                                            v-for="item in correlationAlgorithmList"
                                            :key="item.algoname"
                                            :label="item.friendlyname"
                                            :value="item.algoname">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-col :span="24">
                                <div class="correlationImg" v-html="correlationImg">
                                </div>
                            </el-col>
                        </el-row>
                        
                    </el-col>
                </el-row>
                <el-row class="selectLabelBlock" v-if="selectAlgorithm !== ''">
                    <el-col class="inputBlock" :span="8" :offset="3">
                        <div class="title"> Input </div>
                        <el-row v-for="(label, index) in algoInputList" :key="index">
                            <el-col :span="24" :key="index">
                                <div class="labelNameBlock">
                                    <div class="labelTitle">
                                        {{label.name}}
                                    </div>
                                    <div class="labelAmount" v-if="label.amount === 'single'">
                                        Single
                                    </div>
                                    <div class="labelAmount" v-if="label.amount === 'multiple'">
                                        Multiple
                                    </div>
                                    <div class="classImg">
                                        <img v-if="label.classifiable == 1" src="@/assets/classifiable.png" height="25" width="25">
                                    </div>
                                    <div class="labelImg">
                                        <img v-if="label.type === 'classifiable'" src="@/assets/classifiable.png" height="25" width="25">
                                        <img v-if="label.type === 'float' || label.type === 'int'" src="@/assets/float.png" height="25" width="25">
                                        <img v-if="label.type === 'string'" src="@/assets/nlp.png" height="25" width="25">
                                        <img v-if="label.type === 'path'" src="@/assets/image.png" height="25" width="25">
                                    </div>
                                </div>
                                <draggable class="list-group selectItem" :list="label.selection" group="label" @change="onLabelChange">
                                    <div
                                            class="list-group-item"
                                            v-for="selection in label.selection"
                                            :key="selection.name"
                                    >
                                        <div class="itemTitle">
                                            {{ selection.name }}
                                        </div>
                                        <div class="classImg">
                                            <img v-if="selection.classifiable == 1" src="@/assets/classifiable.png" height="25" width="25">
                                        </div>
                                        <div class="itemImg">
                                            <img v-if="selection.type === 'float' || selection.type === 'int'" src="@/assets/float.png" height="25" width="25">
                                            <img v-if="selection.type === 'string'" src="@/assets/nlp.png" height="25" width="25">
                                            <img v-if="selection.type === 'path'" src="@/assets/image.png" height="25" width="25">
                                        </div>
                                    </div>
                                </draggable>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="outputBlock" :span="8" :offset="2">
                        <div class="title"> Output</div>
                        <el-row v-for="(label, index) in algoOutputList"  :key="index">
                            <el-col :span="24" :key="index">
                                <div class="labelNameBlock">
                                    <div class="labelTitle">
                                        {{label.name}}
                                    </div>
                                    <div class="labelAmount" v-if="label.amount === 'single'">
                                        Single
                                    </div>
                                    <div class="labelAmount" v-if="label.amount === 'multiple'">
                                        Multiple
                                    </div>
                                    <div class="classImg">
                                        <img v-if="label.classifiable == 1" src="@/assets/classifiable.png" height="25" width="25">
                                    </div>
                                    <div class="labelImg">
                                        <img v-if="label.type === 'float' || label.type === 'int'" src="@/assets/float.png" height="25" width="25">
                                        <img v-if="label.type === 'string'" src="@/assets/nlp.png" height="25" width="25">
                                        <img v-if="label.type === 'path'" src="@/assets/image.png" height="25" width="25">
                                    </div>
                                </div>
                                <draggable class="list-group selectItem" :list="label.selection" group="label" @change="onLabelChange">
                                    <div
                                            class="list-group-item"
                                            v-for="selection in label.selection"
                                            :key="selection.name">
                                        <div class="itemTitle">
                                            {{ selection.name }}
                                        </div>
                                        <div class="classImg">
                                            <img v-if="selection.classifiable == 1" src="@/assets/classifiable.png" height="25" width="25">
                                        </div>
                                        <div class="itemImg">
                                            <img v-if="selection.type === 'float' || selection.type === 'int'" src="@/assets/float.png" height="25" width="25">
                                            <img v-if="selection.type === 'string'" src="@/assets/nlp.png" height="25" width="25">
                                            <img v-if="selection.type === 'path'" src="@/assets/image.png" height="25" width="25">
                                        </div>
                                    </div>
                                </draggable>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>

            <div class="buttonBlock" v-if="selectAlgorithm !== ''">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import draggable from "vuedraggable";
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
                active: 0,
                projectID : '',
                modelIndex: '',
                modelName: '',
                selectAlgorithm: '',
                selectCorrelationAlgorithm: '',
                correlationImg: '',
                correlationAlgorithmList: [],
                algorithmList: [],
                columnList: [],
                algoInputList: [],
                parameterList: []
            }
        },
        methods:{
            test() {
                console.warn(this.parameterList);
                //console.warn(this.parameterList[0].value)
            },
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
                        } else {
                            console.warn('getColumn Error', resp.data.msg)
                        }
                    }).catch((error) => {
                        console.warn('getColumn Error', error)
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
            onLabelChange() {
                this.$forceUpdate();
                if(this.selectCorrelationAlgorithm == '') {
                    this.active = 2;
                } else {
                    this.active = 3;    
                }
            },
            onSelectAlgorithmChange() {
                this.active = 1
                let project = JSON.parse(window.localStorage.getItem('project'));
                let form = {
                    dataType: project.dataType,
                    projectType: project.projectType,
                    algoName: this.selectAlgorithm,
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
                                } else {
                                    item.value = item.default;
                                }
                            }
                        })
                        console.warn('test', this.parameterList);
                        this.algoInputList.forEach((item) => {
                            item['selection'] = [];
                        })
                        this.algoOutputList.forEach((item) => {
                            item['selection'] = [];
                        })
                    }
                }).catch((error) => {
                    console.error('getAnalyticAlgoParam Error', error)
                });
            },
            onConfirmClick() {
                let isError = false;
                let errorMassage = '';
                console.warn('onConfirmClick');
                console.warn('algoOutputList', this.algoOutputList)

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
                            params[param.name] = param.value
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
                    })
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
            draggable
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

        .titleBlock {
            font-size: 18px;

            .title {
                display:  flex;
                align-items: center;
            }
        }

        .manageBlock {
            margin-top: 5px;
            font-size: 14px;
            .selectBlockWrapper{
                margin-left: auto;
                margin-right: auto;
                width:auto;
            }
            .selectBlock {
                margin-top: 10px;
                display:  flex;
                align-items: center;
                .selectBlockTitle{
                    width:200px;
                    margin-right:20px;
                }
                .selectBlockMenu{
                    width:250px;
                }
                .el-select {
                    width: 250px;
                }
            }

            .correlationImg {
                height: 320px;
            }

            .labelBlock {
                margin-top: 10px;
                display: flex;
                
                .selectFeature {
                    display: block;
                    align-items: center;
                    width:30%;
                    min-width:150px;
                }
                .selectItem {
                    display: block;
                    align-items: center;
                    border-style:solid;
                    border-width: 1px;
                    border-radius:10px;
                    min-height: 50px;
                    padding: 5px;
                }

                .list-group-item {

                    .itemTitle {
                        width: 50%;
                        align-items: center;
                        display: inline-block;
                    }

                    .classImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }

                    .itemImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }
                }
            }


            .selectLabelBlock {
                margin-top: 10px;
                display:flex;
                align-items:center;

                .inputBlock{
                    border-style:solid;
                    border-width: 1px;
                    border-radius:10px;
                    min-height: 50px;
                    padding: 5px;

                    .title {
                        margin-bottom: 10px;
                        font-size: 18px;
                    }
                }
                .outputBlock {
                    height: 100%;
                    border-style:solid;
                    border-width: 1px;
                    border-radius:10px;
                    min-height: 50px;
                    padding: 5px;
                    vertical-align: middle;

                    .title {
                        margin-bottom: 10px;
                        font-size: 18px;
                    }
                }

                .labelNameBlock {
                    .labelTitle {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                    }
                    .labelAmount {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: left;
                    }
                    .labelIsSingle {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: left;
                    }

                    .labelImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }

                    .classImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }

                    .itemImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }
                }
                

                .list-group-item {

                    .itemTitle {
                        width: 50%;
                        align-items: center;
                        display: inline-block;
                    }

                    .classImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }

                    .itemImg {
                        width: 25%;
                        align-items: center;
                        display: inline-block;
                        text-align: center;
                    }
                }
                .selectItem {
                    border-style:solid;
                    border-width: 1px;
                    border-radius:10px;
                    min-height: 50px;
                    padding: 5px;
                }
            }

            .parametersBlock {
                margin-top: 10px;
                display:  flex;
                align-items: center;

                .parameterItem {
                    margin-top: 5px;

                    .parameter {
                        display:  flex;
                        align-items: center;
                    }
                }

                .el-col {
                    text-align: center;
                }
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