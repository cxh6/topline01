<template>
  <el-card class="box-card">
    <!-- 头部 -->
    <div slot="header" class="clearfix">
      <span>发布文章</span>
    </div>
    <!-- form表单 -->
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input placeholder="文章名称" v-model="addForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <quill-editor v-model="addForm.content"></quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="addForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <!-- 封面---图片选择区域 -->
        <ul>
          <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog()">
            <span>点击图标选择图片</span>
            <div class="el-icon-picture-outline"></div>
          </li>
        </ul>
      </el-form-item>
      <!-- 频道 -->
      <el-form-item label="频道" prop="channel_id">
        <!-- 使用频道子组件,给频道子组件声明一个事件 -->
        <channel @slt=" selectHandler "></channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click=" addArticle(false) ">发布</el-button>
        <el-button @click=" addArticle(true) ">存入草稿</el-button>
      </el-form-item>
    </el-form>
    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <!-- 标签切换效果 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane class="one" label="素材库" name="first">
          <!-- 素材图片列表展示 -->
          <ul>
            <li class="image-box" v-for="item in imageList" :key="item.id">
              <img :src="item.url" alt="没有图片" @click=" clickImg " />
            </li>
          </ul>
          <!-- 分页相关 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querycdt.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="querycdt.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tot"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane class="two" label="上传图片" name="second">
          <div class="upLImg">
            <img :src=" imgSrc " alt width="450" height="260" />
             <i class="el-icon-picture-outline"></i>
          </div>
          <el-upload
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="setToken"
            name="image"
            :on-success=" onSuccess "
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传图片</el-button>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入频道子组件
import Channel from '@/components/channel.vue'

// 导入富文本编辑器组件模块
import { quillEditor } from 'vue-quill-editor'

// 导入富文本编辑器css样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'ArticleAdd',
  // 注册富文本编辑器组件
  components: {
    quillEditor,
    Channel
  },
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    },
    // --------设计当前图片"选择框"个数
    covernum () {
      // 设计选择框显示个数
      // type>0  ========= type值
      // type<=0 ========== 0 值
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      imgSrc: '', // 上传图片
      tot: 0, // 素材图片总数
      activeName: 'first', // 默认激活标签
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 10
      },
      dialogVisible: false, // 对话框是否显示
      // 添加文章数据表单对象
      addForm: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: ''
      },
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          { min: 5, max: 30, message: '标题介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      }
    }
  },
  created () {
    // 获取图片素材列表
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
    // // 图片上传成功之后的回调处理
    onSuccess: function (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      // 提示信息
      this.$message.success('上传图片成功')
      // 将图片给到imgSrc
      this.imgSrc = response.data.url
      // 刷新图片素材列表
      this.getImageList()
    },
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
    // --------给当前选中的素材图片设置高亮效果
    clickImg (evt) {
      // console.log(evt) // MouseEvent鼠标事件
      // 清除全部li的border样式
      let lis = document.querySelectorAll('li')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // 获取当前选中的素材图片,找到父元素li，给li添加border
      // evt.target:会获得触发事件的当前元素dom对象
      let nowli = evt.target.parentNode
      nowli.style.border = '5px solid red'
    },
    // --------获取素材图片列表
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
          // 图片总数
          this.tot = res.data.data.total_count
        })
        .catch(() => {
          // console.log(err)
          return this.$message.error('获取素材失败')
        })
    },
    // -------展示对话框逻辑
    showDialog () {
      this.dialogVisible = true // 打开dialog对话框
    },

    // ---------声明事件方法，用于接收子组件channel传递过来的频道id
    selectHandler (id) {
      this.addForm.channel_id = id
    },
    // ---------发布文章
    addArticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        // axios真实表单校验
        this.$http({
          method: 'POST',
          url: '/mp/v1_0/articles',
          data: this.addForm, // 表单数据
          params: {
            draft: flag
          } // 请求字符串数据
        })
          .then(res => {
            // console.log(res);
            // 跳转到文章列表页面
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            // console.log(err)
            return this.$message.error('发布文章失败' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tab-pane.one {
  display: flex;
  flex-direction: column;
}
.el-tab-pane.two {
  text-align: center;
  .upLImg {
    margin: 0 auto 15px;
    width: 450px;
    height: 260px;
    border: 1px dashed #ccc;
i{
    font-size: 160px;
    line-height: 260px;
    color: rgb(221, 221, 221);

    text-align: center;
}
  }
  .el-upload {
    height: 50px;
  }
}

// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 140px;
  height: 100px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}

// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}

/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
