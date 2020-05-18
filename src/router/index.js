import Vue from 'vue';
import Router from 'vue-router';
/* 1. 定义路由组件 */
import Layout from '@/layout';

Vue.use(Router);

/* 2. 定义路由 */
const routes = [
    {
        path: '/',
        redirect: '/index/time',
        component: Layout,
        children: [
            {
                path: '/index',
                redirect: '/index/time',
                component: () => import('@/views/index/index'),
                name: 'indexPage',
                children: [
                    {
                        path: '/index/time',
                        component: () => import('@/views/timeInterval/index'),
                        name: 'timeIntervalPage',
                    }, {
                        path: '/index/new',
                        component: () => import('@/views/news/index'),
                        name: 'newPage',
                    }, {
                        path: '/index/product',
                        component: () => import('@/views/product/index'),
                        name: 'productPage',
                    }, {
                        path: '/index/video',
                        component: () => import('@/views/video/index'),
                        name: 'videoPage',
                    }, {
                        path: '/index/wenda',
                        component: () => import('@/views/wenda/index'),
                        name: 'wendaPage',
                    },
                ]
            },
        ]
    }
];

/* 3. 创建 router 实例 */
const router = new Router({
    /* 4. 传 `routes` 配置，这里是缩写，相当于 routes: routes */
    //mode:'history',
    routes
});
/* 5. 暴露出该文件 */
export default router;