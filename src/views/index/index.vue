<template>
  <div class="adminmainfr">
    <div class="data-btn">
      <div class="searchbox">
        <div class="data_brand">
          <el-select
            v-model="brands"
            class="selectbrands"
            v-bind:disabled="disabledbrands"
            multiple
            collapse-tags
            @change="handelBrands"
            placeholder="品牌选择"
          >
            <el-option v-for="item in InitSearch.brands" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="data_countrie">
          <el-select
            v-model="countries"
            class="selectcountries"
            v-bind:disabled="disabledcountrie"
            multiple
            collapse-tags
            @change="handelCountries"
            placeholder="国家选择"
          >
            <el-option v-for="item in InitSearch.countries" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="data_continents">
          <el-select
            v-model="continents"
            class="selectcontinents"
            v-bind:disabled="disabledcontinents"
            multiple
            collapse-tags
            @change="handelContinents"
            placeholder="大洲选择"
          >
            <el-option
              v-for="item in InitSearch.continents"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
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
    <router-view v-bind:filebox="filebox" />
  </div>
</template>
<script>
import draggable from "vuedraggable";
import moment from "moment";
export default {
  name: "indexPage",
  components: {
    draggable
  },
  data() {
    return {
      fileList: [],
      outData: [],
      outRowData: [],
      timeDate:[],
      filebox: {
        rowData: "",
        searchData: {},
        timeDate:[]
      },
      disabledbrands: false,
      disabledcountrie: false,
      disabledcontinents: false,
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
      InitSearch: {
        brands: [], // 品牌
        continents: [], // 大洲
        countries: [] // 国家
      },
      searchParam: {
        brands: [], // 品牌
        continents: [], // 大洲
        countries: [], // 国家
        date1: "", // 开始时间
        date2: "" // 结束时间
      },
      brands: [], // 品牌
      countries: [], // 国家
      continents: [] // 大洲
    };
  },
  mounted() {
    this.getDetailInfo();
  },
  methods: {
    getDetailInfo: function() {
      var $this = this;
      var time1,time2;
      if($this.subtime==''){
          time1='';
          time2='';
      }else{
          time1=$this.subtime[0];
          time2=$this.subtime[1];
      }
      $this.$api.get(
        "/Enapi/index?time1=" + time1 + "&time2=" + time2,
        null,
        function(res) {
          if (res) {
            $this.outData = res;
            var brandlist = [];
            $this.outData.data.forEach(function(item, index) {
              brandlist.push(item.brand);
            });
            $this.InitSearch.brands = brandlist;

            var rowList = [];
            var continentData = [];
            var countrieData = [];
            var areaData = [];
            var continentData = [];
            for (var i = 0; i < 3; i++) {
              $this.outData.data[i].list.forEach(function(item, index) {
                item.brands = $this.outData.data[i].brand;
                rowList.push(item);
              });
            }
            $this.outRowData = rowList;
            $this.outRowData.forEach(function(item, index) {
              areaData.push(item.area);
              continentData.push(item.continent);
            });
            $this.heavyData(continentData, areaData);
            $this.handleQueryBtn();
          }
        }
      );
    },
    //品牌  国家  大洲去重
    heavyData: function(continentData, countrieData) {
      var continentslist = [];
      var countrieslist = [];
      continentData.forEach(function(item, index) {
        if ($.inArray(item, continentslist) == -1) {
          continentslist.push(item);
        }
      });
      countrieData.forEach(function(item, index) {
        if ($.inArray(item, countrieslist) == -1) {
          countrieslist.push(item);
        }
      });
      this.InitSearch.continents = continentslist;
      this.InitSearch.countries = countrieslist;
    },
    // 计算续住的总日期列表
    gettimeDate(begin, end) {
      var arr1= begin.split("-");
      var arr2= end.split("-");
      var arr1_= new Date();
      var arrTime = [];
      arr1_.setUTCFullYear(arr1[0], arr1[1] - 1, arr1[2]);
      var arr2_= new Date();
      arr2_.setUTCFullYear(arr2[0], arr2[1] - 1, arr2[2]);
      var unixDb = arr1_.getTime();
      var unixDe = arr2_.getTime();
      for (var k = unixDb; k <= unixDe;) {
        arrTime.push(this.datetimeparse(k, 'YY-MM-DD'));
        k = k + 24 * 60 * 60 * 1000;
      }
      return arrTime;
    },    
    // 时间格式处理
    datetimeparse (timestamp, format, prefix) {
        if (typeof timestamp =='string'){
            timestamp=Number(timestamp)
        };
        //转换时区
        var currentZoneTime = new Date (timestamp);
        var currentTimestamp = currentZoneTime.getTime ();
        var offsetZone = currentZoneTime.getTimezoneOffset () / 60;//如果offsetZone>0是西区，西区晚
        var offset = null;
        //客户端时间与服务器时间保持一致，固定北京时间东八区。
        offset = offsetZone + 8;
        currentTimestamp = currentTimestamp + offset * 3600 * 1000
  
        var newtimestamp = null;
        if (currentTimestamp) {
            if (currentTimestamp.toString ().length === 13) {
                newtimestamp = currentTimestamp.toString ()
            } else if (currentTimestamp.toString ().length === 10) {
                newtimestamp = currentTimestamp + '000'
            } else {
                newtimestamp = null
            }
        } else {
            newtimestamp = null
        }
        ;
        var dateobj = newtimestamp ? new Date (parseInt (newtimestamp)) : new Date ()
        var YYYY = dateobj.getFullYear ()
        var MM = dateobj.getMonth () > 8 ? dateobj.getMonth () + 1 : '0' + (dateobj.getMonth () + 1)
        var DD = dateobj.getDate () > 9 ? dateobj.getDate () : '0' + dateobj.getDate ()
        var HH = dateobj.getHours () > 9 ? dateobj.getHours () : '0' + dateobj.getHours ()
        var mm = dateobj.getMinutes () > 9 ? dateobj.getMinutes () : '0' + dateobj.getMinutes ()
        var ss = dateobj.getSeconds () > 9 ? dateobj.getSeconds () : '0' + dateobj.getSeconds ()
        var output = '';
        var separator = '/'
        if (format) {
            separator = format.match (/-/) ? '-' : '/'
            output += format.match (/yy/i) ? YYYY : ''
            output += format.match (/MM/) ? (output.length ? separator : '') + MM : ''
            output += format.match (/dd/i) ? (output.length ? separator : '') + DD : ''
            output += format.match (/hh/i) ? (output.length ? ' ' : '') + HH : ''
            output += format.match (/mm/) ? (output.length ? ':' : '') + mm : ''
            output += format.match (/ss/i) ? (output.length ? ':' : '') + ss : ''
        } else {
            output += YYYY + separator + MM + separator + DD
        }
        output = prefix ? (prefix + output) : output
  
        return newtimestamp ? output : ''
    },
    // 获取过滤筛选条件后的数据
    filterResult: function(initData, searchParam) {
      var filterBrandData = this.filterDatabrand(searchParam.brands);
      var filterContinentData = this.filterData(
        filterBrandData,
        searchParam.continents,
        "con"
      );
      var filterCountryData = this.filterData(
        filterContinentData,
        searchParam.countries,
        "area"
      );
      var filterData = this.filterDate(
        filterCountryData,
        searchParam.date1,
        searchParam.date2
      );
      return filterData;
    },
    // 过滤品牌
    filterDatabrand: function(itemParam) {
      var newData = [];
      var newDatalist = [];
      if (itemParam.length > 0) {
        this.outData.data.forEach(function(item) {
          itemParam.forEach(function(items) {
            if (item.brand == items) {
              newDatalist.push(item);
            }
          });
        });
        for (var i = 0; i < newDatalist.length; i++) {
          newDatalist[i].list.forEach(function(item, index) {
            newData.push(item);
          });
        }
      } else {
        for (var i = 0; i < this.outData.data.length; i++) {
          this.outData.data[i].list.forEach(function(item, index) {
            newData.push(item);
          });
        }
      }
      return newData;
    },
    // 过滤国家、大洲
    filterData: function(initData, itemParam, index) {
      var newData = [];
      if (itemParam.length > 0) {
        initData.forEach(function(item) {
          itemParam.forEach(function(items) {
            if (index == "area") {
              if (item.area == items) {
                newData.push(item);
              }
            } else {
              if (item.continent == items) {
                newData.push(item);
              }
            }
          });
        });
      } else {
        newData = initData;
      }
      return newData;
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
        // if($this.compareDate(date1,date2)>0){
        //   startDate = date2;
        //   endDate = date1;
        // }else if($this.compareDate(date1,date2)<0){
        //   startDate = date1;
        //   endDate = date2;
        // }else{
        //   startDate = endDate = date1;
        // }
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
    // 品牌change事件
    handelBrands(val) {
      var $this = this;
      $this.brands = val;
      var brandNum = $this.brands.length;
      if ($this.countries.length >= 1 && $this.continents.length < 1) {
        if ($this.countries.length > 1) {
          if ($this.brands.length < 1) {
            $this.disabledbrands = false;
          }
          if ($this.brands.length > 1) {
            $this.$alert("当国家是多个时，品牌只能有一个", "提示", {
              confirmButtonText: "确定"
            });
            $this.brands = $this.brands.splice(0, 1);
            $this.disabledbrands = true;
          }
          if (($this.brands.length = 1)) {
            $this.disabledbrands = true;
          }
        } else {
          $this.disabledcountrie = false;
          if ($this.brands.length > 1) {
            $this.disabledcountrie = true;
          }
        }
      }
      if ($this.countries.length < 1 && $this.continents.length >= 1) {
        if ($this.continents.length > 1) {
          if ($this.brands.length < 1) {
            $this.disabledbrands = false;
          }
          if ($this.brands.length > 1) {
            $this.$alert("当大洲是多个时，品牌只能有一个", "提示", {
              confirmButtonText: "确定"
            });
            $this.brands = $this.brands.splice(0, 1);
            $this.disabledbrands = true;
          }
          if (($this.brands.length = 1)) {
            $this.disabledbrands = true;
          }
        } else {
          $this.disabledcontinents = false;
          if ($this.brands.length > 1) {
            $this.disabledcontinents = true;
          }
        }
      }
    },
    // 国家change事件
    handelCountries(val) {
      var $this = this;
      $this.countries = val;
      var CountriesNum = $this.countries.length;
      if (CountriesNum < 1) {
        $this.disabledcontinents = false;
      } else {
        $this.disabledcontinents = true;
      }
      if ($this.brands.length > 1) {
        if ($this.countries.length > 1) {
          $this.$alert("当品牌是多个时，国家只能有一个", "提示", {
            confirmButtonText: "确定"
          });
          $this.countries = $this.countries.splice(0, 1);
          $this.disabledcountrie = true;
        }
        if (($this.countries.length = 1)) {
          $this.disabledcountrie = true;
        }
        if ($this.countries.length < 1) {
          $this.disabledcountrie = false;
        }
      }
      if ($this.brands.length < 1) {
        $this.disabledbrands = false;
      }
      if ($this.brands.length == 1) {
        if ($this.countries.length > 1) {
          $this.disabledbrands = true;
        } else {
          $this.disabledbrands = false;
        }
      }
    },
    // 大洲change事件
    handelContinents(val) {
      var $this = this;
      if (val != "") {
        $this.continents = val;
      }
      var ContinentsNum = $this.continents.length;
      if (ContinentsNum < 1) {
        $this.disabledcountrie = false;
      } else {
        $this.disabledcountrie = true;
      }
      if ($this.brands.length > 1) {
        if ($this.continents.length > 1) {
          $this.$alert("当品牌是多个时，大洲只能有一个", "提示", {
            confirmButtonText: "确定"
          });
          $this.continents = $this.continents.splice(0, 1);
          $this.disabledcontinents = true;
        }
        if (($this.continents.length = 1)) {
          $this.disabledcontinents = true;
        }
        if ($this.continents.length < 1) {
          $this.disabledcontinents = false;
        }
      }
      if ($this.brands.length <= 1) {
        $this.disabledbrands = false;
      }
      if ($this.brands.length == 1) {
        if ($this.continents.length > 1) {
          $this.disabledbrands = true;
        } else {
          $this.disabledbrands = false;
        }
      }
    },
    // 提交满足筛选条件的数据给子组件
    handleQueryBtn() {
      var $this = this;
      $this.searchParam.brands = $this.brands;
      $this.searchParam.continents = $this.continents;
      $this.searchParam.countries = $this.countries;
      if ($this.subtime != "") {
        $this.searchParam.data1 = moment($this.subtime[0]).format("YYYY-MM-DD");
        $this.searchParam.data2 = moment($this.subtime[1]).format("YYYY-MM-DD");
        $this.timeDate=$this.gettimeDate($this.searchParam.date1,$this.searchParam.date2);
      } else {
        $this.searchParam.data1 = "";
        $this.searchParam.data2 = "";
        if($this.outRowData != ''){
          var timeList=[];
          $this.outRowData.forEach(function(item){
              timeList.push(item.datetime.split(' ')[0]);
          })
          var max=timeList[0],min=timeList[0];
          timeList.forEach(function(item,index){
            if($this.compareDate(item,max)>=0){
              max=item;
            }
            if($this.compareDate(item,min)<=0){
              min=item;
            }
          })
          $this.timeDate=$this.gettimeDate(min,max);
        }
      }
      var filebox = {};
      filebox.timeDate=$this.timeDate
      filebox.searchData = $this.searchParam;
      filebox.rowData = $this.filterResult($this.outRowData, $this.searchParam);
      $this.filebox = filebox;
      console.log(filebox,'filebox')
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
      // display: none;
      // &.is-open{
      //   display: block;
      // }
      .data_brand {
        float: left;
        width: 160px;
        margin-right: 15px;
      }
      .data_countrie {
        float: left;
        width: 160px;
        margin-right: 15px;
      }
      .data_continents {
        float: left;
        width: 160px;
      }
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
}
.add-template {
  width: fit-content;
  background: #242a33;
  border-radius: 0 0 20px 20px;
  color: #fff;
  line-height: 40px;
  padding: 0 20px 0 15px;
  margin: 0 auto;
  cursor: pointer;
}
.add-template span {
  font-size: 25px;
  vertical-align: -3px;
}
</style>
