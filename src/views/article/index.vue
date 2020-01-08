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
          <!-- 文章状态 -->
          <el-form-item label="文章状态：">
            <!--
                v-model：双向绑定，获取被选中的项目  或 设置哪个项目选中
                label：用于设置当前单选按钮的value值情况
            -->
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
          </el-form-item>
          <!-- 频道列表 -->
          <el-form-item label="频道列表：">
            <!--
                clearable：可以清除选中的项目
                label  设置每个项目对外提示的名称
                value 设置每个项目真实起作用的value值
            -->
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option label="html5" value="101"></el-option>
              <el-option label="css3" value="102"></el-option>
              <el-option label="JS高级" value="103"></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间选择 -->
          <el-form-item label="时间选择：">
            <div class="block">
              <!--
                  type="daterange" : 类型设置，daterange表示是日期范围选取的
                  value-format  设置接收到时间格式
              -->
              <el-date-picker
                v-model="timetotime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </el-form-item>
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
      timetotime: [], // 临时接收时间范围信息
      // 搜索表单数据对象
      searchForm: {
        status: '', // 文章状态： ""-全部，0-草稿，1-待审核，2-审核通过，3-审核失败
        channel_id: '' // 频道id
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
