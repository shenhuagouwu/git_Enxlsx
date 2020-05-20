<template>
  <div class="chart-page">
    <h2>{{h2Font}}</h2>
    <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0"></ant-vanter>
  </div>
</template>
<script>
import antVanter from "../antVanter/LineChart";
export default {
  name: "timeIntervalPage",
  components: {
    antVanter
  },
  props: ["filebox"],
  data() {
    return {
      h2Font:"各品牌各时段询盘分析",
      name: [],
      areaData: [],
      newlist: [],
      arrlist: []
    };
  },
  watch: {
    filebox: function(val) {
      if (val.rowData != ""||val.rowData.length>=0) {
        this.initAeraChartData(val);
      }
    }
  },
  methods: {
    editFont:function(data){
      var sametext = "各时段询盘分析";
      if(data.brands.length == 1 && data.countries.length == 0 && data.continents.length == 0){
        this.h2Font=data.brands + sametext;
      }else if(data.brands.length == 1 && data.countries.length == 1 && data.continents.length == 0){
        this.h2Font=data.brands + data.countries + sametext;
      }else if(data.brands.length == 1 && data.countries.length == 0 && data.continents.length == 1){
        this.h2Font=data.brands + data.continents + sametext;
      }else if(data.brands.length == 1 && data.countries.length > 1 && data.continents.length == 0){
        this.h2Font=data.brands + "各个国家" + sametext;
      }else if(data.brands.length == 1 && data.countries.length == 0 && data.continents.length > 1){
        this.h2Font=data.brands + "各个大洲" + sametext;
      }else if(data.brands.length > 1 && data.countries.length == 0 && data.continents.length == 0){
        this.h2Font=this.h2Font;
      }else if(data.brands.length > 1 && data.countries.length == 1 && data.continents.length == 0){
        this.h2Font="各个品牌" + data.countries + sametext;
      }else if(data.brands.length > 1 && data.countries.length == 0 && data.continents.length == 1){
        this.h2Font="各个品牌" + data.continents + sametext;
      }else{
        this.h2Font=this.h2Font;
      }
    },
    // 初始化图表数据
    initAeraChartData: function(Data) {
      //oldjson是把二维数组剔除不需要的数据，并把里面的数组转成对象
      let OldJson = Data.rowData.map((item, index) => {
        var newJson = {};
        if (
          Data.searchData.brands.length > 1 ||
          (Data.searchData.brands.length == 0 &&
            Data.searchData.continents.length == 0 &&
            Data.searchData.countries.length == 0)
        ) {
          newJson.name = item[0];
        } else {
          if (Data.searchData.continents.length >= 1) {
            newJson.name = item[9];
          }
          if (Data.searchData.countries.length >= 1) {
            newJson.name = item[10];
          }
        }
        newJson.time = item[4];
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
      this.editFont(Data.searchData);
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
.module {
  width: 100%;
  min-height: 360px;
  background: #fff;
  border-radius: 10px;
  margin: 30px 0;
  overflow: hidden;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  .no-data {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    line-height: 360px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .list-group {
    overflow: hidden;
    .list-group-item {
      width: 50%;
      background: #fff;
      float: left;
      border-right: 1px solid #ecf1f7;
      border-bottom: 1px solid #ecf1f7;
      transition: all ease 0.5s;
      &:nth-child(odd):last-child {
        width: 100%;
      }
      .title {
        padding: 20px;
        border-bottom: 1px solid #ecf1f7;
        position: relative;
        h4 {
          font-size: 14px;
          color: #333;
          position: relative;
          &:before {
            content: "";
            width: 6px;
            height: 18px;
            border-radius: 10px;
            background: #3881f0;
            margin-right: 10px;
            display: inline-block;
            vertical-align: sub;
          }
        }
      }
      .data-delete {
        width: 24px;
        height: 24px;
        background: #3881f0;
        border-radius: 50%;
        display: block;
        font-size: 16px;
        line-height: 21px;
        text-align: center;
        color: #ffffff;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -12px;
        cursor: pointer;
      }
      .text {
        font-size: 50px;
        font-weight: bold;
        text-align: center;
        line-height: 300px;
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
</style>
