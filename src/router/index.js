import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login';
import manage from '@/components/manage';
import dataProjectManage from '@/components/dataProjectManage';
import projectManage from '@/components/projectManage'
import home from '@/components/home';

Vue.use(Router);

export default new Router({
    strict: process.env.NODE_ENV !== 'production',
    routes: [{
        path: '/',
        component: login
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
            path: '/project/:id',
            name: 'project',
            component: projectManage
        }]
    }]
})
