<template>
    <el-row>
        <el-col :span="13" class="gridTitle"> {{title}} </el-col>
        <el-col :span="6" class="gridTitle"> Total Projects</el-col>
        <el-col :span="2" class="gridTitle"> {{projectSum}}</el-col>
        <el-col :span="2" class="gridTitle">
            <el-tooltip content="Add project" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="isShowAddProjectPopup = true"></i>
            </el-tooltip>

            <!-- add project popup-->
            <el-dialog :title='"Add " + title' :visible.sync="isShowAddProjectPopup">
                <el-form :model="form">
                    <el-form-item label="Project Type" :label-width="addProjectPopupWidth">
                        <el-select v-model="form.projectType" placeholder="please select project type">
                            <template v-if="dataType == 'num'">
                                <el-option class="option" v-for="(item, index) in numProjectTypeOption" :label="item" :value="item" :key="index"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Project Name" :label-width="addProjectPopupWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAddProjectPopup = false">Cancel</el-button>
                    <el-button type="primary" @click="onAddProjectClick">Confirm</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="1" class="gridTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowProjectDetail" @click="onShowDetailClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowProjectDetail" @click="onShowDetailClick"></i>
        </el-col>
        <el-col :span="24" v-show="isShowProjectDetail">
            <el-table
                    :data="projectList"
                    style="width: 100%">
                <el-table-column
                        prop="projectName"
                        label="Project Name"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                        prop="dataType"
                        label="Project Type"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="10%">
                    <template slot-scope="scope">
                        <el-button @click="onProjectManagementClick(scope.row.id)" type="text" size="medium">Management</el-button>
                        <el-button @click="onProjectDeleteClick(scope.row.id)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
    import {project_add_url} from '@/config/api.js';

    export default {
        name: 'projectInfo',
        props: [
            'title',
            'projectSum',
            'projectList',
            'dataType'
        ],
        data: function () {
            return {
                isShowProjectDetail: false,
                isShowAddProjectPopup: false,
                addProjectPopupWidth: '120px',
                form: {
                    projectType: '',
                    projectName: ''
                },
                numProjectTypeOption: [
                    'Abnormal Detection',
                    'Regression',
                    'Classification',
                    'Clustering'
                ]
            }
        },
        methods:{
            onShowDetailClick() {
                this.isShowProjectDetail = !this.isShowProjectDetail;
            },
            onProjectManagementClick(projectID) {
                this.$router.push({name: 'project', params: {projectID: projectID}})
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
                console.warn(window.localStorage.getItem('userID'));
                this.isShowAddProjectPopup = false
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
    border-radius: 0px;
    font-size: 24px;
    border-width: 2px;

    .el-select {
        width: 100%;
    }

    .projectInfo {
        margin: auto;
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