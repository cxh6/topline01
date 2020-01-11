<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账号信息</span>
    </div>
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model=" accountForm "
          :rules=" accountFormRules "
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click=" editAccount() ">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">头像展示区域</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      },
      // 校验
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          { min: 1, max: 7, message: '名字长度介于1-7个字符之间' } // 后端要求title长度介于1-7个字符
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确,正确格式：123@qq.com' }
        ]
      }
    }
  },
  created () {
    // 获取用户账号信息
    this.getAccountInfo()
  },
  methods: {
    // ------、修改用户账号信息
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        // axios带着更新好的账户信息请求服务器端存储
        // get(获取)/post(添加)/put(修改)/delete(删除)
        // patch(修改)
        // put: 对“全部”表单域项目进行修改
        // patch: 对“部分”表单域项目进行修改
        // get“请求字符串”参数通过params传递，params设置参数会在url地址中体现 ?x=y&x=y....
        // 其他请求方式传递的参数都是data(浏览器地址栏看不见该参数)
        this.$http({
          method: 'patch',
          url: '/mp/v1_0/user/profile',
          data: this.accountForm
        })
          .then(res => {
            // console.log(res)
            // 成功提示
            this.$message.success('更新账户信息成功！')
          })
          .catch(() => {
            // console.log(err)
            return this.$message.error('更新账户信息失败！')
          })
      })
    },
    // ------获取用户账号信息
    getAccountInfo () {
      this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'get'
      })
        .then(res => {
          // console.log(res)
          // 将获得好的账户信息给到accountForm上
          this.accountForm = res.data.data
        })
        .catch(() => {
          // console.log(err)
          return this.$message.error('获取账户信息失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 40%;
    background-color: pink;
  }
  .rt {
    width: 30%;
    background-color: pink;
  }
}
</style>
