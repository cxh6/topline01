import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入nprogress相关的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
      { path: '/material', name: 'material', component: () => import('@/views/material') },
      // 粉丝管理
      { path: '/fans', name: 'fans', component: () => import('@/views/fans') }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 配置全局路由守卫（强制登录）
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.inc()
  // 获取当前用户登录状态
  if (!window.sessionStorage.getItem('userinfo') && to.path !== '/login') {
    return next('/login')
  }
  // 放行
  next()
})

// 后置守卫
router.afterEach((to, from) => {
  // 完成进度条显示了
  NProgress.done()
})
export default router
