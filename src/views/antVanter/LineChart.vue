<template>
  <div id="LineChart">
    <div id="c1"></div>
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
      newlist: this.arrlist
    };
  },
  props: ["arrlist"],
  components: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.initComponent();
    console.log(this.arrlist);
  },
  // 方法集合
  methods: {
    initComponent() {
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const chart = new G2.Chart({
        container: "c1",
        width: 600,
        autoFit: false,
        height: 500
      });
      chart.source(this.newlist);

      chart
        .line()
        .position("time*number")
        .color("name");

      this.chart = chart;
      this.chart.render();
    }
  }
};
</script>

<style>
#c1 {
  margin: 20px auto;
  width: 600px;
  position: relative;
}
</style>