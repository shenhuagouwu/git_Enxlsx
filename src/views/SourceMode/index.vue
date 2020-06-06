<template>
  <div class="list">
    <div class="chart-one">
      <h2>来源设备来源占比图表</h2>
      <pie-chart :newlist="newlist" v-if="newlist.length>0"></pie-chart>
    </div>
    <div class="chart-two">
      <h2>每个设备每日询盘对比</h2>
      <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0" style="height:300px"></ant-vanter>
    </div>
  </div>
</template>

<script>
import PieChart from "../antVanter/PieChart";
import antVanter from "../antVanter/LineChart";

export default {
  props: ["filebox"],
  data() {
    return {
      newlist: [], //饼图需要传过去的数据
      arrlist: [] //折线图需要传过去的数据
    };
  },
  components: {
    PieChart,
    antVanter
  },
  beforeMount() {
    var $this = this;
    if ($this.filebox.rowData != "" || $this.filebox.rowData.length > 0) {
      $this.innerPieChart($this.filebox);
      $this.linearChart($this.filebox);
    }
  },
  watch: {
    filebox: function(val) {
      console.log(val, "val");
      if (val.rowData != "" || val.rowData.length > 0) {
        this.innerPieChart(val);
        this.linearChart(val);
      }
    }
  },
  methods: {
    innerPieChart(dataBox) {
      var quantity = dataBox.rowData.length;
      console.log(dataBox);
      var dataobj = dataBox.rowData; //原始对象
      var arrlist = [];
      dataobj.forEach(function(item, index) {
        var maparr = {};
        maparr.device = item.device;
        maparr.number = 0;
        maparr.proportion = 0;
        arrlist.push(maparr);
      });
      //console.log(arrlist);
      //   得出设备和数量;
      var objItem = {},
        newAry = [];
      for (var i = 0; i < arrlist.length; i++) {
        if (!objItem[arrlist[i].device]) {
          newAry.push(arrlist[i]);
          objItem[arrlist[i].device] = true;
        }
      }
      // console.log(newAry);去重后的数据
      //把新的数组与之前的数组进行对比如果相同就让number++
      arrlist.map(function(item, index) {
        newAry.map(function(item1, index1) {
          if (item.device == item1.device) {
            item1.number++;
          }
        });
      });
      //console.log(newAry); //去重后的数据
      var _this = this;
      newAry.map(function(item) {
        item.proportion = _this.multiple(
          _this.divide(item.number, quantity),
          100
        );
      });
      this.newlist = newAry;
      console.log(this.newlist);
    }, //innerPieChart结束
    multiple(a, b) {
      var c = 0,
        d = a.toString(),
        e = b.toString();
      try {
        c += d.split(".")[1].length;
      } catch (f) {}
      try {
        c += e.split(".")[1].length;
      } catch (f) {}
      return (
        (Number(d.replace(".", "")) * Number(e.replace(".", ""))) /
        Math.pow(10, c)
      );
    },
    divide(arg1, arg2) {
      var d1,
        d2,
        n1 = Number(arg1.toString().replace(".", "")),
        n2 = Number(arg2.toString().replace(".", ""));
      try {
        d1 = arg1.toString().split(".")[1].length;
      } catch (e) {
        d1 = 0;
      }
      try {
        d2 = arg2.toString().split(".")[1].length;
      } catch (e) {
        d2 = 0;
      }
      return this.toFixed((n1 / n2) * Math.pow(10, d2 - d1), 4);
    },
    toFixed(arg, n) {
      if (n == 0) {
        return Math.round(arg);
      }
      try {
        var d,
          carryD,
          i,
          ds = arg.toString().split("."),
          len = ds[1].length,
          b0 = "",
          k = 0;
        if (len > n) {
          while (k < n && ds[1].substring(0, ++k) == "0") {
            b0 += "0";
          }
          d = Number(ds[1].substring(0, n));
          carryD = Math.round(Number("0." + ds[1].substring(n, len)));
          len = (d + carryD).toString().length;
          if (len > n) {
            return Number(ds[0]) + 1;
          } else if (len == n) {
            return Number(ds[0] + "." + (d + carryD));
          }
          return Number(ds[0] + "." + b0 + (d + carryD));
        }
      } catch (e) {}
      return arg;
    },
    //changTwoDecimal结束
    linearChart(dataBox) {
      var dataobj = dataBox.rowData; //原始对象
      var datalist = [];
      dataobj.forEach(function(item, index) {
        var maparr = {};
        maparr.device = item.device;
        maparr.number = 0;
        maparr.time = item.datetime.substring(0, 10); //字符串截取把后面的时间去掉只留下日期
        datalist.push(maparr);
      });

      //数组去重然后放在一个新的数组里面
      var hash = {};
      var haslist = [];
      haslist = datalist.reduce(function(item, next) {
        const key = `${next.device}${next.time}`;
        hash[key] ? "" : (hash[key] = true && item.push(next));
        return item;
      }, []);
      //把新的数组与之前的数组进行对比如果相同就让number++最后得出设备和数量时间段
      datalist.map(function(item, index) {
        haslist.map(function(item1, index1) {
          if (item.device == item1.device && item.time == item1.time) {
            item1.number++;
          }
        });
      });

      //   console.log(haslist); //得出设备和数量时间段
      var stillist = [];
      //去除多余的属性得出最终的想要的
      haslist.forEach(function(item) {
        var arrTimes = {};
        arrTimes.name = item.device;
        arrTimes.time = item.time;
        arrTimes.number = item.number;
        stillist.push(arrTimes);
      });

      this.arrlist = this.sortlist(
        stillist,
        this.screenlist(stillist),
        dataBox.timeDate
      );
    },

    // 排序列表并补齐缺失数据
    sortlist: function(element, list, timeList) {
      var typeList = timeList;
      var brandList = list;
      var brandData = [];
      brandList.forEach(function(item) {
        var itemArray = [];
        element.forEach(function(items) {
          if (item == items.name) {
            itemArray.push(items);
          }
        });
        brandData.push(itemArray);
      });
      var sortList = [];
      brandData.forEach(function(items) {
        typeList.forEach(function(item) {
          var itemData = {};
          itemData.time = item;
          var itemTime = items.find(function(e) {
            return e.time == item;
          });
          if (itemTime) {
            itemData.number = itemTime.number;
            itemData.name = itemTime.name;
          } else {
            itemData.number = 0;
            itemData.name = items[0].name;
          }
          sortList.push(itemData);
        });
      });
      return sortList;
    }, //排序列表并补齐缺失数据結束
    // 获取图表中的线条所属名称列表
    screenlist: function(element) {
      var result = [];
      for (let index = 0; index < element.length; index++) {
        if (result.indexOf(element[index].name) == -1) {
          result.push(element[index].name);
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
.list h2 {
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 24px;
  text-align: center;
  margin: 20px 0;
  color: #555;
}

.list .chart-one {
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-top: 30px;
  padding: 30px;
}
.list .chart-two {
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-top: 30px;
  padding: 30px;
  box-sizing: border-box;
}
</style>
