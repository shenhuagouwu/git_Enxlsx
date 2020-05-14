<template>
  <div>
    <div class="data-show">
      <table class="table-template">
        <tbody>
          <tr>
            <td v-for="(item,index) in brand" v-bind:key="index">{{item}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ant-vanter :arrlist="arrlist" v-if="arrlist.length>0"></ant-vanter>
  </div>
  <!-- <draggable class="module" group="people" :list="listshow" @change="datahand">
          <draggable class="list-group" v-if="listshow.length">
            <div class="list-group-item" v-for="(element,index) in listshow" :key="index">
              <div class="title">
                <h4>{{element.name}}</h4>
                <span class="data-delete" @click.stop="deleteItem(element.id)">x</span>
              </div>
              <p class="text">{{element.text}}</p>
            </div>
          </draggable>
          <div class="no-data" v-else>很抱歉，没有数据可显示！</div>
  </draggable>-->
</template>
<script>
// import { mapGetters } from 'vuex';
import antVanter from "../antVanter/LineChart";
export default {
  name: "timeIntervalPage",
  components: {
    antVanter
  },
  props: ["filebox"],
  data() {
    return {
      brand: [],
      areaData: [],
      newlist: [],
      arrlist: []
    };
  },
  computed: {
    // ...mapGetters([
    //     'databox',
    // ]),
    databox: function() {
      if (this.$store.getters.databox != "") {
        return this.$store.getters.databox;
      } else {
        return "";
      }
    }
  },
  watch: {
    filebox: function(val) {
      if (val != "") {
        var outRowData = "",
          outColData = "";
        console.log(val);
        outColData = val.outColData;
        console.log(outColData);
        outRowData = val.outRowData;
        console.log(outRowData);
        var brandlist = [];
        outColData[0].forEach(function(item, index) {
          //判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
          if ($.inArray(item, brandlist) == -1) {
            brandlist.push(item);
          }
        });
        this.brand = brandlist;
        console.log(this.brand);
        this.initAeraChartData(outRowData);
      }
    }
  },
  mounted() {
    if (this.databox != "") {
      var outRowData = "",
        outColData = "";
      console.log(this.databox);
      outColData = this.databox.outColData;
      console.log(outColData);
      outRowData = this.databox.outRowData;
      console.log(outRowData);
      var brandlist = [];
      outColData[0].forEach(function(item, index) {
        //判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
        if ($.inArray(item, brandlist) == -1) {
          brandlist.push(item);
        }
      });
      this.brand = brandlist;
      console.log(this.brand);
      this.initAeraChartData(outRowData);
    }
  },
  methods: {
    initAeraChartData: function(Data) {
      Data.splice(0, 1);
      //oldjson是把二维数组剔除不需要的数据，并把里面的数组转成对象
      let OldJson = Data.map((item, index) => {
        var newJson = {};
        newJson.name = item[0];
        newJson.time = item[4];
        newJson.number = 1;
        return newJson;
      });
      console.log(OldJson);
      //数组去重然后放在一个新的数组里面
      var hash = {};
      var arrlist = [];
      arrlist = OldJson.reduce(function(item, next) {
        const key = `${next.name}${next.time}`;
        hash[key] ? "" : (hash[key] = true && item.push(next));
        return item;
      }, []);
      console.log(arrlist);

      //把新的数组与之前的数组进行对比如果相同就让number++最后得出vant-v需要的数组

      OldJson.map(function(item, index) {
        arrlist.map(function(item1, index1) {
          if (item.name == item1.name && item.time == item1.time) {
            item1.number++;
          }
        });
      });
      console.log(arrlist);
      this.arrlist = arrlist;
      //
    }
  }
};
</script>
<style lang="scss">
.data-show {
  margin: 30px 0 0;
  .table-template {
    width: 100%;
    max-width: 100%;
    border-collapse: separate;
    tr:nth-child(odd) {
      background: #e8eff9;
      &:nth-child(even) {
        background: #ffffff;
      }
    }
    td,
    th {
      text-align: center;
      padding: 10px;
      line-height: 20px;
      word-break: break-all;
    }
  }
}
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
</style>
