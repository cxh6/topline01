<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>
        <!--
        默认上传动作
        1. action设置地址
        2. 需要传递token信息，通过headers属性设置
        3. 通过name属性设置被上传图片的传递名字,服务器端要求是image
        4. :show-file-list="false" 禁止形成列表效果
        5. on-success 文件上传成功后回调处理
        -->
        <el-upload
          style="float: right; padding: 3px 0"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="setToken"
          name="image"
          :show-file-list="false"
          :on-success="onSuccess"
        >
          <el-button size="small" type="primary">上传图片</el-button>
        </el-upload>
      </div>
      <div class="text item cardBody">
        <ul>
          <li class="image-box" v-for="item in imageList " :key="item.id">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button type="success" icon="el-icon-star-off" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </li>
        </ul>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="querycdt.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
          shadow="never"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Material',
  data () {
    return {
      tot: 0, // 素材图片总数
      imageList: [], // 已有素材列表信息
      // 获得素材图片的条件信息
      querycdt: {
        collect: false,
        page: 1, // 页码，默认1
        per_page: 10 // 每页显示图片数量
      }
    }
  },
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  created () {
    this.getImageList()
  },
  watch: {
    // 对querycdt做深度监听
    querycdt: {
      handler: function (newV, oldV) {
        this.getImageList()
      },
      deep: true
    }
  },
  methods: {
    // ---------分页相关
    // 每页显示图片数量变化的回调处理
    handleSizeChange (val) {
      // console.log(val) // 变化后的每页条数
      // 更新每页条数
      this.querycdt.per_page = val
      // 刷新图片素材列表显示
      // this.getImageList()
    },
    // 页码变化的回调处理
    handleCurrentChange (val) {
      // console.log(val) // 变化后的页码
      // 更新页码
      this.querycdt.page = val
      // 刷新图片素材列表显示
      // this.getImageList()
    },
    // -----上传素材
    onSuccess (response, file, fileList) {
      // 提示信息
      this.$message.success('上传素材图片成功')
      // 刷新图片
      this.getImageList()
    },
    // 获取素材图片列表
    getImageList () {
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
        .then(res => {
          // console.log(res)
          // 把素材信息给到imageList上
          this.imageList = res.data.data.results
          // 获取素材图片总数
          this.tot = res.data.data.total_count
        })
        .catch(() => {
          // console.log(err)
          return this.$message.error('获取素材失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 分页相关样式
.cardBody {
  display: flex;
  flex-direction: column;
  .el-pagination {
    margin-top: 15px;
  }
}

// 素材图片列表样式
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
