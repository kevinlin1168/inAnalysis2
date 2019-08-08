<template>
    <el-row>
        <el-col :span="24" class="gridTitle">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/project' }">Project Management</el-breadcrumb-item>
                <el-breadcrumb-item @click="onBreadcrumbProjectClick">
                    <router-link :to="{name:'project',params:{projectID:this.projectID}}" replace>Project Name</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>File name</el-breadcrumb-item>
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
                        <el-select v-model="selectAllNormalizeAlgorithm" placeholder="请选择" @change="selectAllNormalizeAlgorithmChange">
                            <el-option
                            v-for="item in normalizeOptionList"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select> 
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="selectAllOutliersAlgo" placeholder="请选择" @change="selectAllOutliersAlgoChange">
                            <el-option
                            v-for="item in outlierOptionList"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" v-if="isHasStringType">
                        <el-select v-model="selectAllCharterProcessing" placeholder="请选择" multiple @change="selectAllCharterProcessingChange">
                            <el-option
                            v-for="item in characterProcessingOptionList"
                            :key="item"
                            :label="item"
                            :value="item">
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
                        <el-select v-if="item.type === 'int' || item.type === 'float'" v-model="item.selectNormalizeAlgorithm" placeholder="请选择" @change="$forceUpdate()">
                            <el-option
                                    v-for="item in normalizeOptionList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'int' && item.type !== 'float'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-if="item.type === 'int' || item.type === 'float'" v-model="item.selectOutliersAlgo" placeholder="请选择" @change="$forceUpdate()">
                            <el-option
                                    v-for="item in outlierOptionList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'int' && item.type !== 'float'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="5" v-if="isHasStringType">
                        <el-select v-model="item.selectCharterProcessing" placeholder="请选择" multiple v-if="item.type === 'string'" @change="$forceUpdate()">
                            <el-option
                                    v-for="item in characterProcessingOptionList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <div v-if="item.type !== 'string'" style="text-align: center"> --- </div>
                    </el-col>
                    <el-col :span="1" @click.native="onColumnPreviewClick(item)">
                        <i class="fas fa-eye"></i>
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
                normalizeOptionList: ['algo1', 'algo2', 'algo3'],
                outlierOptionList: ['algo1', 'algo2', 'algo3'],
                characterProcessingOptionList: ['algo1', 'algo2', 'algo3'],
                formOffset: 0, //Todo change offset when isHasStringType change 0 or3
                selectAllMissingValue: false,
                selectAllNormalizeAlgorithm: '',
                selectAllOutliersAlgo: '',
                selectAllCharterProcessing: [],
                imgList: []
            }
        },
        methods:{
            fetchData() {
                this.projectID = this.$route.params.projectID;
                this.fileID = this.$route.params.fileID;
                //TODO get file column list
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
                    console.warn(column)
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
                console.warn('onConfirmClick');
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