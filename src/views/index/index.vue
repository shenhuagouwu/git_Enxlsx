<template>
  <div class="adminmainfr">
    <div class="data-btn">
      <el-upload
        class="upload-demo"
        :multiple="false"
        :auto-upload="true"
        list-type="text"
        :show-file-list="true"
        :before-upload="beforeUpload"
        :drag="false"
        action
        :on-exceed="handleExceed"
        :http-request="uploadFile"
      >
        <el-button slot="trigger" size="small" type="primary">导入询盘数据</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过5MB</div>
      </el-upload>
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
import XLSX from "xlsx";
import moment from "moment";
export default {
  name: "indexPage",
  components: {
    draggable
  },
  data() {
    return {
      fileList: [],
      outColData: [],
      outRowData: [],
      filebox: {
        rowData: "",
        searchData: {}
      },
      disabledbrands: false,
      disabledcountrie: false,
      disabledcontinents: false,
      listshow: [
        {
          id: 1,
          name: "1月询盘",
          text: "100"
        },
        {
          id: 2,
          name: "2月询盘",
          text: "200"
        }
      ],
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
  computed: {
    databox: function() {
      if (this.$store.getters.databox != "") {
        return this.$store.getters.databox;
      } else {
        return "";
      }
    }
  },
  mounted() {
    if (this.databox != "") {
      this.outColData = this.databox.outColData;
      this.outRowData = this.databox.outRowData;
      //品牌  国家  大洲去重
      this.heavyData(
        this.outColData[0],
        this.outColData[9],
        this.outColData[10]
      );
      this.handleQueryBtn();
    }
  },
  methods: {
    // 上传文件上传前事件
    beforeUpload(file) {
      const isText = file.type === "application/vnd.ms-excel";
      const isTextComputer =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      return isText | isTextComputer;
    },
    // 上传文件个数超过定义的数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    },
    // 上传文件
    uploadFile(item) {
      if (item.file) {
        this.exportData(item.file);
      } else {
        console.log("文件不存在");
      }
    },
    // 初始化上传文件获取的数据
    exportData(e) {
      var $this = this;
      // 用FileReader来读取
      var reader = new FileReader();
      reader.onload = function(ev) {
        var data = ev.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
          cellDates: true
        });
        var wsname = workbook.SheetNames[0]; //取第一张表
        var worksheet = workbook.Sheets[wsname]; //获取工作表
        var range = XLSX.utils.decode_range(worksheet["!ref"]);
        //保存数据范围数据
        var row_end = range.e.r;
        var col_end = range.e.c;
        var j,
          i,
          addr,
          cell,
          cols = [],
          rows = [],
          col_data = [],
          row_data = [];
        for (j = 0; j <= col_end; j++) {
          col_data = []; //清空接收数据
          for (i = 0; i <= row_end; i++) {
            addr = XLSX.utils.encode_col(j) + XLSX.utils.encode_row(i);
            cell = worksheet[addr];
            if (j == 3) {
              cell.v = moment(cell.v).format("H:M");
            }
            if (cell) {
              col_data.push(cell.v);
            } else {
              col_data.push("");
            }
          }
          cols.push(col_data.slice(1));
        }
        for (i = 0; i <= row_end; i++) {
          row_data = []; //清空接收数据
          for (j = 0; j <= col_end; j++) {
            addr = XLSX.utils.encode_col(j) + XLSX.utils.encode_row(i);
            cell = worksheet[addr];
            if (j == 3) {
              cell.v = moment(cell.v).format("H:M");
            }
            if (cell) {
              row_data.push(cell.v);
            } else {
              row_data.push("");
            }
          }
          rows.push(row_data);
        }
        var rowData = [];
        rows.forEach(function(item, index) {
          if (index > 0) {
            rowData.push(item);
          }
        });
        $this.outColData = cols;
        $this.outRowData = rowData;
        var databox = {};
        databox.outColData = $this.outColData;
        databox.outRowData = $this.outRowData;
        $this.$store.dispatch("printdata/handleClick", databox);
        $this.heavyData(
          $this.outColData[0],
          $this.outColData[9],
          $this.outColData[10]
        );
        $this.handleQueryBtn();
      };
      reader.readAsBinaryString(e);
    },
    //品牌  国家  大洲去重
    heavyData: function(brandData, continentData, countrieData) {
      var brandlist = [];
      var continentslist = [];
      var countrieslist = [];
      brandData.forEach(function(item, index) {
        if ($.inArray(item, brandlist) == -1) {
          brandlist.push(item);
        }
      });
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
      this.InitSearch.brands = brandlist;
      this.InitSearch.continents = continentslist;
      this.InitSearch.countries = countrieslist;
    },
    // 获取过滤筛选条件后的数据
    filterResult: function(initData, searchParam) {
      var filterBrandData = this.filterData(initData, searchParam.brands, 0);
      var filterContinentData = this.filterData(
        filterBrandData,
        searchParam.continents,
        9
      );
      var filterCountryData = this.filterData(
        filterContinentData,
        searchParam.countries,
        10
      );
      var filterData = this.filterDate(
        filterCountryData,
        searchParam.date1,
        searchParam.date2
      );
      return filterData;
    },
    // 过滤国家、大洲、品牌
    filterData: function(initData, itemParam, index) {
      var newData = [];
      if (itemParam.length > 0) {
        initData.forEach(function(item) {
          itemParam.forEach(function(items) {
            if (item[index] == items) {
              newData.push(item);
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
      console.log(val);
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
      } else {
        $this.searchParam.data1 = "";
        $this.searchParam.data2 = "";
      }
      var filebox = {};
      filebox.searchData = $this.searchParam;
      filebox.rowData = $this.filterResult($this.outRowData, $this.searchParam);
      $this.filebox = filebox;
      console.log($this.filebox, "提交筛选数据");
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
    .upload-demo {
      float: left;
      .el-upload {
        float: left;
        .el-button--primary {
          height: 40px;
          background-color: #5ea6fb;
          background-image: linear-gradient(to bottom right, #3ee2db, #5ea6fb);
          border-radius: 5px;
          font-size: 15px;
          color: #fff;
          line-height: 40px;
          padding: 0 15px 0 5px;
          margin-right: 15px;
          &:before {
            background: url(../../assets/images/icon-tb03.png) center no-repeat;
            content: "";
            width: 35px;
            height: 40px;
            display: inline-block;
            vertical-align: top;
          }
        }
      }
      .el-upload__tip {
        float: left;
        font-size: 16px;
        line-height: 40px;
        margin-top: 0px;
      }
      .el-upload-list {
        display: none;
      }
    }
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
