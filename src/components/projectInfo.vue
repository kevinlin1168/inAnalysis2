<template>
    <el-row>
        <el-col :span="13" class="grid-title"> {{title}} </el-col>
        <el-col :span="6" class="grid-title"> Total Projects</el-col>
        <el-col :span="2" class="grid-title"> {{projectSum}}</el-col>
        <el-col :span="2" class="grid-title">
            <el-tooltip content="Add project" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="isShowAddProjectPopup = true"></i>
            </el-tooltip>

            <!-- add project popup-->
            <el-dialog :title='"Add " + title' :visible.sync="isShowAddProjectPopup">
                <el-form :model="form">
                    <el-form-item label="Project Type" :label-width="addProjectPopupWidth">
                        <el-select v-model="form.projectType" placeholder="please select project type">
                            <el-option class="option" v-for="(item, index) in ProjectTypeOption" :label="item" :value="index" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Project Name" :label-width="addProjectPopupWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAddProjectPopup = false">Cancel</el-button>
                    <el-button type="primary" @click="isShowAddProjectPopup = false">Confirm</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="1" class="grid-title projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowNumericalDetail" @click="showDetail"></i>
            <i class="el-icon-arrow-down" v-if="isShowNumericalDetail" @click="showDetail"></i>
        </el-col>
        <el-col :span="24" v-show="isShowNumericalDetail">
            <el-table
                    :data="projectList"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="Project Name">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium">Management</el-button>
                        <el-button @click="onProjectDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <!--<el-col :span="24">-->
            <!--<el-row class="projectBlock">-->
                <!--<el-col :span="3" class="projectInfo"> Total Projects</el-col>-->
                <!--<el-col :span="2" class="projectInfo"> {{projectSum}}</el-col>-->
                <!--<el-col :span="3" class="projectInfo"> Total models</el-col>-->
                <!--<el-col :span="2" class="projectInfo"> {{modelSum}}</el-col>-->
                <!--<el-col :span="3" class="projectInfo"> Total Files</el-col>-->
                <!--<el-col :span="2" class="projectInfo"> {{fileSum}}</el-col>-->
                <!--<el-col :span="5" class="projectInfo">-->
                    <!--<el-button type="primary">management</el-button>-->
                <!--</el-col>-->
                <!--<el-col :span="1" class="projectInfo"> -->
                    <!--<i class="el-icon-arrow-right" v-if="!isShowNumericalDetail" @click="showNumericalDetail"></i>-->
                    <!--<i class="el-icon-arrow-down" v-if="isShowNumericalDetail" @click="showNumericalDetail"></i> -->
                <!--</el-col>-->
            <!--</el-row>-->
            <!--<el-col v-if="isShowNumericalDetail" :span="24">-->
                <!--<el-table :data="tableData" style="width: 100%">-->
                    <!--<el-table-column prop="date" label="日期" width="180"> </el-table-column>-->
                    <!--<el-table-column prop="name" label="姓名" width="180"> </el-table-column>-->
                    <!--<el-table-column prop="address" label="地址"></el-table-column>-->
                <!--</el-table>-->
            <!--</el-col>-->
        <!--</el-col>-->
    </el-row>
</template>
<script>
    export default {
        name: 'projectInfo',
        props: [
            'title',
            'projectSum',
            'projectList'
        ],
        data: function () {
            return {
                isShowNumericalDetail: false,
                isShowAddProjectPopup: false,
                addProjectPopupWidth: '120px',
                form: {
                    projectType: '',
                    projectName: ''
                },
                ProjectTypeOption: [
                    'Abnormal Detection',
                    'Regression',
                    'Classification',
                    'Clustering'
                ]
            }
        },
        methods:{
            showDetail() {
                this.isShowNumericalDetail = !this.isShowNumericalDetail;
            },
            onProjectManagementClick(projectID) {
                console.warn(projectID);
                this.$router.push({name: 'project', params: {id: projectID}})
            },
            onProjectDeleteClick(projectID) {
                console.warn(projectID);
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
            onAddProjectClick() {

            }
        },
        components: {
        },
        computed: {
        },
    }
</script>
<style lang="scss" scoped>
.grid-title {
    border-bottom-style: solid;
    font-size: 24px;
    border-width: 2px;

    .el-select {
        width: 100%;
    }
}

.projectBlock {
    margin-top: 16px;
    display: flex;

    .projectInfo {
        margin: auto;
    }
}
</style>