<template>
    <div class="box">
        <div class="ring-outer"></div>
        <div class="ring-inner"></div>
        <div class="avatar"></div>
    </div>
</template>

<script type="text/javascript">
import {getRecommend,getDiscList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
export default {
    // data(){
    //     return{
    //         recommends:[],
    //     }
    // },
    // mounted(){
    //     this._getRecommend()
    // },
    // methods:{
    //     _getRecommend(){
    //         getRecommend().then((res)=>{
    //             if(res.code === ERR_OK){
    //                 this.recommends=res.data.slider;
    //             }
    //         })
    //     },
    // },
}

</script>

<style lang="scss" scoped>
   .box{
       position: relative;width:220px;height:220px;
       display: flex;justify-content: center;
       align-items: center;
       &>.ring-inner{
           height:220px;width:220px; background: url("http://www.imaoda.com/s/img/tpl/ring-inner.png") no-repeat;
           background-size: 90%; background-position:center;position: absolute;
           animation: clockwise 3s linear infinite;
       }
       &>.ring-outer{
           height:220px; width:220px; background: url("http://www.imaoda.com/s/img/tpl/ring-outer.png") no-repeat;
           background-size:100%; background-position:center;position: absolute;
           animation: anti-clockwise 3s linear infinite;
       }
       &>.avatar{
           height: 160px;width:160px;border-radius:50%; background-size: cover;
           background-image:url(http://www.imaoda.com/s/img/lessons/92.jpg);

       }
   }
    @keyframes clockwise {
        100%{
            transform: rotate(360deg);
        }
    }
   @keyframes anti-clockwise {
       0%{
           transform: rotate(360deg);
           width:230px;height:230px;
       }
   }
</style>