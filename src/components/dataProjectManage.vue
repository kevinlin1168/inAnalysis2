<template>
    <div>
        <projectInfo title="Numerical Projects" 
                        :project-sum="numericalProjectList.length"
                        :project-list="numericalProjectList"
                        :data-type="'num'"
                        @projectUpdate= 'fetchData'
                        >
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
    import projectInfo from './dataProjectInfo';
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
                    userID: window.localStorage.getItem('userID'),
                    token: window.localStorage.getItem('token')
                };
                this.numericalProjectList = [];
                this.NLPProjectList = [];
                this.CVProjectList = []
                this.$http.post(project_getProjectByUser_url, userFrom).then((response) => {
                    response.body.data.projectList.forEach((item) => {
                        switch(item.dataType) {
                            case 'num':
                                this.numericalProjectList.push(item);
                                break;
                            case 'nlp':
                                this.NLPProjectList.push(item);
                                break;
                            case 'cv':
                                this.CVProjectList.push(item);
                                break;
                        }
                    })
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