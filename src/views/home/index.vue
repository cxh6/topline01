<template>
  <el-container>
    <!-- 左侧-导航栏 -->
    <!--
      isCollapse为true时（折叠），此时宽度为65px
      isCollapse为false时（折叠），此时宽度为200px
    -->
    <el-aside :width=" isCollapse ? '65px' : '200px' ">
      <!-- <el-aside :style="{ width: isCollapse ? '65px' : '200px' }"> -->
      <!--
        :collapse=" isCollapse " 设置折叠、展开效果
        :collapse-transition=" false "  关闭折叠、展开动画
        设置router属性，使得路由导航功能被激活
      -->
      <el-menu
        background-color="#353B4E"
        text-color="#fff"
        active-text-color="#409EFF"
        :collapse=" isCollapse "
        :collapse-transition=" false "
        router
      >
        <!-- 首页 -->
        <el-menu-item index="/welcome" :style="{ width: isCollapse ? '65px' : '200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- 内容管理 -->
        <el-submenu index="2" :style="{ width: isCollapse ? '65px' : '200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <!-- index属性中配置路由地址信息 -->
          <el-menu-item index="/article">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <!-- 粉丝管理 -->
        <el-menu-item index="/fans" :style="{ width: isCollapse ? '65px' : '200px'}">
          <i class="el-icon-document"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <!-- 账户信息 -->
        <el-menu-item index="/account" :style="{ width: isCollapse ? '65px' : '200px'}">
          <i class="el-icon-setting"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 头部-左侧 -->
        <div class="lt">
          <!--
            isCollapse?'el-icon-s-unfold':'el-icon-s-fold':菜单折叠展开，小图标也要做变换显示操作
          -->
          <i
            :class=" isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold' "
            style="cursor:pointer;margin-right:5px;"
            @click=" isCollapse = !isCollapse "
          ></i>
          <span>济南小黑头条号股份有限公司</span>
        </div>
        <!-- 头部-右侧 -->
        <div class="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:210px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src=" photo " width="40" height="40" />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native=" toAccount ">个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <!--
                <组件 @click=" xxx "> : 作用到封装体上
                .native :使得组件的事件直接作用到内部的html标签身上
              -->
              <el-dropdown-item @click.native=" logout() ">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <!-- 给子组件设置占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入bus.js
import bus from '@/utils/bus.js'

export default {
  name: 'Home',
  data () {
    return {
      tmpname: '', // 临时账户名称
      tmpphoto: '', // 临时账户头像
      isCollapse: false // 折叠为true，展开为false
    }
  },
  created () {
    // 1. 对  名称  进行更新
    bus.$on('upAccountName', nm => {
      // 更新sessionStorage中name的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = nm
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpname
      this.tmpname = nm
    })
    // 2. 对  名称  进行更新
    bus.$on('upAccountPhoto', ph => {
      // 更新sessionStorage中photo的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = ph
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpphoto
      this.tmpphoto = ph
    })
  },
  methods: {
    // ------跳转到账户信息
    toAccount () {
      if (window.location.hash === '#/account') {
        return false
      }
      this.$router.push({ name: 'account' })
    },
    // 退出后台系统
    async logout () {
      // 确认是否退出
      try {
        await this.$confirm('确定要退出吗？', '退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 删除用户信息(sessionStorage删除数据)
        window.sessionStorage.clear()
        // 跳转到登录页面
        this.$router.push({ name: 'login' })
      } catch (err) {

      }

      // this.$confirm('确定要退出吗？', '退出', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     // 删除用户信息(sessionStorage删除数据)
      //     window.sessionStorage.clear()
      //     // 跳转到登录页面
      //     this.$router.push({ name: 'login' })
      //   })
      //   .catch(() => {})
    }
  },
  // 计算属性
  computed: {
    name () {
      return (
        this.tmpname ||
        JSON.parse(window.sessionStorage.getItem('userinfo')).name
      )
    },
    photo () {
      return (
        this.tmpphoto ||
        JSON.parse(window.sessionStorage.getItem('userinfo')).photo
      )
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 950px;
    .lt {
      height: 100%;
      width: 40%;
      background-color: #fff;
      display: flex;
      align-items: center;
      font-size: 20px;
    }
    .rt {
      height: 100%;
      width: 60%;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  .el-main {
    min-width: 950px;
    background-color: rgb(240, 240, 240);
  }
}
</style>
