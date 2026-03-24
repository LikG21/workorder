import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')

  if (to.meta.requiresAuth && !userInfo) {
    // 需要登录但用户未登录
    message.warning('请先登录')
    next('/login')
  } else if (to.path === '/login' && userInfo) {
    // 已登录用户访问登录页，跳转到主页
    next('/home')
  } else {
    next()
  }
})

export default router