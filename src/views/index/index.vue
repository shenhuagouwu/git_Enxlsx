<template>
  <div class="adminmain">
    <div class="adminmaintop">
        <p class="adminmaintoplogo"><span><img src="../../assets/images/logo.png" alt=""></span>红星机器后台管理系统</p>
        <p class="adminmaintopsearch">          
          <a @click="handleClick">导入xlsx文件</a>
          <input  type="file" @change="exportData" accept=".xls,.xlsx" class="input-file">
        </p>
    </div>
    <div class="adminmainbom">
        <div class="adminmainfl">
            <!-- <admin-left v-bind:outData="outData"></admin-left> -->
          <div class="nav-box">
            <ul class="nav">
              <li v-for="(item, index) in nav" :class="{ active : actives === index }" :key="index" @click="contact(index, item.path), actives = index">
                {{item.title}}
              </li>
            </ul>
          </div>
          <div class="choice-box" v-bind:class="isOpen?'is-open':''">
              <draggable
                tag="ul"
                class="list-ul"
                v-bind:list="lists"
                :options="{sort: false, group: {name: 'people', pull:'clone',put: false}}"
              >
                <li class="list-li" v-for="element in lists" :key="element.id">{{ element.name }}</li>
              </draggable>
              <div class="choice-show" @click="choicetoggle">
                <span></span>
              </div>
          </div>
        </div>
        <div class="adminmainfr">
           <router-view></router-view>
        </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import XLSX from 'xlsx'
import moment from 'moment'
import adminLeft from '../public/adminLeft'
export default {
  name: 'indexPage',
  components:{
    adminLeft,
    draggable
  },
  order: 2,
  data:function(){
    return {
      actives: 0,
      currentChildren:[],
      nav: [
        { 
          title: '产品分类', 
          path: '/Product' ,
          isOn:true
        },
        { title: '新闻分类', path: '/News',isOn:false },
        { title: '问答分类', path: '/Wenda',isOn:false },
        { title: '视频分类', path: '/Video',isOn:false }
      ],
      lists: [
        {
          id: 1,
          name: "1月询盘",
          text: "100"
        },
        {
          id: 2,
          name: "2月询盘",
          text: "200"
        },
        {
          id: 3,
          name: "3月询盘",
          text: "300"
        },
        {
          id: 4,
          name: "4月询盘",
          text: "400"
        },
        {
          id: 5,
          name: "5月询盘",
          text: "500"
        }
      ],
      outData:[],
      isOpen: false
    }
  },
  methods:{
    contact(index, path){
      this.actives = index;
      this.$router.push(path)
    },
    choicetoggle: function() {
      var $this = this;
      $this.isOpen = !$this.isOpen;
    },
    handleClick() {
      document.querySelector('.input-file').click()
    },
    exportData (e) {
        var $this=this;
        var files = e.target.files;
        if(e.currentTarget.files.length<=0){//如果没有文件名
            return false;
        }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
            this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
            return false;
        } 
        // 用FileReader来读取
        var fileReader = new FileReader();
        fileReader.onload = (ev) => {
            try {
                var data = ev.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary',
                    cellDates: true
                });
                var wsname = workbook.SheetNames[0];//取第一张表                
                var worksheet = workbook.Sheets[wsname]; //获取工作表
                var range = XLSX.utils.decode_range(worksheet['!ref']);
                //保存数据范围数据
                var row_end = range.e.r;
                var col_end = range.e.c;
                var j,i,addr,cell,cols=[],col_data=[],nameTit,nameary=[],nameary=[];
                for(j=0;j<=col_end;j++){
                   col_data=[];//清空接收数据
                   for(i=0;i<=row_end;i++){
                        addr = XLSX.utils.encode_col(j) + XLSX.utils.encode_row(i);
                        cell = worksheet[addr];
                        if(i==0){
                          nameTit=cell.v;
                        }else{
                          if(j==1){
                            cell.v=moment(cell.v).format('YYYY-MM-DD');
                          }
                          if(j==3){
                            cell.v=moment(cell.v).format('H:M');
                          }
                        }
                        if(cell){                           
                            col_data.push(cell.v);
                          }else{
                            col_data.push("");
                        }
                   }
                   cols.push(col_data);
                   //nameary.push(nameTit);//表格标题名字
                }
                //console.log($this.xlsxName);
                //console.log(cols);
            } catch (e) {
                return false;
            }            
            //var itemData = {};
            //品牌\日期 \星期\时间\时间段\产品\客户搜索字词\来源方式\来源渠道\大洲\来源国家\来源设备\组员名字\首次等级\反馈情况\标题名字
            // var Brand=[],Sourcesdate=[],Sourcesweek=[],Sourcestime=[],PeriodTime=[],product=[],CustomerSearchTerms=[],SourceWay=[],SourcesChannel=[],SourceContinent=[],SourceCountrie=[],SourceDevice=[],TeamName=[],FirstGrade=[],Feedback=[],xlsxName=[];
            // itemData.Brand=cols[0].slice(1);                //品牌
            // itemData.Sourcesdate=cols[1].slice(1);          //日期
            // itemData.Sourcesweek=cols[2].slice(1);          //星期
            // itemData.Sourcestime=cols[3].slice(1);          //时间
            // itemData.PeriodTime=cols[4].slice(1);           //时间段
            // itemData.product=cols[5].slice(1);              //产品
            // itemData.CustomerSearchTerms=cols[6].slice(1);  //客户搜索字词
            // itemData.SourceWay=cols[7].slice(1);            //来源方式
            // itemData.SourcesChannel=cols[8].slice(1);       //来源渠道
            // itemData.SourceContinent=cols[9].slice(1);      //大洲
            // itemData.SourceCountrie=cols[10].slice(1);      //来源国家
            // itemData.SourceDevice=cols[11].slice(1);        //来源设备
            // itemData.TeamName=cols[12].slice(1);            //组员名字
            // itemData.FirstGrade=cols[13].slice(1);          //首次等级
            // itemData.Feedback=cols[14].slice(1);            //反馈情况
            // itemData.xlsxName=nameary;                      //标题名字
            // $this.outData.push(itemData);
            $this.outData=cols;
            console.log($this.outData);
        };
        fileReader.readAsBinaryString(files[0]);
    }
  }
}
</script>
<style lang="scss">
#app{
  clear:both;
  display:block;
  height:100%;
}
.adminmain{
  clear:both;
  display:block;
  overflow:hidden;
  height:100%;
  .adminmaintop{
    overflow:hidden;
    @include gradient-horizontal(#f13331,#f13331, #7637eb);
    padding:15px 30px 20px 30px;
    .adminmaintoplogo{
      float:left;
      color:#fff;
      font-size:27px;
      line-height:56px;
      span{
        float:left;
        width:80px;
        margin-right:15px;
      }
    }
    .adminmaintopsearch{
      float: right;
      margin-top:15px;
      .input-file{
        display:none;
      }
      a{
        float: right;
        border-radius: 5px;
        line-height:24px;
        text-align: center;
        background: #fff;
        color: #7637eb;
        font-size: 18px;
        padding:5px 15px;
        cursor: pointer;
        &:hover{
          @include gradient-horizontal(#fa0,#fa0, #fc0);
          color:#4c04d0;
        }
      }
    }
  }
  .adminmainbom{
    overflow:hidden;
    height:calc(100% - 95px);
    position:relative;
    padding-left:240px;
    .adminmainfl{
      position:absolute;;
      left:0px;
      width:240px;
      background-color: #5ea6fb;
      background-image: -webkit-gradient(linear, left top, left bottom, color-stop(20%, #5ea6fb), to(#3ee2db));
      background-image: linear-gradient(#5ea6fb 20%, #3ee2db);
      height:100%;
      top:0px;
      .nav-box{
        .nav{
          li{
            width: 100%;
            font-size: 15px;
            color: #fff;
            line-height: 50px;
            padding: 0 20px;
            cursor: pointer;
            position: relative;
            &.active{
              background-color: #2a82f1;
              background-image: linear-gradient(to right, #2a82f1, #3881f0);
              box-shadow: 0 5px 5px #276ae7 inset;
            }
            &::before{
              content: "";
              width: 50px;
              background: url(../../assets/images/icon-tb01.png) center no-repeat;
              background-size: 15px;
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
            }
          }
        }
      }
      .choice-box {
      width: 0;
      height: 100%;
      background-color: #5ea6fb;
      background-image: linear-gradient(#5ea6fb 20%, #3ee2db);
      position: absolute;
      left: 240px;
      top: 0;
      bottom: 0;
      z-index: 10;
      word-break: keep-all;
      transition: all 0.3s linear;
      }
      .choice-box.is-open {
      width: 150px;
      border-left: 1px solid rgba(255, 255, 255, 0.5);
      }
      .choice-box .list-ul {
      width: 100%;
      height: 100%;
      overflow: hidden;
      }
      .choice-box .list-ul li {
      font-size: 15px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      cursor: move;
      }
      .choice-show {
      width: 48px;
      height: 48px;
      background-color: #5ea6fb;
      background-image: linear-gradient(to right, #5fa6fb, #3ee2db);
      right: -48px;
      position: absolute;
      right: -48px;
      top: 97px;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
      }
      .choice-show span {
      width: 100%;
      height: 100%;
      display: block;
      position: relative;
      }
      .choice-show span::before {
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
      .choice-box.is-open .choice-show span {
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
      /*IE*/
      filter: FlipH;
      }
    }  
    .adminmainfr{
      clear:both;
      display:block;
      width:100%;
      position: relative;
      height: 100%;
      overflow:hidden;
      overflow-y: auto;
    }
  }
}
</style>
