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


const router = new Router({
    routes: [{
        path: '/',
        component: login,
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
        path: '/home',
        component: manage,
        meta: {
            isLogin: true
        },
        children: [{
            path: '',
            name: 'home',
            component: home,
            meta: {
                isLogin: true
            }
        },{
            path: '/project',
            name: 'dataProjectManage',
            component: dataProjectManage,
            meta: {
                isLogin: true
            }
        },{
            path: '/project/:projectID',
            name: 'project',
            component: projectManage,
            meta: {
                isLogin: true
            }
        }, {
            path: '/project/:projectID/filePreProcessing/:fileID',
            name: 'filePreProcessing',
            component: filePreProcessing,
            meta: {
                isLogin: true
            }
        },{
            path:'/project/:projectID/modelPredict/:modelID',
            name: 'modelPredict',
            component: modelPredict,
            meta: {
                isLogin: true
            }
        }, {
            path:'/project/:projectID/modelManagement/:modelID',
            name: 'modelManagement',
            component: modelManagement,
            meta: {
                isLogin: true
            }
        }]
    }]
});

router.beforeEach((to, from, next) => {

    let isLogin = (sessionStorage.getItem("isLogin") === 'true');
    console.warn('isLogin', isLogin)
  
    if(isLogin){
        next()
    }else{
      if(to.meta.isLogin){
        next({
          path: '/'
        })
      }else{
        next()
      }
  
    }
  
});

export default router;
