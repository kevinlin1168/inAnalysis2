<template>
    <div>
        <projectInfo title="Numerical Projects" 
                        :project-sum="numericalProjectList.length"
                        :project-list="numericalProjectList"
                        :data-type="'num'">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Natural Language Processing Projects" 
                        :project-sum="NLPProjectList.length"
                        :project-list="NLPProjectList">
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Computer Vision Projects"
                        :project-sum="CVProjectList.length"
                        :project-list="CVProjectList">
        </projectInfo>
    </div>
</template>
<script>
    import projectInfo from './projectInfo';
    import {project_getProjectByUser_url} from '@/config/api.js';

    export default {
        name: 'home',
        created: function() {
            this.fetchData();
        },
        watch: {
            '$route': 'fetchData'
        },
        data: function () {
            return {
                numericalProjectList: [
                    {
                        projectName: 'test1',
                        projectType: 'num',
                        dataType: 'test1',
                        projectID: 'aaa'
                    },
                    {
                        projectName: 'test2',
                        projectType: 'num',
                        dataType: 'test2',
                        projectID: 'bbb'
                    }
                ],
                NLPProjectList: [],
                CVProjectList: []
            }
        },
        methods:{
            fetchData() {
                let userFrom = {
                    userID: window.localStorage.getItem('userID')
                };
                console.warn(userFrom)
                this.$http.post(project_getProjectByUser_url, userFrom, {emulateJSON:true}).then((response) => {
                    console.warn('resp', response);
                }, () => {
                    console.error('getProjectListError')
                });
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