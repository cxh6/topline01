<template>
  <div>
    <!-- 搜索卡片区域 -->
    <el-card class="box-card">
      <!-- 命名插槽，头部内容 -->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!-- 匿名插槽，内容主体 -->
      <div class="text item" style="padding-left:20px;">
        <!-- el-form搜索表单区域 -->
        <el-form ref="searchFormRfe" :model="searchForm" label-width="100x">
          <el-form-item label="文章状态："></el-form-item>
          <el-form-item label="频道列表："></el-form-item>
          <el-form-item label="时间选择："></el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'articleList',
  data () {
    return {
      // 搜索表单数据对象
      searchForm: {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
