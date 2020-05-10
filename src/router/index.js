import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login';
import Layout from '@/layout'

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home'),
        name: 'home',
        meta: { title: 'Home', icon: 'dashboard', affix: true }
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
