<template>
    <el-row>
        <el-col :span="6" :offset="9">
            <div class="grid-content dark">
                <div class="loginForm">
                    <el-image :src="inAnalysisLogo"></el-image>
                    <p> Please sign in </p>
                    <el-alert v-if="isError" class="loginAlert"
                        title="Invalid ID or password." 
                        type="error" 
                        effect="dark" 
                        :closable="false">
                    </el-alert>
                    <el-input v-model="userID" placeholder="User ID"></el-input>
                    <el-link style="color: white; text-align: right;" @click="isShowPopup = true">Forgot password?</el-link>
                    <el-input v-model="userPassward" placeholder="Password" type="password"></el-input>
                    <el-button class="loginButton" type="info" @click="signup" v-if="new Date() < signupTime">Sign Up</el-button>
                    <el-button class="loginButton" type="primary" @click="login">Sign In</el-button>
                </div>
            </div>
        </el-col>

        <!-- forgot password popup-->
        <el-dialog :title='"Forgot password"' :visible.sync="isShowPopup" :before-close="onForgetPasswordCancel">
            <el-form :model="form" :rules="formRule" ref="form">
                <el-form-item label="Account" prop="account">
                    <el-input v-model="form.account" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onForgetPasswordCancel">Cancel</el-button>
                <el-button type="primary" @click="onForgetPasswordConfirm">Confirm</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
    import inAnalysisLogo from '@/assets/InAnalysisLogo.png';
    import {user_signin_url, user_forgetPassword_url} from '@/config/api.js';
    import {signupTime} from '@/config/env.js';
    import { post } from '@/utils/requests/post.js';
    export default {
        name: 'login',
        data: function () {
            return {
                inAnalysisLogo: inAnalysisLogo,
                signupTime: signupTime,
                userID: '',
                userPassward: '',
                isError: false,
                isShowPopup: false,
                form: {
                    account: ''
                },
                formRule: {
                    account: [
                        { required: true, message: 'Please input account', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            login() {
                let userForm = {
                    account: this.userID,
                    password: this.userPassward
                }
                post(user_signin_url, userForm).then((resp) => {
                    if(resp.data.status == 'success') {
                        window.localStorage.setItem('isLogin', true)
                        window.localStorage.setItem('user', JSON.stringify({userID: resp.data.data.userID, userName: resp.data.data.userName}))
                        // window.localStorage.setItem('userID', resp.data.data.userID)
                        // window.localStorage.setItem('userName', resp.data.data.userName)
                        window.localStorage.setItem('token', resp.data.data.token)
                        this.$router.push('home');
                    } else {
                        this.isError = true;
                    }
                }).catch((error) => {
                    this.$message.error('Your account or password error')
                    console.warn('error', error);
                })
            },
            signup() {
                this.$router.push('signup');
            },
            onForgetPasswordCancel() {
                this.isShowPopup = false;
                this.form = {
                    account: ''
                }
            },
            onForgetPasswordConfirm() {
                let form = {
                    account: this.form.account
                }
                post(user_forgetPassword_url, form).then((resp) => {
                    if(resp.data.status == 'success') {
                        this.$message({
                            message: 'Please go to your email to verify your attempt in 10 minutes',
                            showClose: true,
                            duration: 0
                        })
                        this.$router.push('/');
                        this.isShowPopup = false;
                    }
                }).catch((error) => {
                    console.error('Forgot password error', error);
                })
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
<style lang="scss" scoped>
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

        .loginForm {
            padding: 25px;

            .loginButton {
                width: 100%;
                margin-top: 10px;
                margin-left: 0px;
            }

            .loginAlert {
                margin: 10px 0;
            }

            p {
                font-size: 24px;
                color: #ffffff;
            }
        }
    }

</style>