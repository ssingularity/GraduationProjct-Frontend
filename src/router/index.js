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
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/About'),
        name: 'about',
        meta: { title: 'about', icon: 'star', affix: false }
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
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: constantRoutes
});

export default router
