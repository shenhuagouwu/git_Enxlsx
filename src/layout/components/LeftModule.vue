<template>
  <div class="adminmainfl">
    <ul class="adminmainflmain">
      <li
        v-for="(item,index) in leftNavList"
        v-bind:class="[item.isOn?'on':'',item.ismain?'mainnav':'']"
        v-bind:key="index"
        v-on:click="changeType(item.type)"
      >
        <router-link tag="span" v-bind:to="item.url">{{item.name}}</router-link>
      </li>
    </ul>
    <!-- <div class="choice-box" v-bind:class="isOpen?'is-open':''">
              <draggable
                tag="ul"
                class="list-ul"
                :options="{sort: false, group: {name: 'people', pull:'clone',put: false}}"
              >
                <li class="list-li" v-for="(item,index) in childList" :key="index">{{ item }}</li>
              </draggable>
          </div>
          <div class="choice-show" @click="choicetoggle" v-bind:class="isOpen?'is-open':''">
            <span></span>
    </div>-->
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
export default {
  name: "LeftModule",
  components: {
    draggable
  },
  data: function() {
    return {
      isOpen: false,
      leftNavList: [
        {
          id: 1,
          type: "Googleinquiry",
          name: "谷歌询盘分析",
          isOn: false,
          ismain: true,
          url: "/index",
          pid: 0
        },
        {
          id: 2,
          type: "Timeperiodanalysis",
          name: "时段分析",
          isOn: true,
          ismain: false,
          url: "/index/time",
          pid: 1,
          children: {
            childtnum: 1,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 5,
          type: "Dateanalysis",
          name: "日期分析",
          isOn: false,
          ismain: false,
          url: "/index/dateTime",
          pid: 1,
          children: {
            childtnum: 4,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 6,
          type: "Productanalysis",
          name: "产品分析",
          isOn: false,
          ismain: false,
          url: "/index/product",
          pid: 1,
          children: {
            childtnum: 5,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 7,
          type: "Sourcemodeanalysis",
          name: "来源方式分析",
          isOn: false,
          ismain: false,
          url: "/index/sourcemode",
          pid: 1,
          children: {
            childtnum: 6,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 8,
          type: "Channelanalysis",
          name: "渠道分析",
          isOn: false,
          ismain: false,
          url: "/index/Channel",
          pid: 1,
          children: {
            childtnum: 7,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 9,
          type: "Sourceanalysis",
          name: "来源分析",
          isOn: false,
          ismain: false,
          url: "/index/Source",
          pid: 1,
          children: {
            childtnum: 8,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
          id: 10,
          type: "Firstlevelanalysis",
          name: "首次等级分析",
          isOn: false,
          ismain: false,
          url: "/index/Firstlevel",
          pid: 1,
          children: {
            childtnum: 9,
            childtime: "拖拽时段",
            childcountry: "拖拽国家",
            childcontinent: "大洲时段"
          }
        },
        {
            id:11,
            type:'groupcomparison',
            name:'组员对比分析',
            isOn:false,
            ismain:false,
            url:"/index/team",
            pid:1,
            children:{
              childtnum:10,
              childtime:'拖拽时段',
              childcountry:'拖拽国家',
              childcontinent:'大洲时段'
            }
          }
      ],
      childList: []
    };
  },
  beforeCreate: function() {
    var $this = this;
    $this.$nextTick(function() {
      var types = $this.type;
      if (types == "Googleinquiry") {
        types = "Timeperiodanalysis";
      }
      $this.leftNavList.forEach(function(item, index) {
        if (item.type == types) {
          item.isOn = true;
          $this.childList = item.children;
        } else {
          item.isOn = false;
        }
      });
    });
  },
  computed: {
    ...mapGetters(["editorType"]),
    type: function() {
      return this.editorType;
    }
  },
  methods: {
    changeType(value) {
      var $this = this;
      var typeValue = value;
      if (typeValue == "Googleinquiry") {
        typeValue = "Timeperiodanalysis";
      }
      $this.leftNavList.forEach(function(item, index) {
        if (item.type == typeValue) {
          item.isOn = true;
          var children;
          $this.childList = item.children;
        } else {
          item.isOn = false;
        }
      });
      $this.$store.dispatch("leftnav/changeType", typeValue);
    },
    choicetoggle: function() {
      var $this = this;
      $this.isOpen = !$this.isOpen;
    }
  }
};
</script>
<style lang="scss">
.adminmainfl {
  position: absolute;
  left: 0px;
  width: 240px;
  background: #21262e;
  height: 100%;
  top: 0px;
  padding-top: 0px;
  & > .adminmainflmain {
    clear: both;
    display: block;
    li {
      clear: both;
      display: block;
      span {
        clear: both;
        display: block;
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: 40px;
        color: #8090ab;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        &:hover {
          background: #2f343c;
          color: #959da9;
          &:after {
            content: "";
            position: absolute;
            left: 0px;
            top: 0px;
            bottom: 0px;
            width: 2px;
          }
        }
      }
      &.mainnav {
        background: #121417;
        color: #959da9;
        span {
          padding-left: 20px;
          font-weight: bold;
          &:hover {
            background: #121417;
            color: #959da9;
          }
          &:after {
            content: "";
            position: absolute;
            left: 0px;
            top: 0px;
            bottom: 0px;
            width: 2px;
          }
        }
      }
      &.on {
        span {
          background: #2f343c;
          color: #959da9;
          &:after {
            content: "";
            position: absolute;
            left: 0px;
            top: 0px;
            bottom: 0px;
            width: 2px;
          }
        }
      }
    }
    .active {
      background: #191c22;
    }
  }
  .choice-box {
    width: 0;
    height: 100%;
    background: #7637eb;
    position: absolute;
    left: 240px;
    top: 0;
    bottom: 0;
    z-index: 10;
    word-break: keep-all;
    transition: all 0.3s linear;
    overflow: hidden;
    &.is-open {
      width: 150px;
      border-left: 1px solid #9d71ef;
    }
    .list-ul {
      width: 149px;
      height: 100%;
      padding: 20px 15px 0px;
      overflow: hidden;
      li {
        font-size: 15px;
        color: #c6a9fd;
        text-align: left;
        line-height: 24px;
        cursor: move;
        padding: 10px 0px 10px 0px;
        border-bottom: 1px solid #9d71ef;
      }
    }
  }
  .choice-show {
    width: 48px;
    height: 48px;
    background-color: #7637eb;
    right: -48px;
    position: absolute;
    right: -48px;
    top: 97px;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    z-index: 1;
    word-break: keep-all;
    -webkit-transition: all 0.3s linear;
    transition: all 0.3s linear;
    span {
      width: 100%;
      height: 100%;
      display: block;
      position: relative;
      &::before {
        content: "";
        width: 16px;
        height: 16px;
        border-top: 3px solid #fff;
        border-right: 3px solid #fff;
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -8px 0 0 -11px;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        transition: all 0.3s linear;
      }
    }
    &.is-open {
      right: -198px;
      span {
        -moz-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        transform: scaleX(-1);
        /*IE*/
        filter: FlipH;
      }
    }
  }
}
</style>