<template>
    <el-container style="height: 100%">
        <el-alert
            title="This is BETA version. Your account could be deleted after release."
            type="warning">
        </el-alert>
        <el-header class="header">
            <div class="leftBlock">
                <el-link :underline="false">InAnalysis<i class="fas fa-hand-spock icon-left"></i></el-link>
                <el-link class="button" @click="onProjectMangementClick"><i class="fas fa-sitemap icon-right"></i> Management</el-link>
                <el-link class="button"><i class="fas fa-map-signs icon-right"></i>API Management</el-link>
            </div>
            <div class="rightBlock">
                <el-link class="button"><i class="fas fa-file-alt icon-right"></i>Document</el-link>
                <el-link class="button"><i class="fas fa-user icon-right"></i>{{userName}}</el-link>
                <el-link class="button"><i class="fas fa-sign-out-alt icon-right"></i>Sign Out</el-link>
            </div>
        </el-header>
        <el-container>
            <el-aside class="aside">
                <el-menu class="menu">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>Numerical Project</template>
                        <el-menu-item-group  class="submenu">
                            <el-tooltip content="test" placement="right" effect="dark" :disabled="true">
                                <el-menu-item index="1-1">选项1</el-menu-item>
                            </el-tooltip>
                            <el-tooltip content="test" placement="right" effect="dark">
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-tooltip>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-message"></i>Natural Language Processing Project</template>
                        <el-menu-item-group  class="submenu">
                            <el-menu-item index="2-1" :disabled='true'>选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-message"></i>Computer Vison Project</template>
                        <el-menu-item-group  class="submenu">
                            <el-menu-item index="3-1">选项1</el-menu-item>
                            <el-menu-item index="3-2">选项2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="main">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: 'manage',
        data: function () {
            return {
                userName: 'UserName'
            }
        },
        methods:{
            onProjectMangementClick() {
                this.$router.push('manage')
            }
        },
        components: {
        },
        computed: {
        },
    }
</script>
<style lang="scss" scoped>
    .header {
        font-size: 12px;
        background-color:#e7e7e7;
        display:  flex;
        align-items: center;
        color: gray;

        .icon-left {
                margin-left: 5px; 
            }

        .icon-right {
            margin-right: 5px; 
        }

        .leftBlock {
            width: 50%;
            height: 50%;
            display:  flex;
            align-items: center;

            .button {
                align-items: center;
                margin-left: 3%
            }

            .el-link {
                font-size: 16px;
            }
        }

        .rightBlock {
            width: 50%;
            height: 50%;
            display:  flex;
            align-items: center;
            justify-content: flex-end;

            .button {
                align-items: center;
                margin-left: 3%
            }

            .el-link {
                font-size: 16px;
            }
        }
    }

    .aside {
        background-color:#e7e7e7;
        width: 20%;
        height: 100%;

        .menu {
            background-color:#e7e7e7;

            .submenu {
                background-color: white;
            }
        }
    }

    .main {
        width: 80%;
        height: 100%;
    }
</style>