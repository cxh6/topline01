import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 创建路由
const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome', // 重定向
    component: () => import('@/views/home'),
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 配置全局路由守卫（强制登录）
router.beforeEach((to, from, next) => {
// 获取当前用户登录状态
  if (!window.sessionStorage.getItem('userinfo') && to.path !== '/login') {
    return next('/login')
  }
  // 放行
  next()
})
export default router
