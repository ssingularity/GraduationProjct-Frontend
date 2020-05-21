import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/login';
import Layout from '@/layout';

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Home'),
        name: 'dashboard',
        meta: { title: '资源概览', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/datasource',
    component: Layout,
    name: 'datasource',
    meta: {
      title: '数据源管理',
      icon: 'datasource'
    },
    children: [
      {
        path: 'register',
        component: () => import('@/views/datasource/DataSourceRegister'),
        name: 'datasourceRegister',
        meta: { title: '数据源注册'}
      },
      {
        path: 'list',
        component: () => import('@/views/datasource/DataSourceList'),
        name: 'datasourceList',
        meta: { title: '数据源发现'}
      },
      {
        path: 'subscribe',
        component: () => import('@/views/datasource/DataSourceSubscription'),
        name: 'datasourceSubscription',
        meta: { title: '数据源订阅'}
      },
    ]
  },
  {
    path: '/service',
    component: Layout,
    name: 'service',
    meta: {
      title: '服务管理',
      icon: 'service'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/service/ServiceCreate'),
        name: 'serviceCreate',
        meta: { title: '服务创建'}
      },
      {
        path: 'list',
        component: () => import('@/views/service/ServiceList'),
        name: 'serviceList',
        meta: { title: '服务列表'}
      },
      {
        path: ':serviceId',
        component: () => import('@/views/service/ServiceDetail'),
        name: 'serviceDetail',
        hidden: true,
        meta: { title: '服务详情', activeMenu: '/service/list'}
      }
    ]
  },
  {
    path: '/process',
    component: Layout,
    name: 'process',
    meta: {
      title: '流程管理',
      icon: 'process'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/process/ProcessCreate'),
        name: 'processCreate',
        meta: { title: '流程创建'}
      },
      {
        path: 'list',
        component: () => import('@/views/process/ProcessList'),
        name: 'processList',
        meta: { title: '流程列表'}
      },
      {
        path: ':processId',
        component: () => import('@/views/process/ProcessDetail'),
        name: 'processDetail',
        hidden: true,
        meta: { title: '流程详情', activeMenu: '/process/list'}
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

export const asyncRoutes = [
];

const router = new VueRouter({
  mode: 'history',
  routes: constantRoutes
});

export default router
