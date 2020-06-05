<template>
  <div class="PieChart">
    <h2>{{msg}}</h2>
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
  props: ["newlist"],
  data() {
    return {
      msg: "来源设备占比分析",
      chart: null, //全局定义chart对象
      arrlist: this.newlist,
      id: Math.random()
        .toString(36)
        .substr(2) //动态生成ID,便于多次引用
    };
  },
  mounted() {
    console.log(this.arrlist);
    this.initComponent();
  },
  watch: {
    newlist: function(val) {
      this.chart.changeData(val);
    }
  },
  methods: {
    initComponent() {
      //new出来一个Chart实例对象
      const chart = new G2.Chart({
        container: this.id,
        autoFit: true,
        height: 500
      });

      chart.coordinate("theta", {
        radius: 0.75
      });

      chart.data(this.arrlist);

      chart.scale("proportion", {
        formatter: val => {
          val = val + "%";
          return val;
        }
      });

      chart.tooltip({
        showTitle: false,
        showMarkers: false
      });

      chart
        .interval()
        .position("proportion")
        .color("device")
        .label("percent", {
          content: data => {
            return `${data.device}: ${data.proportion}%`;
            // return (this.arrlist.device = this.arrlist.proportion * 100);
          }
        })
        .adjust("stack");

      chart.interaction("element-active");

      this.chart = chart;
      this.chart.render();
      //
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
  color: #333;
  text-align: center;
  line-height: 1;
  padding-top: 30px;
}
</style>
