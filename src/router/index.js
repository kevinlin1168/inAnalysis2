import Vue from 'vue'
import Router from 'vue-router'
import {deadline} from '@/config/env.js';

import login from '@/components/login';
import signup from '@/components/signup';
import signupVerify from '@/components/signupVerify';
import passwordVerify from '@/components/forgetPasswordVerify';
import manage from '@/components/manage';
import dataProjectManage from '@/components/dataProjectManage';
import projectManage from '@/components/projectManage'
import home from '@/components/home';
import filePreProcessing from '@/components/filePreProcessing';
import modelPredict from '@/components/modelPredict';
import modelManagement from '@/components/modelManagement';
import courseManagement from '@/components/courseManagement';
import judgeManagement from '@/components/judgeManagement';
import missingDeadline from '@/components/missingDeadlinePage';

Vue.use(Router);


const router = new Router({
    routes: [{
        path: '/missingDeadline',
        component: missingDeadline,
        meta: {
            isLogin: false
        }
    },{
        path: '/',
        component: login,
        meta: {
            isLogin: false
        }
    },{
        path: '/judge/:courseID/:studentIndex',
        name: 'judgeManagement',
        component: judgeManagement,
        meta: {
            isLogin: false
        }
    },{
        path: '/signup',
        component: signup,
        meta: {
            isLogin: false
        }
    },{
        path: '/signup/:token',
        component: signupVerify,
        meta: {
            isLogin: false
        }
    },{
        path: '/password/:token',
        component: passwordVerify,
        meta: {
            isLogin: false
        }
    },{
        path: '/home',
        component: manage,
        meta: {
            isLogin: true,
            role: '1'
        },
        children: [{
            path: '',
            name: 'home',
            component: home,
            meta: {
                isLogin: true,
                role: '1'
            }
        },{
            path: '/project',
            name: 'dataProjectManage',
            component: dataProjectManage,
            meta: {
                isLogin: true,
                role: '1'
            }
        },{
            path: '/project/:projectID',
            name: 'project',
            component: projectManage,
            meta: {
                isLogin: true,
                role: '1'
            }
        }, {
            path: '/project/:projectID/filePreProcessing/:fileID',
            name: 'filePreProcessing',
            component: filePreProcessing,
            meta: {
                isLogin: true,
                role: '1'
            }
        },{
            path:'/project/:projectID/modelPredict/:modelIndex',
            name: 'modelPredict',
            component: modelPredict,
            meta: {
                isLogin: true,
                role: '1'
            }
        }, {
            path:'/project/:projectID/modelManagement/:modelIndex',
            name: 'modelManagement',
            component: modelManagement,
            meta: {
                isLogin: true,
                role: '1'
            }
        }, {
            path:'/course/manage',
            name: 'courseManagement',
            component: courseManagement,
            meta: {
                isLogin: true,
                role: '99'
            }
        }]
    }]
});

router.beforeEach((to, from, next) => {

    let isLogin = (localStorage.getItem("isLogin") === 'true');
    let userRole;
    try {
        userRole = JSON.parse(window.localStorage.getItem('user')).userRole;
    } catch (error) {
        userRole = '1'
    }
    console.log(userRole)
    console.log(from.path)
  
    if( new Date() > deadline && to.path != '/missingDeadline') {
        next('/missingDeadline')
    } else if(isLogin && (Number(userRole) >= Number(to.meta.role))){
        next()
    }else{
        if(to.meta.isLogin){
            next({
            path: '/'
            })
        }else{
            if((Number(userRole) >= Number(to.meta.role))) {
                next('/home')
            } else {
                next()
            }
        }
  
    }
  
});

export default router;
