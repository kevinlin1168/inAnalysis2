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
            <div class="title">
                Model Predict
            </div>
            <div class="predictBlock">
                <el-row class="selectFileBlock">
                    <el-col :span="5" :offset="7" style="text-align: center">Select File</el-col>
                    <el-col :span="5">
                        <el-select v-model="selectFileID" placeholder="Please select file">
                            <el-option
                                    v-for="item in fileIDList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="labelBlock" v-if="selectFileID !== ''">
                    <el-col :span="8" :offset="8">
                        Select Label
                        <draggable class="list-group selectItem" :list="columnList" group="label" @change="$forceUpdate()">
                            <div
                                    class="list-group-item"
                                    v-for="element in columnList"
                                    :key="element"
                            >
                                {{ element }}
                            </div>
                        </draggable>
                    </el-col>
                </el-row>
                <el-row class="selectBlock" v-if="selectFileID !== ''">
                    <el-col class="inputBlock" :span="8" :offset="3">
                        <div class="title"> Input </div>
                        <el-row v-for="(label, index) in labelList" :key="index">
                            <el-col v-if="label.type === 'input'" :span="24" :key="index">
                                {{label.name}}
                                <draggable class="list-group selectItem" :list="label.selection" group="label" :move="checkMove"  @change="$forceUpdate()" >
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
                    <el-col class="outputBlock" :span="8" :offset="3">
                        <div class="title"> Output </div>
                        <el-row v-for="(label, index) in labelList"  :key="index">
                            <el-col v-if="label.type === 'output'" :span="24" :key="index">
                                {{label.name}}
                                <draggable class="list-group selectItem" :list="label.selection" group="label" :move="checkMove"  @change="$forceUpdate()" >
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
            </div>

            <div class="buttonBlock">
                <el-button type="primary" @click="onConfirmClick">Confirm</el-button>
            </div>

        </el-col>
    </el-row>
</template>
<script>
    import draggable from "vuedraggable";
    export default {
        name: 'modelPredict',
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data: function () {
            return {
                selectFile: {},
                selectFileID: '',
                projectID : '',
                modelID: '',
                fileIDList: ['test1', 'test2', 'test3'],
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
            }
        },
        methods:{
            fetchData() {
                this.projectID = this.$route.params.projectID;
                this.modelID = this.$route.params.modelID;
            },
            onConfirmClick() {
                console.warn('onConfirmClick');
            },
            checkMove(evt) {
                console.log(evt.draggedContext.index)
                console.log(evt.draggedContext.element)
                console.log(evt.draggedContext.futureIndex)
                console.log(evt.relatedContext.index)
                console.log(evt.relatedContext.element)
                console.log(evt.relatedContext.list)
                console.log(evt.relatedContext.component)
                return (evt.draggedContext.element.name!== 'b')
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

        .title {
            font-size: 18px;
        }

        .predictBlock {
            margin-top: 5px;
            font-size: 14px;

            .selectFileBlock {
                display:  flex;
                align-items: center;
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


        .selectBlock {
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

        .buttonBlock {
            margin-top: 10px;
            .el-button {
                display:table;
                margin:0 auto;
            }
        }
    }
</style>