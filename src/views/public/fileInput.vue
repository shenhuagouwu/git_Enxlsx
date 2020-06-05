<template>
<input type="file" @change="exportData" accept=".xls,.xlsx" class="input-file">
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
export default {
  name: 'fileInputPage',
  props:{
    outColData:{
      type:Array,
    },
    outRowData:{
      type:Array,
    }
  },
  data:function() {
    return {
      databox:'',
    }
  },
  methods: {
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
        var reader = new FileReader();
        reader.onload =function(ev){
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
            var j,i,addr,cell,cols=[],rows=[],col_data=[],row_data=[];
            for(j=0;j<=col_end;j++){
              col_data=[];//清空接收数据
              for(i=0;i<=row_end;i++){
                    addr = XLSX.utils.encode_col(j) + XLSX.utils.encode_row(i);
                    cell = worksheet[addr];
                    if(j==3){
                      cell.v=moment(cell.v).format('H:M');
                    }
                    if(cell){                           
                        col_data.push(cell.v);
                      }else{
                        col_data.push("");
                    }
              }
              cols.push(col_data.slice(1));                  
            }
            for(i=0;i<=row_end;i++){
              row_data=[];//清空接收数据
              for(j=0;j<=col_end;j++){
                  addr = XLSX.utils.encode_col(j) + XLSX.utils.encode_row(i);
                  cell = worksheet[addr];
                    if(j==3){
                      cell.v=moment(cell.v).format('H:M');
                    }
                  if(cell){                           
                      row_data.push(cell.v);
                    }else{
                      row_data.push("");
                  }
              }
              rows.push(row_data);
            }
            $this.outColData=cols;
            $this.outRowData=rows;
            // console.log($this.outColData);
            // console.log($this.outRowData);
                  
            $this.databox.outColData=$this.outColData;
            $this.databox.outRowData=$this.outRowData;
            $this.$emit('childData',$this.databox);
        }
        reader.readAsBinaryString(files[0]);
    }
  }
}
</script>
<style lang="scss" scoped>
    .input-file{
      display:none;
    }
</style>
