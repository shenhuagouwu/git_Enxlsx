<template>    
    <div class="adminmaintop">
        <p class="adminmaintoplogo"><span><img src="../../assets/images/logo.png" alt=""></span>红星机器后台管理系统</p>
    </div>
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
export default {
    name:"HeaderModule",
}
</script>

<style lang="scss">
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
  }
</style>


