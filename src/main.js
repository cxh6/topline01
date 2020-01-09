import Vue from 'vue'
import App from './App.vue'

import router from './router'
// 引入初始化样式
import '@/assets/css/global.css'
// 引入elementui组件库
import ElementUI from 'element-ui'

// 导入axios相关代码
import '@/utils/ax.js'

Vue.config.productionTip = false
// 注册组件
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
