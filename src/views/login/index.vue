<template>
  <div class="login_container">
    <div class="login_box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index1.png" alt />
        <el-form-item prop="mobile">
          <!-- 手机号 -->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号">
            <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <!-- 验证码 -->
          <el-input v-model="loginForm.code" placeholder="请输入验证码">
            <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:left;" prop="xieyi">
          <!-- 协议 -->
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>

        <el-form-item>
          <!-- 登录 -->
          <el-button type="primary" style="width:100%;" @click=" login() " :disabled=" isLoading " :loading=" isLoading ">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入gt.js文件
import './gt.js'
// 引入iconfont图片文件
import '@/assets/iconfont/iconfont.css'
export default {
  name: 'Login',
  data () {
    // 给xieyi这个项目声明方法（校验方法需要写在return前面！）
    let xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      loginForm: {
        mobile: '18463848817',
        code: '246810',
        xieyi: false // 复选框是否选中
      },
      isLoading: false, // 登录按钮是否为禁用、等待状态（false表明当前按钮不是禁用、等待状态）
      capObj: null, // 极验对象
      // 校验
      loginFormRules: {
        // -----表单校验规则（自然方式）
        // 手机校验规则
        mobile: [
          { required: true, message: '手机号必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号格式不正确' }
        ],
        // 验证码验规则
        code: [{ required: true, message: '验证码必填' }],
        // -----协议 校验(自定义)
        xieyi: [
          // 自定义校验规则使用validator关联
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    // 登录方式进行表单校验
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // valid为true时，校验通过，
        // valid为false时，校验失败，
        if (!valid) {
          return false
        }
        // 判断极验窗口是否存在，存在就直接使用
        if (this.capObj !== null) {
          return this.capObj.verify() // 激活窗口显示
        }
        // 设置登录按钮为禁用、等待状态
        this.isLoading = true
        // 极验（人机交互验证）
        this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'GET'
        })
          .then(res => {
            // 对象解构赋值
            let { data } = res.data
            // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
            window.initGeetest(
              {
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 设置极验窗口样式
              },
              // ***captchaObj 就是极验对象***
              captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj
                  .onReady(() => {
                    // 验证码ready之后才能调用verify方法显示验证码
                    captchaObj.verify() // 显示验证码窗口

                    // 在显示极验窗口之后，将登录按钮状态激活
                    this.isLoading = false

                    // 第一次生成的人机窗口对象 赋予给 this.ctpObj= captchaObj
                    this.capObj = captchaObj
                  })
                  .onSuccess(() => {
                    // 验证账号，登录系统
                    this.loginAct()
                  })
                  .onError(() => {})
              }
            )
          })
          .catch(err => {
            return this.$message.error('获取极验秘钥失败：' + err)
          })
      })
    },
    loginAct () {
      // 服务器端账号真实校验
      this.$http({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data: this.loginForm
      })
        .then(res => {
          // console.log(res)
          // 客户端浏览器把服务端返回的秘钥等相关信息通过sessionStorage做记录，表明是登录状态
          window.sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))

          // 进入后台系统
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          // console.log(err)
          this.$message.error('手机号或验证码错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 470px;
    height: 340px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
      text-align: center;
      img {
        width: 55%;
        margin: 20px auto;
      }
    }
  }
}
</style>
