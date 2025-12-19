import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'emails',
        name: 'EmailManage',
        component: () => import('@/views/EmailManage.vue')
      },
      {
        path: 'threats',
        name: 'ThreatDetection',
        component: () => import('@/views/ThreatDetection.vue')
      },
      {
        path: 'vector',
        name: 'VectorSearch',
        component: () => import('@/views/VectorSearch.vue')
      },
      {
        path: 'ai',
        name: 'AIAnalysis',
        component: () => import('@/views/AIAnalysis.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports.vue')
      },
      // 关键：添加系统设置路由到 children 数组中
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue') // 懒加载方式，和其他路由保持一致
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router