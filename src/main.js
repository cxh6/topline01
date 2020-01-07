import Vue from 'vue'
import App from './App.vue'

import router from './router'
// 引入初始化样式
import '@/assets/css/global.css'
// 引入elementui组件库
import ElementUI from 'element-ui'
// 引入axios模块
import axios from 'axios'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
// 将axios配置成vue的成员
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册组件
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
