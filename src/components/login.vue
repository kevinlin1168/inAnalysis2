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
                    <el-input v-model="userPassward" placeholder="Password" type="password"></el-input>
                    <el-button class="loginButton" type="info" @click="signup">Sign Up</el-button>
                    <el-button class="loginButton" type="primary" @click="login">Sign In</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import inAnalysisLogo from '@/assets/InAnalysisLogo.png';
    import {user_signin_url, project_getProjectByUser_url} from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'login',
        data: function () {
            return {
                inAnalysisLogo: inAnalysisLogo,
                userID: '',
                userPassward: '',
                isError: false
            }
        },
        methods:{
            login() {
                let userFrom = {
                    account: this.userID,
                    password: this.userPassward
                }
                post(user_signin_url, userFrom).then((resp) => {
                    console.warn('resp', resp)
                    if(resp.data.status == 'success') {
                        window.localStorage.setItem('isLogin', true)
                        window.localStorage.setItem('userID', resp.data.data.userID)
                        window.localStorage.setItem('userName', resp.data.data.userName)
                        window.localStorage.setItem('token', resp.data.data.token)
                        this.$router.push('home');
                    } else {
                        this.isError = true;
                    }
                }).catch((error) => {
                    console.warn('error', error);
                })
            },
            signup() {
                this.$router.push('signup');
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