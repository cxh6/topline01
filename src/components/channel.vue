<template>
  <!--
    clearable：可以清除选中的项目
    label  设置每个项目对外提示的名称
    value 设置每个项目真实起作用的value值
  -->
  <el-select v-model="nowid" placeholder="请选择" clearable>
    <el-option
      v-for=" item in channelList "
      :key=" item.id "
      :label=" item.name "
      :value=" item.id "
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'Channel',
  props: {
    // 参数名称:{ 成员属性 } // 成员属性可以修饰被传递过来的参数信息
    // 成员属性：
    // - type类型限制Strirng/Array/Boolean/Object等
    // - default设置默认值
    chid: {
      default: ''
    }
  },
  watch: {
    // ------监听父组件是否有传递chid信息过来，有的话，就接收赋予给chid，使得频道有默认显示项目
    chid (newV, oldV) {
      // newV:id变化之后的
      // 把变化之后的id给到nowid上
      this.nowid = newV
    },
    // ------把变化后的nowid传递给父组件
    nowid (newV) {
      this.$emit('slt', newV)
    }
  },
  data () {
    return {
      nowid: '', // 频道下拉列表双向绑定的id
      channelList: [] // 频道列表
    }
  },
  created () {
    // 获得频道信息
    this.getChannelList()
  },
  methods: {
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
