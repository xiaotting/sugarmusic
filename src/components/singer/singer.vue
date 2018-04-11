<template>
	<div class="singer">歌手页面</div>
</template>

<script>
  import {getSingerList} from "../../api/singer";
  import {ERR_OK} from "../../api/config";

  export default {
      data(){
          return{
              singers:[]
          }
      },
      created(){
          this._getSingerList()
      },
      methods:{
          _getSingerList(){
              getSingerList().then((res)=>{
                  if(res.code == ERR_OK){
                    console.log(res.data.list);
                  }
              })
          }
      }
  }
</script>

<style lang="scss" scoped>
    .singer{
        position: fixed;
        top:80px;
        bottom: 0px;
        width: 100%;
    }
</style>
