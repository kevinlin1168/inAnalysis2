<template>
    <div>
        <projectInfo title="Numerical Projects" 
                        :project-sum="numericalProjectList.length"
                        :project-list="numericalProjectList"
                        :data-type="'num'"
                        :project-type-option="numericalProjectOptionList"
                        @projectUpdate= 'fetchData'
                        >
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Natural Language Processing Projects" 
                        :data-type="'nlp'"
                        :project-sum="NLPProjectList.length"
                        :project-list="NLPProjectList"
                        :project-type-option="NLPProjectOptionList"
                        @projectUpdate= 'fetchData'>
        </projectInfo>
        <projectInfo style="margin-top: 16px"
                        title="Computer Vision Projects"
                        :data-type="'cv'"
                        :project-sum="CVProjectList.length"
                        :project-list="CVProjectList"
                        :project-type-option="CVProjectOptionList"
                        @projectUpdate= 'fetchData'>
        </projectInfo>
    </div>
</template>
<script>
    import projectInfo from './dataProjectInfo';
    import {project_getProjectByUser_url, system_getDataProject_url} from '@/config/api.js';
    import { post } from '@/utils/requests/post.js'

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
                numericalProjectList: [],
                NLPProjectList: [],
                CVProjectList: [],
                numericalProjectOptionList: [],
                NLPProjectOptionList: [],
                CVProjectOptionList: []
            }
        },
        methods:{
            fetchData() {
                if (this.$route.name == 'dataProjectManage') {
                    let userFrom = {
                    userID: window.localStorage.getItem('userID'),
                    token: window.localStorage.getItem('token')
                    };
                    this.numericalProjectList = [];
                    this.NLPProjectList = [];
                    this.CVProjectList = [];
                    post(project_getProjectByUser_url, userFrom).then((response) => {
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
                    let form = {
                        token: window.localStorage.getItem('token')
                    }
                    post(system_getDataProject_url, form).then((resp) => {
                        if(resp.data.status == 'success') {
                            this.numericalProjectOptionList = resp.body.data.num;
                            this.NLPProjectOptionList = resp.body.data.nlp;
                            this.CVProjectOptionList = resp.body.data.cv;  
                        }
                        
                    })
                }
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