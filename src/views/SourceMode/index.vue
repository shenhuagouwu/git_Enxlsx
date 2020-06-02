<template>
  <div class="list">
    <pie-chart :newlist="newlist" v-if="newlist.length>0"></pie-chart>
    <h2>每日询盘统计</h2>
    <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0"></ant-vanter>
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
      this.innerPieChart($this.filebox);
      this.linearChart($this.filebox);
    }
  },
  watch: {
    filebox: function(val) {
      if (val.rowData != "" || val.rowData.length > 0) {
        this.innerPieChart(val);
        this.linearChart(val);
      }
    }
  },
  methods: {
    innerPieChart(dataBox) {
      var quantity = dataBox.rowData.length;
      console.log(dataBox.rowData);
      var dataobj = dataBox.rowData; //原始对象
      var arrlist = [];
      dataobj.forEach(function(item, index) {
        var maparr = {};
        maparr.device = item.device;
        maparr.number = 0;
        maparr.proportion = 0;
        arrlist.push(maparr);
      });
      console.log(arrlist);
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
      console.log(newAry); //去重后的数据
      var _this = this;
      newAry.map(function(item) {
        item.proportion = _this.changTwoDecimal(item.number / quantity);
      });
      this.newlist = newAry;
      console.log(this.newlist);
    }, //innerPieChart结束
    changTwoDecimal: function(item) {
      //把小数去除到小数点后面2位数
      var f_x = parseFloat(item);
      if (isNaN(f_x)) {
        return false;
      }
      f_x = Math.round(f_x * 10000) / 10000;
      return f_x;
    }, //changTwoDecimal结束
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
      // console.log(haslist); //得出设备和数量时间段

      //比较两个时间大小来进行排序
      let soltTime = function(str) {
        return new Date(str.replace(/-/g, "/")).getTime(); //用/替换日期中的-是为了解决Safari的兼容
      };
      for (let i = 0; i < haslist.length; i++) {
        haslist[i].timeNew = soltTime(haslist[i].time);
      }
      haslist.sort(function(a, b) {
        return b.timeNew < a.timeNew ? 1 : -1;
      });
      console.log(haslist); //时间排序后的数组
      var stillist = [];
      //去除多余的属性得出最终的想要的
      haslist.forEach(function(item) {
        var arrTimes = {};
        arrTimes.name = item.device;
        arrTimes.time = item.time;
        arrTimes.number = item.number;

        stillist.push(arrTimes);
      });
      console.log(stillist);
      //   this.arrlist = stillist;
      // console.log(this.arrlist);
      var lenghtindex = this.dayTiem(
        stillist[0].time,
        stillist[stillist.length - 1].time
      ); //得出最大和最小时间相差的天数
      var newTime = [];
      newTime.push(stillist[0].time);

      for (var i = 0; i < lenghtindex; i++) {
        newTime.push(this.getNewDay(newTime[i], 1));
      }
      console.log(newTime); //得出的數組時間天數
      console.log(this.screenlist(stillist));
      console.log(stillist);

      this.arrlist = this.sortlist(
        stillist,
        this.screenlist(stillist),
        newTime
      );
      console.log(this.arrlist);
    },
    //两个时间相减得出的天数
    dayTiem: function(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1);
      var now = new Date(date2);
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    }, //dayTiem完结
    //日期加上天数得到新的日期
    //dateTemp 需要参加计算的日期，days要添加的天数，返回新的日期，日期格式：YYYY-MM-DD
    getNewDay(dateTemp, days) {
      var dateTemp = dateTemp.split("-");
      var nDate = new Date(dateTemp[1] + "-" + dateTemp[2] + "-" + dateTemp[0]); //转换为MM-DD-YYYY格式
      var millSeconds = Math.abs(nDate) + days * 24 * 60 * 60 * 1000;
      var rDate = new Date(millSeconds);
      var year = rDate.getFullYear();
      var month = rDate.getMonth() + 1;
      if (month < 10) month = "0" + month;
      var date = rDate.getDate();
      if (date < 10) date = "0" + date;
      return year + "-" + month + "-" + date;
    },
    // 排序列表并补齐缺失数据
    sortlist: function(element, list, timeList) {
      var typeList = timeList;
      var brandList = list; //大洲
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

<style>
h2 {
  font-size: 20px;
  color: #333;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 20px;
  margin-top: 50px;
}
</style>
