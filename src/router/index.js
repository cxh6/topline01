import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 创建路由
const routes = [
  { path: '/', redirect: '/welcome' }, // 重定向
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome', // 重定向
    component: () => import('@/views/home'),
    children: [
      // 后台首页
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      // 文章列表
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      // 发布文章
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd') },
      // 修改文章,要带着id传过去
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit') },
      // 账户管理
      { path: '/account', name: 'account', component: () => import('@/views/account') },
      // 素材管理
      { path: '/material', name: 'material', component: () => import('@/views/material') }
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
