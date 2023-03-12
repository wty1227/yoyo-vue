import { createWebHistory, createRouter } from 'vue-router'
import {Layout} from "@/layout";

/* Layout */

export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue'),
        hidden: true
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
        hidden: true
    },
    {
        path: '/test',
        component: () => import('@/views/error/test.vue'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index.vue'),
                name: 'Index',
                meta: { title: '首页', icon: 'dashboard', affix: true }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile',
                component: () => import('@/views/system/user/profile/index.vue'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user' }
            }
        ]
    },
    {
        path: '/flowable',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'definition/model/',
                component: () => import('@/views/flowable/definition/model.vue'),
                name: 'Model',
                meta: { title: '流程设计', icon: '' }
            }
        ]
    },
    {
        path: '/flowable',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'task/finished/detail/index',
                component: () => import('@/views/flowable/task/finished/detail/index.vue'),
                name: 'FinishedRecord',
                meta: { title: '流程详情', icon: '' }
            }
        ]
    },
    {
        path: '/flowable',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'task/myProcess/detail/index',
                component: () => import('@/views/flowable/task/myProcess/detail/index.vue'),
                name: 'MyProcessRecord',
                meta: { title: '流程详情', icon: '' }
            }
        ]
    },
    {
        path: '/flowable',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'task/myProcess/send/index',
                component: () => import('@/views/flowable/task/myProcess/send/index.vue'),
                name: 'SendRecord',
                meta: { title: '流程发起', icon: '' }
            }
        ]
    },
    {
        path: '/flowable',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'task/todo/detail/index',
                component: () => import('@/views/flowable/task/todo/detail/index.vue'),
                name: 'TodoRecord',
                meta: { title: '流程处理', icon: '' }
            }
        ]
    },
    {
        path: '/tool',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'build/index',
                component: () => import('@/views/tool/build/index.vue'),
                name: 'FormBuild',
                meta: { title: '表单配置', icon: '' }
            }
        ]
    },
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole.vue'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/system/user' }
            }
        ]
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:role:edit'],
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser.vue'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/system/role' }
            }
        ]
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        permissions: ['system:dict:list'],
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data.vue'),
                name: 'Data',
                meta: { title: '字典数据', activeMenu: '/system/dict' }
            }
        ]
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        permissions: ['monitor:job:list'],
        children: [
            {
                path: 'index/:jobId(\\d+)',
                component: () => import('@/views/monitor/job/log.vue'),
                name: 'JobLog',
                meta: { title: '调度日志', activeMenu: '/monitor/job' }
            }
        ]
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        permissions: ['tool:gen:edit'],
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable.vue'),
                name: 'GenEdit',
                meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
});

export default router;
