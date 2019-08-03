<template>
    <div>
        <el-row class="cardContainer">
            <el-col :span="4" :offset="7">
                <el-card  shadow="hover" class="clickable" @click.native="OnProjectCardClick">
                    <div class="cardHeader">Project Sum</div>
                    <div class="cardMain">
                        <div class="number">
                            20
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="4" :offset="2">
                <el-card shadow="hover" class="clickable" @click.native="OnApiCardClick">
                    <div class="cardHeader">Api Sum</div>
                    <div class="cardMain">
                        <div class="number">
                            87
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="cardContainer">
            <el-col :span="4" :offset="7">
                <el-card  shadow="never">
                    <div class="cardHeader">Model Sum</div>
                    <div class="cardMain">
                        <div class="number">
                            21
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="4" :offset="2">
                <el-card shadow="never">
                    <div class="cardHeader">File Sum</div>
                    <div class="cardMain">
                        <div class="number">
                            22
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name: 'home',
        data: function () {
            return {
            }
        },
        methods:{
            OnProjectCardClick() {
                console.warn('projectCard Click')
                this.$router.push('/project')
            },
            OnApiCardClick() {
                console.warn('ApiCard Click')
            }
        },
        components: {
        },
        computed: {
        },
    }
</script>
<style lang="scss" scoped>
    .head {
        font-size: 16px;
    }
    .cardContainer {
        margin-top: 16px;

        .clickable {
            cursor: pointer;
        }
        .clickable :hover {
            cursor: pointer;
            background-color: #FEF6ED;
        }

        .cardHeader {
            height: 40px;
            border-bottom-style: solid;
            font-size: 32px;
            border-width: 1px;
            color: #606266;
        }

        .cardMain {
            position: relative;
            height: 200px;

            .number {
                font-weight:bold;
                font-size: 56px;
                position: absolute;
                bottom: 10px;
                right: 10px;
                color: #606266;
            }
        }
    }
</style>