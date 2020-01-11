// 独立文件，用于存储axios相关代码

// 引入axios模块
import axios from 'axios'
// 导入vue模块
import Vue from 'vue'
import router from '@/router'
// 引入json-bigint
import JSONbig from 'json-bigint'

// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
// 将axios配置成vue的成员
Vue.prototype.$http = axios

// --------配置**请求**拦截器，来处理token传递操作
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config 与 axios.defaults 相当
  // console.log(config)
  // console.log(axios.defaults)
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token是否存在，存在再做配置
  if (userinfo) {
    // console.log(userinfo)
    // 获得token
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// ---------配置**响应**拦截器，来处理服务器端token过期操作
// token时效为2小时
axios.interceptors.response.use(function (response) {
  // 响应的相关逻辑
  return response
}, function (error) {
  // 非正常响应相关逻辑(包括401)
  // console.dir(error)
  // 判断当前错误是不是401
  if (error.response.status === 401 && confirm('该账号已过期，请重新登录')) {
    // 强制用户重新登陆，从而重新刷新token
    router.push('/login')
    // 不要做错误提示
    return new Promise(function () { }) // 空的promise对象，不执行catch，从而不做错误提示
  }
  return Promise.reject(error)
})

// 对服务器端返回来的数据信息做处理(尤其是大数字的处理)
// axios配置"数据转换器"
axios.defaults.transformResponse = [function (data) {
  // 服务器端返回给客户端的data数据主要就两种类型
  // 1) 字符串对象  '{xx:xx...}'
  // 2) 空字符串   ''
  // 在此处要利用JSONbig对返回的信息加以处理，如果不处理，系统默认是通过JSON.parse()给处理的
  // 这样大数字就错误了
  if (data) {
    return JSONbig.parse(data)
  }
  return data
}]
