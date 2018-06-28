<template>
	<div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li v-for="(item,index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="search-result" v-show="query">
            <suggest :query = "query" @listScroll="blurInput" @select="saveSearch"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import SearchBox from '@/base/search-box/search-box'
    import {getHotKey} from "../../api/search";
    import {ERR_OK} from "../../api/config";
    import Suggest from '@@/suggest/suggest'
    import {mapActions} from 'vuex'
    export default {
        name:'search',
        components:{SearchBox,Suggest},
        data(){
            return{
                hotKey:[],
                query:''
            }
        },
        created(){
            this._getHotKey()
        },
        methods:{
            _getHotKey(){
                getHotKey().then((res)=>{
                    if(res.code === ERR_OK){
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            addQuery(query){
                this.$refs.searchBox.setQuery(query)
            },
            onQueryChange(query){
                this.query = query
            },
            blurInput(){
                this.$refs.searchBox.blur()
            },
            saveSearch(){
                this.saveSearchHistory(this.query)
            },
            ...mapActions([
                'saveSearchHistory'
            ])
        }
    }
</script>

<style lang="scss" scoped>
    .search{
        .search-box-wrapper{
            margin: 20px;
        }
        .shortcut-wrapper{
            position: fixed;
            top: 178px;
            bottom: 0;
            width: 100%;
            .shortcut{
                height: 100%;
                overflow: hidden;
                .hot-key{
                    margin: 0 20px 20px 20px ;
                    .title{
                        margin-bottom: 20px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                    }
                    .item{
                        display: inline-block;
                        padding: 5px 10px;
                        margin: 0 20px 10px 0;
                        border-radius: 6px;
                        background: #333;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.3);
                    }
                }
                .search-history{
                    position: relative;
                    margin: 0 20px;
                    .title{
                        display: flex;
                        align-items: center;
                        height: 40px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                        .text{
                            flex:1;
                        }
                        .clear{
                            /*extend-click();*/
                            .icon-clear{
                                font-size: 14px;
                                color: rgba(255, 255, 255, 0.3);
                            }
                        }
                    }
                }
            }
        }
        .search-result{
            position: fixed;
            width: 100%;
            top: 178px;
            bottom: 0;
        }
    }
</style>