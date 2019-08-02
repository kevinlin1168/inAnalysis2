<template>
    <div>
        <projectInfo title="Numerical Projects" 
                        :project-sum="numericalProjectSum"
                        :project-list="numericalProjectList">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Natural Language Processing Projects" 
                        :project-sum="numericalProjectSum"
                        :project-list="numericalProjectList">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Computer Vision Projects"
                        :project-sum="numericalProjectSum"
                        :project-list="numericalProjectList">
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
                numericalProjectList: [
                    {
                        name: 'test1',
                        projectType: 'test1',
                        id: 'aaa'
                    },
                    {
                        name: 'test2',
                        projectType: 'test2',
                        id: 'bbb'
                    }
                ],
                APISum: '10',
                isShowNumericalDetail: false,
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