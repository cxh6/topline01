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
      </el-form-item>
      <el-form-item label="频道" prop="channel_id">
        <!-- 使用频道子组件,给频道子组件声明一个事件 -->
        <channel @slt=" selectHandler "></channel>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click=" addArticle(false) ">发布</el-button>
        <el-button @click=" addArticle(true) ">存入草稿</el-button>
      </el-form-item>
    </el-form>
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
  data () {
    return {
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
  methods: {
    // 声明事件方法，用于接收子组件channel传递过来的频道id
    selectHandler (id) {
      this.addForm.channel_id = id
    },
    // 发布文章
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
/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
