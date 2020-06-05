<template>
  <div class="adminmainfr">
    <div class="data-btn">
      <div class="searchbox">
        <div class="data_time">
          <span>时间</span>
          <el-date-picker
            v-model="subtime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
        <span class="searchbtn" v-on:click="handleQueryBtn">查询</span>
      </div>
    </div>
    <div class="popul-page">
      <h2>福特、红星、福特总的询盘对比</h2>
<<<<<<< HEAD
        <population-Chart :newNum="newNum" style="height:300px"></population-Chart>
    </div>
    <div class="chart-page">
        <h2>福特、红星、福特当天的询盘</h2>
        <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0" style="height:300px"></ant-vanter>
=======
      <population-Chart :newNum="newNum"></population-Chart>
    </div>
    <div class="chart-page">
      <h2>福特、红星、福特当天的询盘</h2>
      <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0"></ant-vanter>
>>>>>>> 5d57db9d0050055217663db3ab59dfd16f8a6c80
    </div>
  </div>
</template>

<script>
import antVanter from "../antVanter/LineChart";
import populationChart from "../antVanter/populationChart";
import moment from "moment";
export default {
  name: "defaultPage",
  components: {
    antVanter,
    populationChart
  },
  data() {
    return {
      outData: [],
      outRowData: [],
<<<<<<< HEAD
      newNum:[],
      timeDate:[],
=======
      newNum: [],
      timeDate: [],
>>>>>>> 5d57db9d0050055217663db3ab59dfd16f8a6c80
      filebox: {
        rowData: "",
        timeDate: [],
        searchData: {}
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      subtime: "",
      searchParam: {
        date1: "", // 开始时间
        date2: "" // 结束时间
      },
      name: [],
      areaData: [],
      newlist: [],
      arrlist: []
    };
  },
  mounted() {
    this.getDefaultInfo();
  },
  beforeMount() {
    var $this = this;
<<<<<<< HEAD
    if ($this.newNum.length>0) {
      $this.getpopulist($this.newNum);
    }
    if ($this.filebox.rowData != "" || $this.filebox.rowData.length > 0) {
      $this.initAeraChartData($this.filebox);
=======
    if ($this.newNum.length > 0) {
      $this.initAeraChartData($this.newNum);
>>>>>>> 5d57db9d0050055217663db3ab59dfd16f8a6c80
    }
  },
  methods: {
    getDefaultInfo: function() {
      var $this = this;
      var time1, time2;
      if ($this.subtime == "") {
        time1 = "";
        time2 = "";
      } else {
        time1 = $this.subtime[0];
        time2 = $this.subtime[1];
      }
      $this.$api.get(
        "/Enapi/index?time1=" + time1 + "&time2=" + time2,
        null,
        function(res) {
          if (res) {
            $this.outData = res;
            var rowList = [];
            for (var i = 0; i < 3; i++) {
              $this.outData.data[i].list.forEach(function(item, index) {
                item.brands = $this.outData.data[i].brand;
                rowList.push(item);
              });
            }
            $this.outRowData = rowList;
            $this.handleQueryBtn();
          }
        }
      );
    },
    // 计算总日期列表
    gettimeDate(begin, end) {
      var arr1 = begin.split("-");
      var arr2 = end.split("-");
      var arr1_ = new Date();
      var arrTime = [];
      arr1_.setUTCFullYear(arr1[0], arr1[1] - 1, arr1[2]);
      var arr2_ = new Date();
      arr2_.setUTCFullYear(arr2[0], arr2[1] - 1, arr2[2]);
      var unixDb = arr1_.getTime();
      var unixDe = arr2_.getTime();
      for (var k = unixDb; k <= unixDe; ) {
        arrTime.push(this.datetimeparse(k, "YY-MM-DD"));
        k = k + 24 * 60 * 60 * 1000;
      }
      return arrTime;
    },
    // 时间格式处理
    datetimeparse(timestamp, format, prefix) {
      if (typeof timestamp == "string") {
        timestamp = Number(timestamp);
      }
      //转换时区
      var currentZoneTime = new Date(timestamp);
      var currentTimestamp = currentZoneTime.getTime();
      var offsetZone = currentZoneTime.getTimezoneOffset() / 60; //如果offsetZone>0是西区，西区晚
      var offset = null;
      //客户端时间与服务器时间保持一致，固定北京时间东八区。
      offset = offsetZone + 8;
      currentTimestamp = currentTimestamp + offset * 3600 * 1000;

      var newtimestamp = null;
      if (currentTimestamp) {
        if (currentTimestamp.toString().length === 13) {
          newtimestamp = currentTimestamp.toString();
        } else if (currentTimestamp.toString().length === 10) {
          newtimestamp = currentTimestamp + "000";
        } else {
          newtimestamp = null;
        }
      } else {
        newtimestamp = null;
      }
      var dateobj = newtimestamp
        ? new Date(parseInt(newtimestamp))
        : new Date();
      var YYYY = dateobj.getFullYear();
      var MM =
        dateobj.getMonth() > 8
          ? dateobj.getMonth() + 1
          : "0" + (dateobj.getMonth() + 1);
      var DD =
        dateobj.getDate() > 9 ? dateobj.getDate() : "0" + dateobj.getDate();
      var HH =
        dateobj.getHours() > 9 ? dateobj.getHours() : "0" + dateobj.getHours();
      var mm =
        dateobj.getMinutes() > 9
          ? dateobj.getMinutes()
          : "0" + dateobj.getMinutes();
      var ss =
        dateobj.getSeconds() > 9
          ? dateobj.getSeconds()
          : "0" + dateobj.getSeconds();
      var output = "";
      var separator = "/";
      if (format) {
        separator = format.match(/-/) ? "-" : "/";
        output += format.match(/yy/i) ? YYYY : "";
        output += format.match(/MM/)
          ? (output.length ? separator : "") + MM
          : "";
        output += format.match(/dd/i)
          ? (output.length ? separator : "") + DD
          : "";
        output += format.match(/hh/i) ? (output.length ? " " : "") + HH : "";
        output += format.match(/mm/) ? (output.length ? ":" : "") + mm : "";
        output += format.match(/ss/i) ? (output.length ? ":" : "") + ss : "";
      } else {
        output += YYYY + separator + MM + separator + DD;
      }
      output = prefix ? prefix + output : output;

      return newtimestamp ? output : "";
    },
    // 获取过滤筛选条件后的数据
    filterResult: function(initData, searchParam) {
      var filterData = this.filterDate(
        initData,
        searchParam.date1,
        searchParam.date2
      );
      return filterData;
    },
    // 过滤日期
    filterDate: function(initData, date1, date2) {
      var $this = this;
      var startDate = date1;
      var endDate = date2;
      var newData = [];
      if (date1 == "" && date2 == "") {
        newData = initData;
      } else {
        initData.forEach(function(item) {
          if (
            $this.compareDate(item.datetime.split(" ")[0], startDate) >= 0 &&
            $this.compareDate(endDate, item.datetime.split(" ")[0]) >= 0
          ) {
            newData.push(item);
          }
        });
      }
      return newData;
    },
    // 日期比较大小
    compareDate: function(a, b) {
      var reg = /[^\d+]/;
      var arr1 = a.split(reg);
      var arr2 = b.split(reg);
      var date1 = new Date(arr1[0], arr1[1], arr1[2]);
      var date2 = new Date(arr2[0], arr2[1], arr2[2]);
      return date1 - date2;
    },
    // 提交满足筛选条件的数据给子组件
    handleQueryBtn() {
      var $this = this;
      if ($this.subtime != "") {
        $this.searchParam.date1 = moment($this.subtime[0]).format("YYYY-MM-DD");
        $this.searchParam.date2 = moment($this.subtime[1]).format("YYYY-MM-DD");
        $this.timeDate = $this.gettimeDate(
          $this.searchParam.date1,
          $this.searchParam.date2
        );
      } else {
        $this.searchParam.date1 = "";
        $this.searchParam.date2 = "";
        if ($this.outRowData != "") {
          var timeList = [];
          $this.outRowData.forEach(function(item) {
            timeList.push(item.datetime.split(" ")[0]);
          });
          var max = timeList[0],
            min = timeList[0];
          timeList.forEach(function(item, index) {
            if ($this.compareDate(item, max) >= 0) {
              max = item;
            }
            if ($this.compareDate(item, min) <= 0) {
              min = item;
            }
          });
          $this.timeDate = $this.gettimeDate(min, max);
        }
      }
      var filebox = {};
      filebox.timeDate = $this.timeDate;
      filebox.searchData = $this.searchParam;
      filebox.rowData = $this.filterResult($this.outRowData, $this.searchParam);
      $this.filebox = filebox;
      $this.initAeraChartData($this.filebox);
      $this.getpopulist(filebox.rowData);
    },
    //获取条形图数据
<<<<<<< HEAD
    getpopulist:function(val){
      var $this=this;
      var brands=[];
      var oldnewNum=[];
      $this.outData.data.forEach(function(item){
          brands.push(item.brand);
=======
    getpopulist: function(val) {
      var $this = this;
      var brands = [];
      $this.outData.data.forEach(function(item) {
        brands.push(item.brand);
>>>>>>> 5d57db9d0050055217663db3ab59dfd16f8a6c80
      });
      brands.forEach(function(item) {
        var brandNum = {};
        brandNum.number = 0;
        val.forEach(function(item1) {
          if (item == item1.brands) {
            brandNum.number++;
            brandNum.name = item;
          }
        });
        oldnewNum.push(brandNum);
      });
      
      oldnewNum.sort(function(a,b){
        return a.number - b.number
      })
      // for(var i = 0; i<oldnewNum.length;i++){
      //   for(var j = 1; j<oldnewNum.length+1;j++){
      //     if(oldnewNum[i].number<oldnewNum[j].number){
      //         oldnewNum[i] = oldnewNum.splice(j,1,oldnewNum[i])[0];
      //     }
      //   }
        // oldnewNum.forEach(function(item){
        //     if(oldnewNum[i].number>=item.number){
        //       maxNum=item;
        //     }
        // });
      //}
      $this.newNum = oldnewNum;
      //console.log($this.newNum,'$this.newNum');
    },
    // 初始化图表数据
    initAeraChartData: function(Data) {
      //oldjson是把二维数组剔除不需要的数据，并把里面的数组转成对象
      var OldJson = Data.rowData.map((item, index) => {
        var newJson = {};
        newJson.name = item.brands;
        newJson.time = item.datetime.split(" ")[0];
        newJson.number = 0;
        return newJson;
      });
      //数组去重然后放在一个新的数组里面
      var hash = {};
      var arrlist = [];
      arrlist = OldJson.reduce(function(item, next) {
        const key = `${next.name}${next.time}`;
        hash[key] ? "" : (hash[key] = true && item.push(next));
        return item;
      }, []);
      //把新的数组与之前的数组进行对比如果相同就让number++最后得出vant-v需要的数组
      OldJson.map(function(item, index) {
        arrlist.map(function(item1, index1) {
          if (item.name == item1.name && item.time == item1.time) {
            item1.number++;
          }
        });
      });
      this.arrlist = this.sortlist(
        arrlist,
        this.screenlist(arrlist),
        Data.timeDate
      );
    },
    // 排序列表并补齐缺失数据
    sortlist: function(element, list, timeDate) {
      var typeList = timeDate;
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
    },
    // 获取图表中的线条所属名称列表
    screenlist: function(element) {
      var result = [];
      for (var index = 0; index < element.length; index++) {
        if (result.indexOf(element[index].name) == -1) {
          result.push(element[index].name);
        }
      }
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
.adminmainfr {
  clear: both;
  display: block;
  width: 100%;
  position: relative;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 30px 30px 0px 30px;
  .data-btn {
    overflow: hidden;
    .searchbox {
      float: right;
      .el-input__inner {
        padding-left: 10px;
      }
      .data_time {
        float: left;
        & > span {
          float: left;
          font-size: 14px;
          color: #333;
          line-height: 35px;
          text-align: left;
          padding: 0px 10px;
        }
        .el-date-editor--daterange.el-input__inner {
          width: 280px;
        }
        .el-date-editor .el-range-separator {
          padding: 0px;
          width: auto;
        }
      }
      .searchbtn {
        float: left;
        background: #7637eb;
        color: #fff;
        border-radius: 5px;
        font-size: 14px;
        padding: 5px 15px;
        height: 35px;
        line-height: 25px;
        margin-left: 15px;
        cursor: pointer;
        &:hover {
          background: #f13331;
        }
      }
    }
  }
  .chart-page {
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-top: 30px;
    padding: 30px;
    h2 {
      width: 100%;
      height: 48px;
      line-height: 48px;
      font-size: 24px;
      text-align: center;
      margin: 20px 0;
      color: #555;
    }
  }
  .popul-page {
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-top: 30px;
    padding: 10px 30px 20px;
    h2 {
      width: 100%;
      height: 48px;
      line-height: 48px;
      font-size: 24px;
      text-align: center;
      margin: 20px 0;
      color: #555;
    }
  }
}
</style>
