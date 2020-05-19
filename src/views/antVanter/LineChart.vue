<template>
  <div id="LineChart">
    <div :id="id"></div>
  </div>
</template>

<script>
import Vue from "vue";
const G2 = require("@antv/g2"); // 1. 引入g2plot
Vue.prototype.$G2 = G2; // 2. 将g2plot挂载到vue中
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
export default {
  data() {
    return {
      chart: null,
      newlist: this.arrlist,
      id: Math.random()
        .toString(36)
        .substr(2) //动态生成ID,便于多次引用
    };
  },
  props: ["arrlist"],
  components: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.initComponent();
    console.log(this.arrlist, 8888);
  },
  // 方法集合
  methods: {
    initComponent() {
      console.log(this.$el.clientWidth);
      const elWidthValue = this.$el.clientWidth;
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const chart = new G2.Chart({
        container: this.id,
        width: elWidthValue,
        autoFit: false,
        height: 500
      });
      const defs = {
        x: {
          type: "time", // 指定 cat 分类类型
          values: [
            "0-1",
            "1-2",
            "2-3",
            "3-4",
            "4-5",
            "5-6",
            "6-7",
            "7-8",
            "8-9",
            "9-10",
            "10-11",
            "11-12",
            "12-13",
            "13-14",
            "14-15",
            "15-16",
            "16-17",
            "17-18",
            "18-19",
            "19-20",
            "20-21",
            "21-22",
            "22-23",
            "23-24"
          ]
        }
      };

      chart.source(this.newlist, defs);

      //   chart.scale("year", {
      //     range: [0.25, 0.75] //改变x轴两边的留白

      //   });
      chart.scale("number", {
        //改变y轴的最小最大及间隔+1
        min: 0,
        max: 10,
        tickInterval: 1
      });

      chart
        .line()
        .position("time*number")
        .color("name")
        .shape("smooth")
        .label("number"); //坐标轴上显示数字

      this.chart = chart;
      this.chart.render();
    }
  }
};
</script>

<style>
#c1 {
  margin: 20px auto;
  width: 100%;
  position: relative;
}
</style>