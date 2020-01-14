<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <div id="main" ref="main2" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from 'echarts'

export default {
  name: 'Fans',
  mounted () {
    // paintPic需要尽早被调用(以便显示图表效果)，要在mounted中调用(此时页面容器已经编译好并渲染完成了)
    // 绘制图表
    this.paintPic()
  },
  data () {
    return {
      myChart: null // 接收echarts图表对象
    }
  },
  methods: {
    // -------------------绘制图表
    paintPic () {
      // 基于准备好的dom，初始化echarts实例
      // 在Vue中获得页面元素有两种方式：
      // 1. dom方式，例如document.getElementById('main')
      // 2. ref方式，this.$refs.xxx  // el-form ref="loginForm" this.$refs.loginForm.validate()
      //    ref既可以获得组件对象 还可以获得html标签对象(与document.getElementById()表达意思相同)
      // var myChart = echarts.init(document.getElementById('main'))
      let dv = this.$refs.main2
      this.myChart = echarts.init(dv)

      // 饼形图的参数项目
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
          //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            // data: [
            //   { value: 335, name: '直接访问' },
            //   { value: 310, name: '邮件营销' },
            //   { value: 234, name: '联盟广告' },
            //   { value: 135, name: '视频广告' },
            //   { value: 1548, name: '搜索引擎' }
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 绘制图表
      this.myChart.setOption(option)

      // 获取数据对图表进行二次填充
      this.getFansStat()
    },
    // ------------------获得对象的成员名称集合
    getkeys (obj) {
      var keys1 = []
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys1.push(key)
        }
      }
      return keys1
    },
    // -------------------动态获得服务器真实粉丝数据
    async getFansStat () {
      try {
        let res = await this.$http({
          url: '/mp/v1_0/statistics/followers',
          method: 'get'
        })
        //   console.log(res)
        // 把粉丝数据分装成option的样子
        // age:{le18:57,le23:7,....}
        // ----把legend的data数据通过res组织
        let keys = this.getkeys(res.data.data.age)
        // console.log(keys) // ["le18", "le23", "le30", "le40", "le50", "gt50"]
        // ----把series的data数据通过res组织
        let dataObj = []
        let ages = res.data.data.age
        //   console.log(ages) // {le18: 79, le23: 95, le30: 64, le40: 97, le50: 94,…}
        for (var k in ages) {
          // 把成员的k和value获得出来填充到dataObj里面
          // console.log(k) // le18....
          // console.log(ages[k]) // 72....
          dataObj.push({ value: ages[k], name: k })
        }
        //   console.log(dataObj)
        let opt = {
          legend: {
            // data: ['le18', 'le23', 'le30', 'le40', 'le50']
            data: keys
          },
          series: [
            {
              // {le18: 79, le23: 95, le30: 64, le40: 97,...}
              data: dataObj
            }
          ]
        }
        //   echarts图表对象调用setOption()
        this.myChart.setOption(opt)
      } catch (err) {
        return this.$message.error('获得粉丝统计数据失败：' + err)
      }
      // this.$http({
      //   url: '/mp/v1_0/statistics/followers',
      //   method: 'get'
      // })
      //   .then(res => {
      //     //   console.log(res)
      //     // 把粉丝数据分装成option的样子
      //     // age:{le18:57,le23:7,....}
      //     // ----把legend的data数据通过res组织
      //     let keys = this.getkeys(res.data.data.age)
      //     // console.log(keys) // ["le18", "le23", "le30", "le40", "le50", "gt50"]
      //     // ----把series的data数据通过res组织
      //     let dataObj = []
      //     let ages = res.data.data.age
      //     //   console.log(ages) // {le18: 79, le23: 95, le30: 64, le40: 97, le50: 94,…}
      //     for (var k in ages) {
      //       // 把成员的k和value获得出来填充到dataObj里面
      //       // console.log(k) // le18....
      //       // console.log(ages[k]) // 72....
      //       dataObj.push({ value: ages[k], name: k })
      //     }
      //     //   console.log(dataObj)
      //     let opt = {
      //       legend: {
      //         // data: ['le18', 'le23', 'le30', 'le40', 'le50']
      //         data: keys
      //       },
      //       series: [
      //         {
      //           // {le18: 79, le23: 95, le30: 64, le40: 97,...}
      //           data: dataObj
      //         }
      //       ]
      //     }
      //     //   echarts图表对象调用setOption()
      //     this.myChart.setOption(opt)
      //   })
      //   .catch(err => {
      //     // console.log(err)
      //     return this.$message.error('获得粉丝统计数据失败：' + err)
      //   })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
