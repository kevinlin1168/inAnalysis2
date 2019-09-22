<template>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content dark">
                <div class="signupForm">
                    <el-image :src="inAnalysisLogo"></el-image>
                    <p> Forgot Password </p>
                    <el-form ref="form" :model="form" label-width="140px" :rules="rules">
                        <el-form-item label="Account" prop="userAccount">
                            <el-input v-model="form.userAccount" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="Password" prop="userPassword">
                            <el-input v-model="form.userPassword" placeholder="Password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="Check Password" prop="userPasswordCheck">
                            <el-input v-model="form.userPasswordCheck" placeholder="Check Password" type="password"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button class="signupButton" type="primary" @click="confirm">Confirm</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import inAnalysisLogo from '@/assets/InAnalysisLogo.png';
    import {user_forgetPasswordVerify_url} from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'signup',
        created: function() {
            this.token = this.$route.params.token;
            let userString = decodeURIComponent(escape(window.atob(this.token.split('.')[1])));
            let user = JSON.parse(userString);
            this.form.userAccount = user.account;
        },
        data: function () {
            var validatePass = (rule, value, callback) => {
                if (value !== this.form.userPassword) {
                    callback(new Error('Password is different'));
                } else {
                    callback();
                }
            };
            return {
                inAnalysisLogo: inAnalysisLogo,
                token: '',
                form: {
                    userAccount: '',
                    userPassword: '',
                    userPasswordCheck: ''
                },
                rules: {
                    userPassword: [
                        { required: true, message: 'Please input password', trigger: 'blur' }
                    ],
                    userPasswordCheck: [
                        { required: true, message: 'Please input password again', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            confirm() {
                console.warn(this.form)
                let userForm = {
                    token: this.token,
                    password: this.form.userPassword
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        post(user_forgetPasswordVerify_url, userForm).then((response) => {
                            if(response.data.status == 'success') {
                                this.$message({
                                    message: 'Your password has change',
                                    showClose: true,
                                    duration: 0
                                })
                                this.$router.push('/');
                            }
                        }).catch(() => {
                            this.$message({
                                message:'Verify error',
                                type: 'error',
                                showClose: true,
                                duration: 0})
                            this.$router.push("/");
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        components: {
        },
        computed: {
            // defaultActive: function() {
            //     return this.$route.path.replace('/', '');
            // }
        },
    }
</script>
<style lang="scss">
    .el-row {
    margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .dark {
        background: #000000;
        background-color: #000000;
    }
    .grid-content {
        margin-top: 10%;
        border-radius: 4px;
        min-height: 36px;

        .signupForm {
            padding: 25px;

            .signupButton {
                width: 100%;
                margin-top: 10px
            }

            .signupAlert {
                margin: 10px 0;
            }

            p {
                font-size: 24px;
                color: #ffffff;
            }

            .el-form-item {
                label {
                    margin-bottom: 0px;
                    color: white;
                }
            }
        }
    }

</style>