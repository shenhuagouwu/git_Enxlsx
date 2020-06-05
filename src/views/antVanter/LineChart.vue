<!--
 * @Author: your name
 * @Date: 2020-05-14 16:27:38
 * @LastEditTime: 2020-05-19 10:27:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \git_Enxlsx\src\views\antVanter\LineChart.vue
--> 
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
  },
  watch: {
    arrlist: function(val) {
      this.chart.changeData(val);
    }
  },
  // 方法集合
  methods: {
    initComponent() {
      const elWidthValue = this.$el.clientWidth;
      const elHeightValue = this.$el.clientHeight;
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const chart = new G2.Chart({
        container: this.id,
        width: elWidthValue,
        autoFit: false,
        height: elHeightValue
      });
      chart.source(this.newlist);
      chart.scale("number", {
        min: 0,
        tickInterval: 1
      });
      chart.tooltip({
        showMarkers: true, // 展示 tooltip markers
        shared: true,
        showCrosshairs: true
      });
      chart
        .line()
        .position("time*number")
        .color("name")
        .shape("smooth");
      this.chart = chart;
      this.chart.render();
    }
  }
};
</script>

<style  scoped>
#c1 {
  margin: 20px auto;
  width: 100%;
  position: relative;
}
</style>