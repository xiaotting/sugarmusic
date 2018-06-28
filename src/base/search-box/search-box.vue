<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
        <i v-show="query" class="icon-dismiss" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from "../../common/js/util";

    export default {
        name: "search-box",
        props:{
            placeholder:{
                type:String,
                default:'搜索歌曲，歌手'
            }
        },
        data(){
            return{
                query:''
            }
        },
        created(){
            this.$watch('query',debounce((newQuery)=>{
                this.$emit('query',newQuery)
            },200))
        },
        methods:{
            clear(){
                this.query = ''
            },
            setQuery(query){
                this.query = query;
            },
            blur(){
                this.$refs.query.blur()
            }
        }
    }
</script>

<style scoped lang="scss">
.search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333;
    border-radius: 6px;
    .icon-search{
        font-size: 24px;
        color: #222;
    }
    .box{
        flex: 1;
        margin: 0 5px;
        line-height: 18px;
        background: #333;
        color: #fff;
        font-size: 14px;
        outline: 0;
        &::placeholder{
            color:rgba(255, 255, 255, 0.3);
        }
    }
    .icon-dismiss{
        font-size: 16px;
        color: #222;
    }
}
</style>