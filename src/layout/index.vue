<template>  
  <div class="adminmain">
    <header-module></header-module>
    <div class="adminmainbom">
        <left-module></left-module>
        <router-view />
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import HeaderModule from './components/HeaderModule';
import LeftModule from './components/LeftModule';
export default {
  name: 'Layout',
  components: {
    HeaderModule,
    LeftModule,
  },
  computed:{
  },
  methods: {
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
  .adminmainbom{
    overflow:hidden;
    height:calc(100% - 95px);
    position:relative;
    padding-left:240px;
  }
}
</style>
