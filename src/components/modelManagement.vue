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
        <el-col :span="18" class="main" :offset="3">
            <div class="titleBlock">
                <el-row class="title">
                    <el-col :span="8" style="text-align: center">
                        Model Management
                    </el-col>
                    <el-col :span="14" :offset="2">
                        <el-steps :space="200" :active="active" finish-status="success">
                            <el-step title="Correlation"></el-step>
                            <el-step title="Feature"></el-step>
                            <el-step title="Algorithm"></el-step>
                            <el-step title="Parameter"></el-step>
                        </el-steps>
                    </el-col>
                </el-row>
            </div>
            <div class="manageBlock">
                <el-row class="selectBlock">
                    <el-col :span="8" :offset="4" style="text-align: center">Model Name</el-col>
                    <el-col :span="8">
                        <el-input v-model="modelName"></el-input>
                    </el-col>
                </el-row>
                <el-row class="selectBlock">
                    <el-col :span="8" :offset="4" style="text-align: center">Select Correlation Algorithm</el-col>
                    <el-col :span="8">
                        <el-select v-model="selectCorrelationAlgorithm" placeholder="Please select correlation algorithm" @change="onSelectCorrelationAlgorithmChange">
                            <el-option
                                    v-for="item in correlationAlgorithmList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="labelBlock" v-if="selectCorrelationAlgorithm !== ''">
                    <el-col :span="8" :offset="3">
                        Select Feature
                        <draggable class="list-group selectItem" :list="columnList" group="label" @change="onLabelChange">
                            <div
                                    class="list-group-item"
                                    v-for="element in columnList"
                                    :key="element"
                            >
                                {{ element }}
                            </div>
                        </draggable>
                    </el-col>
                    <el-col :span="8" :offset="2">
                        <div v-html="correlationImg">
                        </div>
                    </el-col>
                </el-row>
                <el-row class="selectLabelBlock" v-if="selectCorrelationAlgorithm !== ''">
                    <el-col class="inputBlock" :span="8" :offset="3">
                        <div class="title"> Input </div>
                        <el-row v-for="(label, index) in labelList" :key="index">
                            <el-col v-if="label.type === 'input'" :span="24" :key="index">
                                {{label.name}}
                                <draggable class="list-group selectItem" :list="label.selection" group="label" @change="onLabelChange">
                                    <div
                                            class="list-group-item"
                                            v-for="selection in label.selection"
                                            :key="selection"
                                    >
                                        {{ selection }}
                                    </div>
                                </draggable>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="outputBlock" :span="8" :offset="2">
                        <div class="title"> Output</div>
                        <el-row v-for="(label, index) in labelList"  :key="index">
                            <el-col v-if="label.type === 'output'" :span="24" :key="index">
                                {{label.name}}
                                <draggable class="list-group selectItem" :list="label.selection" group="label" @change="onLabelChange">
                                    <div
                                            class="list-group-item"
                                            v-for="selection in label.selection"
                                            :key="selection"
                                    >
                                        {{ selection }}
                                    </div>
                                </draggable>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <div class="buttonBlock" v-if="selectCorrelationAlgorithm !== '' && !isLabelConfirm">
                    <el-button type="primary" @click="onLabelConfirmClick">Feature Confirm</el-button>
                </div>
                <el-row class="selectBlock" v-if="isLabelConfirm">
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
                <el-row class="parametersBlock" v-if="isLabelConfirm && selectAlgorithm !== ''">
                    <el-col :span="12">
                        <el-row v-for="(parameter, index) in parameterList" :key="index" class="parameterItem">
                            <div v-if="(index % 2) === 0" class="parameter">
                                <el-col  :span="11" :offset="2" :key="index">
                                    {{parameter.name}}
                                </el-col>
                                <el-col :span="11">
                                    <el-input v-model="parameter.value"></el-input>
                                </el-col>
                            </div>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row v-for="(parameter, index) in parameterList" :key="index" class="parameterItem">
                            <div v-if="(index % 2) !== 0" class="parameter">
                                <el-col  :span='11' :offset="2" :key="index">
                                    {{parameter.name}}
                                </el-col>
                                <el-col :span="11">
                                    <el-input v-model="parameter.value"></el-input>
                                </el-col>
                            </div>
                        </el-row>
                    </el-col>
                </el-row>
            </div>

            <div class="buttonBlock" v-if="isLabelConfirm && selectAlgorithm !== ''">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import draggable from "vuedraggable";
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
                modelID: '',
                modelName: '',
                isLabelConfirm: false,
                selectAlgorithm: '',
                selectCorrelationAlgorithm: '',
                correlationImg: '',
                correlationAlgorithmList: ['correlationAlgo1', 'correlationAlgo2', 'correlationAlgo3', 'correlationAlgo4'],
                algorithmList: ['algo1', 'algo2', 'algo3', 'algo4'],
                columnList: ['column1', 'column2', 'column3', 'column4'],
                labelList: [{
                    name: 'label1',
                    type: 'input',
                    selection: []
                }, {
                    name: 'label2',
                    type: 'input',
                    selection: []
                }, {
                    name: "label3",
                    type: 'input',
                    selection: []
                }, {
                    name: "label4",
                    type: 'output',
                    selection: []
                }],
                parameterList: [{
                    name: 'parameter1',
                    type: 'input',
                    value: ''
                }, {
                    name: 'parameter2',
                    type: 'input',
                    value: ''
                }, {
                    name: "parameter3",
                    type: 'input',
                    value: ''
                }, {
                    name: "parameter4",
                    type: 'output',
                    value: ''
                }]
            }
        },
        methods:{
            fetchData() {
                this.projectID = this.$route.params.projectID;
                this.modelID = this.$route.params.modelID;
                this.active = 0
            },
            onSelectCorrelationAlgorithmChange() {
                if(this.selectCorrelationAlgorithm !== '') {
                    this.active = 1;
                }
            },
            onLabelChange() {
                this.isLabelConfirm = false;
                this.active = 1;
            },
            onLabelConfirmClick() {
                //Todo check label
                this.isLabelConfirm = true;
                this.active = 2;
            },
            onSelectAlgorithmChange() {
                if(this.selectCorrelationAlgorithm !== '') {
                    this.active = 3;
                }
            },
            onConfirmClick() {
                console.warn('onConfirmClick');
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

            .selectBlock {
                margin-top: 10px;
                display:  flex;
                align-items: center;

                .el-select {
                    width: 250px;
                }
            }

            .labelBlock {
                margin-top: 10px;
                .selectItem {
                    border-style:solid;
                    border-width: 1px;
                    border-radius:10px;
                    min-height: 50px;
                    padding: 5px;
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