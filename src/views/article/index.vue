<template>
  <div>
    <!-- 搜索卡片区域 -->
    <el-card class="box-card">
      <!-- 命名插槽，头部内容 -->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
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
              <el-option
                v-for=" item in channelList "
                :key=" item.id "
                :label=" item.name "
                :value=" item.id "
              ></el-option>
              <!-- <el-option label="css3" value="102"></el-option>
              <el-option label="JS高级" value="103"></el-option>-->
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
    <!-- 文章列表区域 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <span>共找到{{ tot }}条符合条件的内容</span>
      </div>

      <!-- 文章表格 -->
      <el-table :data="articleList" style="width: 100%">
        <!-- 图标显示 -->
        <el-table-column prop="cover.images[0]" label="图标">
          <img
            :src="stData.row.cover.images[0]"
            slot-scope="stData"
            alt="没有图标"
            width="150"
            height="100"
          />
        </el-table-column>
        <!-- 标题 -->
        <el-table-column prop="title" label="标题"></el-table-column>
        <!-- 状态 -->
        <el-table-column prop="status" label="状态">
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  // 设置监听器,值发生变化后做相关处理
  watch: {
    // ------对searchForm做深度监听
    searchForm: {
      handler: function (newV, oldV) {
        // 根据变化后的各个筛选条件，重新获取文章列表
        this.getArticleList()
      },
      deep: true
    },
    // ------监听时间范围
    timetotime: function (newV, oldV) {
      // newV:数据变化后样子
      // oldV:数据变化前样子
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        // console.log(newV)
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  data () {
    return {
      tot: 0, // 文章总条数
      articleList: [], // 文章列表
      channelList: [], // 频道
      timetotime: [], // 临时接收时间范围信息
      // 搜索表单数据对象
      searchForm: {
        page: 1, // 当前数据记录页码
        per_page: 10, // 分页数据记录条数
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        status: '', // 文章状态： ""-全部，0-草稿，1-待审核，2-审核通过，3-审核失败
        channel_id: '' // 频道id
      }
    }
  },
  // 声明周期
  created () {
    // 获得频道信息
    this.getChannelList()
    // 获得文章列表
    this.getArticleList()
  },
  methods: {
    // --------分页相关
    // 每页显示条数变化的回调处理
    handleSizeChange (val) {
      // val：变化后的每页条数
      // 更新每页条数
      this.searchForm.per_page = val
    },
    // 页码变化的回调处理
    handleCurrentChange (val) {
      // val：变化后的页码数
      // 更新页码
      this.searchForm.page = val
    },
    // ---------获得真实频道列表数据
    getChannelList () {
      this.$http({
        method: 'GET',
        url: '/mp/v1_0/channels'
      })
        .then(res => {
          // console.log(res)
          // data接收频道数据
          this.channelList = res.data.data.channels
        })
        .catch(err => {
          // console.log(err)
          return this.$message.error('获得频道失败' + err)
        })
    },
    // ---------获得真实文章列表数据
    getArticleList () {
      // 给获得文章的方法getArticleList()增加文章检索条件参数，并对空的条件做**过滤**
      // 把searchForm内部为空的成员都过滤掉
      let searchData = {} // 存放searchForm中不为空的成员
      for (var i in this.searchForm) {
        // console.log(i) // begin_pubdate、end_pubdate、 status、 channel_id等
        // 判断哪些成员不为空
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员非空，把非空成员放入searchData中
          searchData[i] = this.searchForm[i]
        }
      }
      // axios请求文章列表
      this.$http({
        method: 'GET',
        url: '/mp/v1_0/articles',
        params: searchData
      })
        .then(res => {
          // console.log(res)
          // data接收文章列表数据
          this.articleList = res.data.data.results
          // 获取文章总条数
          this.tot = res.data.data.total_count
        })
        .catch(err => {
          // console.log(err)
          return this.$message.error('获得文章列表失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
