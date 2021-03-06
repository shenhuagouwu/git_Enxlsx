/*
 * @Author: your name
 * @Date: 2020-05-14 16:27:38
 * @LastEditTime: 2020-06-06 11:24:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \git_Enxlsx\src\router\index.js
 */ 
import Vue from 'vue';
import Router from 'vue-router';
/* 1. 定义路由组件 */
import Layout from '@/layout';

Vue.use(Router);

/* 2. 定义路由 */
const routes = [
    {
        path: '/',
        redirect: '/index',
        component: Layout,
        children: [
            {
                path: '/index',
                component: () => import('@/views/default/index'),
                name: 'defaultPage'
            },
            {
                path: '/index/time',
                component: () => import('@/views/index/index'),
                name: 'indexPage',
                children: [
                    {
                        path: '/index/time',
                        component: () => import('@/views/timeInterval/index'),
                        name: 'timeIntervalPage',
                    },{
                        path: '/index/sourcemode',
                        component: () => import('@/views/SourceMode/index'),
                        name: 'SourceMode',
                    },{
                        path: '/index/team',
                        component: () => import('@/views/team/index'),
                        name: 'teamPage',
                    }
                ]
            },
        ]
    }
];
// {
//     path: '/index/dateTime',
//     component: () => import('@/views/dateTime/index'),
//     name: 'dateTimePage',
// },{
//     path: '/index/product',
//     component: () => import('@/views/product/index'),
//     name: 'productPage',
// }, {
//     path: '/index/Channel',
//     component: () => import('@/views/Channel/index'),
//     name: 'ChannelPage',
// },{
//     path: '/index/Source',
//     component: () => import('@/views/Source/index'),
//     name: 'SourcePage',
// },{
//     path: '/index/Firstlevel',
//     component: () => import('@/views/Firstlevel/index'),
//     name: 'FirstlevelPage',
// }

/* 3. 创建 router 实例 */
const router = new Router({
    /* 4. 传 `routes` 配置，这里是缩写，相当于 routes: routes */
    //mode:'history',
    routes
});
/* 5. 暴露出该文件 */
export default router;