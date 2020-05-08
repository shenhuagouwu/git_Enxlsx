import Vue from 'vue';
import Router from 'vue-router';
/* 1. 定义路由组件 */
Vue.use(Router);

/* 2. 定义路由 */
const routes = [
    {
        path:'/',
        component: () => import('@/views/index/index'),
        name: 'indexPage',
        children: [
            {
                path: '/',
                component: () => import('@/views/pages/Product'),
                name: 'Product'
            },
            {
                path: '/Product',
                component: () => import('@/views/pages/Product'),
                name: 'Product'
            },
            {
                path: '/News',
                component: () => import('@/views/pages/News'),
                name: 'News'
            },
            {
                path: '/wenda',
                component: () => import('@/views/pages/Wenda'),
                name: 'wenda'
            },
            {
                path: '/Video',
                component: () => import('@/views/pages/Video'),
                name: 'Video'
            }
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