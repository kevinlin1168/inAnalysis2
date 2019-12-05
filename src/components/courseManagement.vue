<template>
    <el-row>
        <el-col :span="13" class="gridTitle"> Course List </el-col>
        <el-col :span="6" class="gridTitle"> Total Courses</el-col>
        <el-col :span="2" class="gridTitle"> {{courseList.length}} </el-col>
        <el-col :span="2" class="gridTitle">
            <el-tooltip content="Add project" placement="bottom" effect="light">
                <i class="el-icon-circle-plus" @click="isShowAddCoursePopup = true"></i>
            </el-tooltip>

            <!-- add project popup-->
            <el-dialog title='Add Courese' :visible.sync="isShowAddCoursePopup" :before-close="onAddCourseClose">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="Course Name" :label-width="addCoursePopupWidth" prop="courseName">
                        <el-input v-model="form.courseName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Course Year" :label-width="addCoursePopupWidth" prop="courseYear">
                        <el-date-picker v-model="form.courseYear" type="year" placeholder="please select course year"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Job Name" :label-width="addCoursePopupWidth" prop="jobName">
                        <el-input v-model="form.jobName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Deadline" :label-width="addCoursePopupWidth" prop="deadline">
                        <el-date-picker
                            v-model="form.deadline"
                            type="datetime"
                            placeholder="please select deadline">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="isShowAddCoursePopup = false">Cancel</el-button>
                    <el-button type="primary" @click="onAddCourseClick">Confirm</el-button>
                </div>
            </el-dialog>
        </el-col>
        <el-col :span="1" class="gridTitle projectInfo">
            <i class="el-icon-arrow-right" v-if="!isShowCourseDetail" @click="onShowDetailClick"></i>
            <i class="el-icon-arrow-down" v-if="isShowCourseDetail" @click="onShowDetailClick"></i>
        </el-col>
        <el-col :span="24" v-show="isShowCourseDetail">
            <el-table
                    :data="courseList"
                    style="width: 100%">
                <el-table-column
                        prop="courseName"
                        label="Course Title"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        prop="courseYear"
                        label="Year"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        prop="jobName"
                        label="Job name"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        prop="deadline"
                        label="Deadline"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="Actions"
                        min-width="15%">
                    <template slot-scope="scope">
                        <el-button @click="onCourseSendEmailClick(scope.row.courseID)" type="text" size="medium">Send Email</el-button>
                        <el-button @click="onCourseManageClick(scope.row.courseID)" type="text" size="medium">Management</el-button>
                        <el-button @click="onCourseUploadClick(scope.row.courseID)" type="text" size="medium">Upload</el-button>
                        <el-button @click="onCourseDeleteClick(scope.row.courseID)" type="text" size="medium" style="color: red">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <!-- manage course popup-->
        <el-dialog title='Manage Courese' :visible.sync="isShowManageCoursePopup" :before-close="onManageCourseClose">
            <el-form :model="courseForm" ref="form" :rules="rules">
                <el-form-item label="Course Name" :label-width="addCoursePopupWidth" prop="courseName">
                    <el-input v-model="courseForm.courseName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Course Year" :label-width="addCoursePopupWidth" prop="courseYear">
                    <el-date-picker v-model="courseForm.courseYear" type="year" placeholder="please select course year"> </el-date-picker>
                </el-form-item>
                <el-form-item label="Job Name" :label-width="addCoursePopupWidth" prop="jobName">
                    <el-input v-model="courseForm.jobName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Deadline" :label-width="addCoursePopupWidth" prop="deadline">
                    <el-date-picker
                        v-model="courseForm.deadline"
                        type="datetime"
                        placeholder="please select deadline">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="textBlock" v-if="isShowTable">
                <div class="title">Student Preview</div>
                <el-table
                    :data="courseForm.tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="ID"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        :prop="value"
                        :label="value"
                        width="120"
                        v-for=" value  in courseForm.studentList" :key="value">
                    </el-table-column>
                    <el-table-column
                        prop="average"
                        label="Average"
                        width="120">
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowManageCoursePopup = false">Cancel</el-button>
                <el-button type="primary" @click="onManageConfirmClick">Confirm</el-button>
            </div>
        </el-dialog>

        <!-- add file pop up -->
        <el-dialog :title='"Add File"' :visible.sync="isShowUploadFilePopup" width="400px" :before-close="onUploadSelectFileCloce">
            <el-upload
                    ref = "upload"
                    class = "upload-demo"
                    action="no use"
                    :http-request="uploadSelectionFile"
                    :limit= "1"
                    :on-exceed = "handleExceed"
                    :multiple = "false"
                    :auto-upload= "false"
                    :on-change = 'uploadFileChange'
                    :on-remove = 'uploadFileRemove'
                    :drag = 'isShowUploadBlock'>
                <i class="el-icon-upload" v-if="isShowUploadBlock"></i>
                <div class="el-upload__text" v-if="isShowUploadBlock">Drag file to upload or <em>Click to upload</em></div>
            </el-upload>
            <div slot="footer" class="dialog-footer" v-if="!isShowUploadBlock">
                <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitClick">Submit</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import { course_addCourse_url, 
    course_getCourse_url, 
    course_deleteCourse_url, 
    course_uploadStudentFile_url,
    course_getCourseByID_url,
    course_modifyCourse_url,
    course_sendEmail_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: "courseManage",
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data() {
            return {
                isShowAddCoursePopup: false,
                isShowManageCoursePopup: false,
                isShowCourseDetail: false,
                isShowUploadFilePopup: false,
                isShowUploadBlock: true,
                isShowTable: false,
                addCoursePopupWidth: '120px',
                courseList: [],
                courseID: '',
                form: {
                    courseName: '',
                    courseYear: '',
                    jobName: '',
                    deadline: ''
                },
                courseForm: {},
                rules: {
                    courseName: [
                        { required: true, message: 'please input course name', trigger: 'blur' }
                    ],
                    courseYear: [
                        { required: true, message: 'please select course year', trigger: 'blur' }
                    ],
                    jobName: [
                        { required: true, message: 'please input job name', trigger: 'blur' }
                    ],
                    deadline: [
                        { required: true, message: 'please select deadline', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            fetchData() {
                if(this.$route.name == 'courseManagement') {
                    let form = {
                        token: window.localStorage.getItem('token')
                    }
                    post(course_getCourse_url, form).then((response) => {
                        if (response.data.status == 'success') {
                            this.courseList = response.data.data.courseList;
                            this.courseList.forEach((item) => {
                                let datetime = new Date();
                                datetime.setTime(item.deadline * 1000);
                                let Y = datetime.getFullYear() + '-';
                                let M = (datetime.getMonth()+1 < 10 ? '0'+(datetime.getMonth()+1) : datetime.getMonth()+1) + '-';
                                let D = datetime.getDate() + ' ';
                                let h = datetime.getHours() + ':';
                                let m = datetime.getMinutes();
                                item.deadline = Y+M+D+h+m
                            })
                        }
                    })
                }
                    
            },
            onAddCourseClick() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let form = {
                            courseName: this.form.courseName,
                            courseYear: new Date(this.form.courseYear).getFullYear(),
                            jobName: this.form.jobName,
                            deadline: Math.round(new Date(this.form.deadline).getTime()/1000),
                            token: window.localStorage.getItem('token')
                        }
                        post(course_addCourse_url, form).then((response) => {
                            if (response.data.status == 'success') {
                                this.fetchData();
                                this.isShowAddCoursePopup = false;
                            }
                        })
                    } else {
                        return false
                    }
                });
            },
            onAddCourseClose() {
                this.form.courseName = '';
                this.form.courseYear = '';
                this.form.jobName = '';
                this.form.deadline = '';
                this.isShowAddCoursePopup = false;
            },
            onCourseManageClick(courseID) {
                let form = {
                    courseID: courseID,
                    token: window.localStorage.getItem('token')
                }
                post(course_getCourseByID_url, form).then((response) => {
                    if (response.data.status == 'success') {
                        this.courseForm = response.data.data.course[0];
                        let datetime = new Date();
                        datetime.setTime(this.courseForm.deadline * 1000);
                        this.courseForm.deadline = datetime;
                        this.courseForm.tableData = [];
                        if(this.courseForm.scoreList) {
                            Object.keys(this.courseForm.scoreList).forEach((key) => {
                            let object = {};
                            let scoreSum = 0;
                            let scoreLength = 0;
                            let notScoreList = [];
                            object['id'] = key
                            Object.keys(this.courseForm.scoreList[key]).forEach((subKey) => {
                                object[subKey] = this.courseForm.scoreList[key][subKey];
                                if(this.courseForm.scoreList[key][subKey] == 0) {
                                    notScoreList.push(subKey);
                                } else {
                                    scoreSum = scoreSum + this.courseForm.scoreList[key][subKey];
                                    scoreLength =scoreLength + 1;
                                }
                            })
                            object['average'] = scoreSum/scoreLength;
                            //TODO
                            console.log('notScoreList', notScoreList);
                            this.courseForm.tableData.push(object);
                            });
                            this.isShowTable = true;
                        } else {
                            this.isShowTable = false
                        }
                        this.isShowManageCoursePopup = true;
                        if(this.$refs['form']) {
                            this.$refs['form'].resetFields();
                        }
                    }
                })
            },
            onCourseSendEmailClick(courseID) {
                let form = {
                    courseID: courseID,
                    token: window.localStorage.getItem('token')
                }
                post(course_sendEmail_url, form).then((response) => {

                });
            },
            onManageCourseClose() {
                this.isShowManageCoursePopup = false;
                this.courseForm = {};
            },
            onManageConfirmClick() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let form = {
                            courseID: this.courseForm.courseID,
                            courseName: this.courseForm.courseName,
                            courseYear: new Date(this.courseForm.courseYear).getFullYear(),
                            jobName: this.courseForm.jobName,
                            deadline: Math.round(new Date(this.courseForm.deadline).getTime()/1000),
                            token: window.localStorage.getItem('token')
                        }
                        post(course_modifyCourse_url, form).then((response) => {
                            if (response.data.status == 'success') {
                                this.fetchData();
                                this.isShowManageCoursePopup = false;
                            }
                        })
                    } else {
                        return false
                    }
                });
            },
            onShowDetailClick() {
                this.isShowCourseDetail = !this.isShowCourseDetail;
            },
            onCourseDeleteClick(courseID) {
                let form = {
                    courseID: courseID,
                    token: window.localStorage.getItem('token')
                }
                post(course_deleteCourse_url, form).then((response) => {
                    if (response.data.status == 'success') {
                        this.fetchData();
                    }
                })
            },
            onCourseUploadClick(courseID) {
                this.courseID = courseID;
                this.isShowUploadFilePopup = true;
            },
            uploadSelectionFile(params) {
                let fileObj = params.file;
                let form = new FormData();
                form.append("file", fileObj);
                form.append("courseID", this.courseID);
                form.append("token", window.localStorage.getItem('token'))
                post(course_uploadStudentFile_url, form).then((response) => {
                    if (response.data.status == "success") {
                        console.log('success')
                        this.fetchData();
                    }
                }).catch((error) => {
                    console.error(error);
                });

                this.$refs.upload.clearFiles();
                this.isShowUploadBlock = true;
                this.isShowUploadFilePopup = false;
            },
            uploadFileRemove() {
                this.isShowUploadBlock = true;
            },
            onSubmitClick() {
                this.$refs.upload.submit();
            },
            handleExceed() {
                this.$message({
                    type: 'error',
                    message: 'You can only upload one file at a time'
                });
            },
            uploadFileChange(file, fileList) {
                if(fileList.length === 1) {
                    this.isShowUploadBlock = false;
                }
            },
            onUploadSelectFileCloce() {
                this.$refs.upload.clearFiles();
                this.isShowUploadBlock = true;
                this.isShowUploadFilePopup = false;
            }
        }
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
    }

    .gridSubTitle {
        border-bottom-style: solid;
        font-size: 18px;
        border-width: 1px;
        margin-top: 5px;
        border-radius: 0px;

        .projectInfo {
            margin: auto;
        }
    }

    .filePreview {
        .textBlock {
            .title {
                font-size: 18px;
            }
            .subTitle {
                font-size: 14px;
            }
            .textPreview {
                margin-top: 10px;
                white-space: pre-wrap;
            }
        }
        .imgBlock{
            width: 625px;
            .title {
                // text-align: center;
                font-size: 18px;
            }
        }
    }

    .modelPreview {
        .textBlock {
            .textPreview {
                margin-top: 10px;
                white-space: pre-wrap;
            }
        }
        .imgBlock{
            margin-top: 10px;
        }
        .title {
            font-size: 18px;
        }
    }

    .el-select {
        width: 100%;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    
</style>