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
                            <el-option class="option" v-for="(item, index) in projectTypeOption" :label="item" :value="item" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Project Name" :label-width="addProjectPopupWidth">
                        <el-input v-model="form.projectName" autocomplete="off"></el-input>
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
                        prop="projectType"
                        label="Project Type"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="10%">
                    <template slot-scope="scope">
                        <el-button @click="onProjectManagementClick(scope.row.projectName, scope.row.projectID)" type="text" size="medium">Management</el-button>
                        <el-button @click="onProjectDeleteClick(scope.row.projectID)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
    import {project_add_url, project_delete_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'

    export default {
        name: 'projectInfo',
        props: [
            'title',
            'projectSum',
            'projectList',
            'dataType',
            'projectTypeOption'
        ],
        data: function () {
            return {
                isShowProjectDetail: false,
                isShowAddProjectPopup: false,
                addProjectPopupWidth: '120px',
                form: {
                    projectType: '',
                    projectName: ''
                }
            }
        },
        methods:{
            onShowDetailClick() {
                this.isShowProjectDetail = !this.isShowProjectDetail;
            },
            onProjectManagementClick(projectName, projectID) {
                window.localStorage.setItem('projectName', projectName);
                window.localStorage.setItem('projectType', this.dataType);
                this.$router.push({name: 'project', params: {projectID: projectID}})
            },
            onProjectDeleteClick(projectID) {
                this.$confirm('Do you want to confirm the deletion?', 'Hint', {
                    confirmButtonText: 'Conform',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let form = {
                        projectID: projectID,
                        token: window.localStorage.getItem('token')
                    }
                    post(project_delete_url, form).then((response) => {
                        if (response.data.status == 'success') {
                            this.$emit('projectUpdate');
                        } else {
                            this.$message.error('Delete error please try again');
                        }
                    })
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
                let form = {
                    projectName: this.form.projectName,
                    dataType: this.dataType,
                    projectType: this.form.projectType,
                    userID: window.localStorage.getItem('userID'),
                    token: window.localStorage.getItem('token')
                }
                post(project_add_url, form).then((response) => {
                    if (response.data.status == 'success') {
                        this.$emit('projectUpdate');
                        this.isShowAddProjectPopup = false;
                    }
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