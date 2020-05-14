<template>
  <div class="adminmainfr">
    <div class="data-btn">
      <p class="data-import">
        <span>导入数据</span>
        <input type="file" @change="exportData" accept=".xls, .xlsx" class="input-file" />
      </p>
      <div class="data-time">
        <span>时间</span>
        <input name="Time1" type="text" id="Time1" class="searchtime" placeholder="开始时间" />
        <span>-</span>
        <input name="Time2" type="text" id="Time2" class="searchtime" placeholder="截止时间" />
        <input name="submit" type="submit" class="searchbtn" value="查询" />
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
      outColData: [],
      outRowData: [],
      filebox: {},
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
      ]
    };
  },
  methods: {
    // datahand: function(evt) {
    //   // if (evt.added) {
    //   //   console.log(this.listshow);
    //   // }
    // },
    // deleteItem: function(ID) {
    //   var pIndex = 0;
    //   this.listshow.forEach(function(item, index) {
    //     if (item.id == ID) {
    //       pIndex = index;
    //     }
    //   });
    //   this.listshow.splice(pIndex, 1);
    // },
    exportData(e) {
      var $this = this;
      var files = e.target.files;
      if (e.currentTarget.files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
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
        $this.outColData = cols;
        $this.outRowData = rows;
        var databox = {};
        databox.outColData = $this.outColData;
        databox.outRowData = $this.outRowData;
        $this.$store.dispatch("printdata/handleClick", databox);
        $this.filebox.outColData = databox.outColData;
        $this.filebox.outRowData = databox.outRowData;
      };
      reader.readAsBinaryString(files[0]);
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
    p {
      float: left;
      height: 40px;
      background-color: #5ea6fb;
      background-image: linear-gradient(to bottom right, #3ee2db, #5ea6fb);
      border-radius: 5px;
      font-size: 15px;
      color: #fff;
      line-height: 40px;
      padding: 0 15px 0 5px;
      float: left;
      margin-right: 20px;
      cursor: pointer;
      &:before {
        content: "";
        width: 35px;
        height: 40px;
        display: inline-block;
        vertical-align: top;
      }
      &.data-import {
        &:before {
          background: url(../../assets/images/icon-tb03.png) center no-repeat;
        }
        .input-file {
          //display:none;
        }
        span {
          line-height: 24px;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    .data-time {
      float: right;
      span {
        float: left;
        font-size: 14px;
        color: #333;
        line-height: 35px;
        text-align: left;
        padding: 0px 10px;
      }
      .searchtime {
        float: left;
        width: 150px;
        height: 35px;
        line-height: 23px;
        text-align: left;
        font-size: 15px;
        color: #666;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 2px 5px;
      }
      .searchbtn {
        background: #7637eb;
        color: #fff;
        border-radius: 5px;
        font-size: 14px;
        padding: 5px 15px;
        height: 35px;
        line-height: 25px;
        margin-left: 15px;
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
