<!--
 * @Author: your name
 * @Date: 2020-05-14 16:27:38
 * @LastEditTime: 2020-05-19 10:59:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \git_Enxlsx\src\layout\components\HeaderModule.vue
--> 
<template>    
    <div class="adminmaintop">
        <p class="adminmaintoplogo"><span><img src="../../assets/images/logo.png" alt=""></span>英文推广数据分析系统</p>
    </div>
</template>
<script>
export default {
    name:"HeaderModule",
}
</script>
<style lang="scss">
  .adminmaintop{
    overflow:hidden;
    background: #21262e;
    padding:20px 30px 20px 30px;
    .adminmaintoplogo{
      float:left;
      color:#fff;
      font-size:18px;
      line-height:32px;
      span{
        display: block;
        float:left;
        height: 32px;
        margin-right:10px;
        img{
          display: block;
          height: 100%;
        }
      }
    }
  }
</style>


