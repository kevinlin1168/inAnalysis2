<template>
    <div>
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
                                    <el-slider v-model="parameter.value" v-if="parameter.type == 'float'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="parameter.step"  @input="onParametersChange"> </el-slider>
                                    <el-slider v-model="parameter.value" v-if="parameter.type == 'int'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="1" @input="onParametersChange"> </el-slider>
                                    <el-switch v-model="parameter.value" v-if="parameter.type == 'bool'" active-color="#13ce66" inactive-color="#ff4949" @change="onParametersChange"></el-switch>
                                    <el-select v-model="parameter.value" v-if="parameter.type == 'enum'" placeholder="please select" @change="onParametersChange">
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
                                    <el-slider v-model="parameter.value" v-if="parameter.type == 'float'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="parameter.step"  @input="onParametersChange"> </el-slider>
                                    <el-slider v-model="parameter.value" v-if="parameter.type == 'int'" show-input :min="parameter.lowerBound" :max="parameter.upperBound" :step="1"  @input="onParametersChange"> </el-slider>
                                    <el-switch v-model="parameter.value" v-if="parameter.type == 'bool'" active-color="#13ce66" inactive-color="#ff4949" @change="onParametersChange"></el-switch>
                                    <el-select v-model="parameter.value" v-if="parameter.type == 'enum'" placeholder="please select" @change="onParametersChange">
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
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {analytic_doCorrelation_url} from "@/config/api.js"
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'trainModelComponent',
        created: function() {
        },
        watch: {
            '$route': 'clearData',
            reset: function(newVal, oldVal) {
                if(newVal == true) {
                    this.clearData();
                }
            }
        },
        props: {
            algorithmList: {
                type: Array
            },
            parameterList: {
                type: Array
            },
            correlationAlgorithmList: {
                type: Array
            },
            columnList: {
                type: Array
            },
            modelIndex: {
                type: String //should remove
            },
            algoInputList: {
                type: Array
            },
            algoOutputList: {
                type: Array
            },
            reset: {
                type: Boolean
            }
        },
        data: function () {
            return {
                active: 0,
                selectAlgorithm: '',
                selectCorrelationAlgorithm: '',
                correlationImg: '',
            }
        },
        methods:{
            clearData() {
                this.active = 0;
                this.selectAlgorithm = '';
                this.selectCorrelationAlgorithm = '';
                this.correlationImg = '';
            },
            onSelectCorrelationAlgorithmChange() {
                //TODO change modelIndex to file ID
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
                // this.$emit('onLabelChange', this.algoInputList, this.algoOutputList);
                this.$forceUpdate();
                if(this.selectCorrelationAlgorithm == '') {
                    this.active = 2;
                } else {
                    this.active = 3;    
                }
            },
            onSelectAlgorithmChange() {
                console.log('this.selectAlgorithm', this.selectAlgorithm)
                this.$emit('onSelectAlgorithmChange', this.selectAlgorithm);
                this.active = 1
            },
            onParametersChange() {
                this.$forceUpdate();
                // this.$emit('onParametersChange', this.parameterList);
            },
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