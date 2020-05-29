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
    <div class="chart-page">
      <h2>福特、红星、福特总的询盘对比</h2>
        <population-Chart :newNum="newNum"></population-Chart>
    </div>
    <div class="chart-page">
        <h2>福特、红星、福特当天的询盘</h2>
        <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0"></ant-vanter>
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
      newNum: [],
      filebox: {
        rowData: "",
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
  beforeMount(){
    var $this = this;
    if ($this.newNum.length>0) {
      $this.initAeraChartData($this.newNum);
    }
  },
  methods: {    
    getDefaultInfo:function(){
      var $this = this;
      var time1='2020-04-15';
      var time2='2020-04-20';      
      $this.$api.get('/Enapi/index?time1='+time1+'&time2='+time2,null,function(res){
         if(res){
            $this.outData=res;
            var rowList=[];
            for(var i=0;i<3;i++){
                $this.outData.data[i].list.forEach(function(item, index){
                    item.brands=$this.outData.data[i].brand;

                    rowList.push(item);
                });
            }
            $this.outData.data.forEach(function(item,index){
                var brandNum={}
                brandNum.name=item.brand;
                brandNum.number=item.list.length;
                $this.newNum.push(brandNum);
            })
            $this.outRowData=rowList;
            $this.handleQueryBtn();
         }
      });
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
            $this.compareDate(item[1], startDate) >= 0 &&
            $this.compareDate(endDate, item[1]) >= 0
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
        $this.searchParam.data1 = moment($this.subtime[0]).format("YYYY-MM-DD");
        $this.searchParam.data2 = moment($this.subtime[1]).format("YYYY-MM-DD");
      } else {
        $this.searchParam.data1 = "";
        $this.searchParam.data2 = "";
      } 
      var filebox = {};
      filebox.searchData = $this.searchParam;
      filebox.rowData = $this.filterResult($this.outRowData, $this.searchParam);
      $this.filebox = filebox;
      $this.initAeraChartData($this.filebox);
    },
    // 初始化图表数据
    initAeraChartData: function(Data) {
      console.log(Data,'data1')
      //oldjson是把二维数组剔除不需要的数据，并把里面的数组转成对象
      let OldJson = Data.rowData.map((item, index) => {
        var newJson = {};
        newJson.name = item.brands;
        var Datatime=item.datetime.split(' ')[1].split(':')[0];
        if(Datatime=="00"){newJson.time='0-1';}
        if(Datatime=="01"){newJson.time='1-2';}
        if(Datatime=="02"){newJson.time='2-3';}
        if(Datatime=="03"){newJson.time='3-4';}
        if(Datatime=="04"){newJson.time='4-5';}
        if(Datatime=="05"){newJson.time='5-6';}
        if(Datatime=="06"){newJson.time='6-7';}
        if(Datatime=="07"){newJson.time='7-8';}
        if(Datatime=="08"){newJson.time='8-9';}
        if(Datatime=="09"){newJson.time='9-10';}
        if(Datatime=="10"){newJson.time='10-11';}
        if(Datatime=="11"){newJson.time='11-12';}
        if(Datatime=="12"){newJson.time='12-13';}
        if(Datatime=="13"){newJson.time='13-14';}
        if(Datatime=="14"){newJson.time='14-15';}
        if(Datatime=="15"){newJson.time='15-16';}
        if(Datatime=="16"){newJson.time='16-17';}
        if(Datatime=="17"){newJson.time='17-18';}
        if(Datatime=="18"){newJson.time='18-19';}
        if(Datatime=="19"){newJson.time='19-20';}
        if(Datatime=="21"){newJson.time='21-22';}
        if(Datatime=="22"){newJson.time='22-23';}
        if(Datatime=="23"){newJson.time='23-24';}
        newJson.number = 1;
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
      this.arrlist = this.sortlist(arrlist, this.screenlist(arrlist));
      console.log(this.arrlist,"图表最终使用数据");
    },
    // 排序列表并补齐缺失数据
    sortlist: function(element, list) {
      var typeList = [
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
      ];
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

<style lang="scss">
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
  .chart-page{
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-top: 30px;
    h2{
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
