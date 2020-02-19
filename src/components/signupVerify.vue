<template>
    <a></a>
</template>
<script>
    import { user_signupVerify_url } from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'
    export default {
        name: 'signupVerify',
        created: function() {
            this.token = this.$route.params.token;
            let data = {
                'token': this.token
            }
            post(user_signupVerify_url, data).then((resp) => {
                if(resp.data.status == 'success') {
                    this.$message({
                        message: 'Verify success, you can signup now',
                        type: 'success',
                        showClose: true,
                        duration: 0
                    });
                    this.$router.push("/");
                }
            }).catch(() => {
                this.$message({
                    message:'Verify error please signup again',
                    type: 'error',
                    showClose: true,
                    duration: 0})
                this.$router.push("/");
            })
        },
        data: function () {
            return {
                token: ''
            }
        },
        methods:{
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