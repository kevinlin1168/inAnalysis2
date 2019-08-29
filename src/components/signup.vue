<template>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content dark">
                <div class="signupForm">
                    <el-image :src="inAnalysisLogo"></el-image>
                    <p> Sign up </p>
                    <el-form ref="form" :model="signupForm" label-width="140px" :rules="rules">
                        <el-form-item label="Account" prop="userAccount">
                            <el-input v-model="signupForm.userAccount" placeholder="User Accunt"></el-input>
                        </el-form-item>
                        <el-form-item label="Password" prop="userPassword">
                            <el-input v-model="signupForm.userPassword" placeholder="Password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="Check Password" prop="userPasswordCheck">
                            <el-input v-model="signupForm.userPasswordCheck" placeholder="Check Password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="Email" prop="userEmail">
                            <el-input v-model="signupForm.userEmail" placeholder="Email" ></el-input>
                        </el-form-item>
                        <el-form-item label="Name" prop="userName">
                            <el-input v-model="signupForm.userName" placeholder="Name" ></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button class="signupButton" type="primary" @click="signup">Sign up</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import inAnalysisLogo from '@/assets/InAnalysisLogo.png';
    import {user_signup_url} from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'signup',
        data: function () {
            var validatePass = (rule, value, callback) => {
                if (value !== this.signupForm.userPassword) {
                    callback(new Error('Password is different'));
                } else {
                    callback();
                }
            };
            return {
                inAnalysisLogo: inAnalysisLogo,
                signupForm: {
                    userAccount: '',
                    userPassword: '',
                    userPasswordCheck: '',
                    userEmail: '',
                    userName: ''
                },
                rules: {
                    userAccount: [
                        { required: true, message: 'Please input account', trigger: 'blur' }
                    ],
                    userPassword: [
                        { required: true, message: 'Please input password', trigger: 'blur' }
                    ],
                    userPasswordCheck: [
                        { required: true, message: 'Please input password again', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    userEmail: [
                        { required: true, message: 'Please input email', trigger: 'blur' }
                    ],
                    userName: [
                        { required: true, message: 'Please input name', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            signup() {
                let userFrom = {
                    account: this.signupForm.userAccount,
                    name: this.signupForm.userName,
                    password: this.signupForm.userPassword,
                    email: this.signupForm.userEmail,
                }
                 this.$refs['form'].validate((valid) => {
                    if (valid) {
                        post(user_signup_url, userFrom).then((response) => {
                            if(response.body.status == 'success') {
                                this.$router.push('/');
                            } else {
                                this.isError = true
                            }
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