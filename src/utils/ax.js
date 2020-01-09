// 独立文件，用于存储axios相关代码

// 引入axios模块
import axios from 'axios'
// 导入vue模块
import Vue from 'vue'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
// 将axios配置成vue的成员
Vue.prototype.$http = axios

// 配置**请求**拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config 与 axios.defaults 相当
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token是否存在，存在再做配置
  if (userinfo) {
    // 获得token
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
