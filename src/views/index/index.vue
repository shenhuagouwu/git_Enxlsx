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
            <admin-left v-bind:outData="outData"></admin-left>
        </div>
        <div class="adminmainfr">
        </div>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
import adminLeft from '../public/adminLeft'
export default {
  name: 'indexPage',
  components:{
    adminLeft,
  },
  data:function(){
    return {
      outData:[]
    }
  },
  methods:{
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
      //background:#21262e;
      height:100%;
      top:0px;
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
