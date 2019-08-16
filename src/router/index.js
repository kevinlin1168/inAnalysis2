import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login';
import signup from '@/components/signup';
import manage from '@/components/manage';
import dataProjectManage from '@/components/dataProjectManage';
import projectManage from '@/components/projectManage'
import home from '@/components/home';
import filePreProcessing from '@/components/filePreProcessing';
import modelPredict from '@/components/modelPredict';
import modelManagement from '@/components/modelManagement';

Vue.use(Router);

export default new Router({
    strict: process.env.NODE_ENV !== 'production',
    routes: [{
        path: '/',
        component: login
    },{
        path: '/signup',
        component: signup
    },{
        path: '/home',
        component: manage,
        children: [{
            path: '',
            name: 'home',
            component: home
        },{
            path: '/project',
            name: 'dataProjectManage',
            component: dataProjectManage
        },{
            path: '/project/:projectID',
            name: 'project',
            component: projectManage
        }, {
            path: '/project/:projectID/filePreProcessing/:fileID',
            name: 'filePreProcessing',
            component: filePreProcessing
        },{
            path:'/project/:projectID/modelPredict/:modelID',
            name: 'modelPredict',
            component: modelPredict
        }, {
            path:'/project/:projectID/modelManagement/:modelID',
            name: 'modelManagement',
            component: modelManagement
        }]
    }]
})
