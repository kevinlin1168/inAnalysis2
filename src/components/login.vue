<template>
    <el-row>
        <el-col :span="6" :offset="9">
            <div class="grid-content dark">
                <div class="loginForm">
                    <el-image :src="inAnalysisLogo"></el-image>
                    <p> Please sign in </p>
                    <el-alert v-if="isError" class="loginAlert"
                        title="Invalid ID and password." 
                        type="error" 
                        effect="dark" 
                        :closable="false">
                    </el-alert>
                    <el-input v-model="userID" placeholder="User ID"></el-input>
                    <el-input v-model="userPassward" placeholder="Password"></el-input>
                    <el-button class="loginButton" type="primary" @click="login">Sign In</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import inAnalysisLogo from '@/assets/InAnalysisLogo.png';
    export default {
        name: 'login',
        data: function () {
            return {
                inAnalysisLogo: inAnalysisLogo,
                userID: '',
                userPassward: '',
                isError: true
            }
        },
        methods:{
            login() {
                console.log('login click');
                this.$router.push('home');
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
                margin-top: 10px
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