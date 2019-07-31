<template>
    <div>
        <projectInfo title="Numerical Projects" 
                        :projectSum="numericalProjectSum" 
                        :modelSum="numericalModelSum" 
                        :fileSum="numericalFileSum">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Natural Language Processing Projects" 
                        :projectSum="numericalProjectSum" 
                        :modelSum="numericalModelSum" 
                        :fileSum="numericalFileSum">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Computer Vison Projects" 
                        :projectSum="numericalProjectSum" 
                        :modelSum="numericalModelSum" 
                        :fileSum="numericalFileSum">
        </projectInfo>
    </div>
</template>
<script>
    import projectInfo from './projectInfo';
    export default {
        name: 'home',
        data: function () {
            return {
                numericalProjectSum: '20',
                numericalModelSum: '20',
                numericalFileSum: '20',
                APISum: '10',
                isShowNumericalDetail: false,
                tableData: []
            }
        },
        methods:{
            showNumericalDetail() {
                this.isShowNumericalDetail = !this.isShowNumericalDetail;
            }
        },
        components: {
            projectInfo
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
    display:  flex;

    .projectInfo {
        margin: auto;
    }
}
</style>