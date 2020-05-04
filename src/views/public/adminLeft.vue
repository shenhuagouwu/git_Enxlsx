<template>
    <ul>              
      <li v-for="(item,index) in outData" :key="index">
        <span>{{item[0]}}</span>
      </li>
    </ul>
</template>
<script>
export default {
  name: 'adminLeft',
  props:{
    outData:{
      type:Array,
    }
  },
  data:function(){
    return{
    }
  },
}
</script>
<style lang="scss">
</style>
