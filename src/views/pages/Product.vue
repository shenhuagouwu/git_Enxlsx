<template>
  <div class="content-box">
      <div class="data-operation">
        <div class="data-btn">
          <p class="data-import">导入数据</p>
          <p class="data-delete">删除数据</p>
        </div>
        <div class="data-show">
          <table class="table-template">
            <tbody>
              <tr>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
              </tr>
              <tr>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
              </tr>
              <tr>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
              </tr>
              <tr>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
                <td>主要设备</td>
                <td>数量</td>
                <td>设备工艺</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <draggable class="module" group="people" :list="listshow" @change="datahand">
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
      </draggable>
    </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "Product",
  components:{
    draggable
  },
  data () {
    return {
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
    }
  },
  methods: {
    datahand: function(evt) {
      // if (evt.added) {
      //   console.log(this.listshow);
      // }
    },
    deleteItem: function(ID) {
      var pIndex = 0;
      this.listshow.forEach(function(item, index) {
        if (item.id == ID) {
          pIndex = index;
        }
      });
      this.listshow.splice(pIndex, 1);
    }
  }
};
</script>

<style>
.content-box {
  width: 100%;
  height: 100%;
  padding: 0 20px 0 60px;
}
.content-box .data-operation {
  margin: 30px 0;
}
.content-box .data-operation .data-btn {
  overflow: hidden;
}
.content-box .data-operation .data-btn p {
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
}
.content-box .data-operation .data-btn p::before {
  content: "";
  width: 35px;
  height: 40px;
  display: inline-block;
  vertical-align: top;
}
.content-box .data-operation .data-btn .data-import::before {
  background: url(../../assets/images/icon-tb03.png) center no-repeat;
}
.content-box .data-operation .data-btn .data-delete::before {
  background: url(../../assets/images/icon-tb04.png) center no-repeat;
}
.content-box .data-operation .data-show {
  margin: 30px 0 0;
}
.content-box .data-operation .data-show .table-template {
    width: 100%;
    max-width: 100%;
    border-collapse: separate;
}
.content-box .data-operation .data-show .table-template tr:nth-child(odd) {
  background: #e8eff9;
}
.content-box .data-operation .data-show .table-template tr:nth-child(even) {
  background: #ffffff;
}
.content-box .data-operation .data-show .table-template td, .content-box .data-operation .data-show .table-template th {
    text-align: center;
    padding: 10px;
    line-height: 20px;
    word-break: break-all;
}
.content-box .module {
  width: 100%;
  min-height: 360px;
  background: #fff;
  border-radius: 10px;
  margin: 30px 0;
  overflow: hidden;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}
.content-box .module .no-data {
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
.content-box .module .list-group {
  overflow: hidden;
}
.content-box .module .list-group .list-group-item {
  width: 50%;
  background: #fff;
  float: left;
  border-right: 1px solid #ecf1f7;
  border-bottom: 1px solid #ecf1f7;
  transition: all ease 0.5s;
}
.content-box .module .list-group .list-group-item:nth-child(odd):last-child {
  width: 100%;
}
.content-box .module .list-group .list-group-item .title {
  padding: 20px;
  border-bottom: 1px solid #ecf1f7;
  position: relative;
}
.content-box .module .list-group .list-group-item .title h4 {
  font-size: 14px;
  color: #333;
  position: relative;
}
.content-box .module .list-group .list-group-item .title h4::before {
  content: "";
  width: 6px;
  height: 18px;
  border-radius: 10px;
  background: #3881f0;
  margin-right: 10px;
  display: inline-block;
  vertical-align: sub;
}
.content-box .module .list-group .list-group-item .data-delete {
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
.content-box .module .list-group .list-group-item .text {
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  line-height: 300px;
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
