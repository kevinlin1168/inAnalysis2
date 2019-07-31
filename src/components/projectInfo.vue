<template>
    <el-row>
        <el-col :span="24"><div class="grid-title">{{title}}</div></el-col>
        <el-col :span="24">
            <el-row class="projectBlock">
                <el-col :span="3" class="projectInfo"> Total Projects</el-col>
                <el-col :span="2" class="projectInfo"> {{projectSum}}</el-col>
                <el-col :span="3" class="projectInfo"> Total models</el-col>
                <el-col :span="2" class="projectInfo"> {{modelSum}}</el-col>
                <el-col :span="3" class="projectInfo"> Total Files</el-col>
                <el-col :span="2" class="projectInfo"> {{fileSum}}</el-col>
                <el-col :span="5" class="projectInfo">
                    <el-button type="primary">management</el-button>
                </el-col>
                <el-col :span="1" class="projectInfo"> 
                    <i class="el-icon-arrow-right" v-if="!isShowNumericalDetail" @click="showNumericalDetail"></i>
                    <i class="el-icon-arrow-down" v-if="isShowNumericalDetail" @click="showNumericalDetail"></i> 
                </el-col>
            </el-row>
            <el-col v-if="isShowNumericalDetail" :span="24">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column>
                </el-table>
            </el-col>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'projectInfo',
        props: [
            'title',
            'projectSum',
            'modelSum',
            'fileSum',
            'tableData'
        ],
        data: function () {
            return {
                // numericalProjectSum: '20',
                // numericalModelSum: '20',
                // numericalFileSum: '20',
                isShowNumericalDetail: false,
                // tableData: []
            }
        },
        methods:{
            showNumericalDetail() {
                this.isShowNumericalDetail = !this.isShowNumericalDetail;
            }
        },
        components: {
        },
        computed: {
        },
    }
</script>
<style lang="scss" scoped>
.grid-title {
    border-bottom-style: solid;
    font-size: 24px;
    border-width: 2px;
}

.projectBlock {
    margin-top: 16px;
    display:  flex;

    .projectInfo {
        margin: auto;
    }
}
</style>