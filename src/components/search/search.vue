<template>
	<div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li v-for="(item,index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                        </h1>
                        <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest :query = "query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
        </div>
        <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
    import SearchBox from '@/base/search-box/search-box'
    import {getHotKey} from "../../api/search";
    import {ERR_OK} from "../../api/config";
    import Suggest from '@@/suggest/suggest'
    import SearchList from "@/base/search-list/search-list"
    import Confirm from '@/base/confirm/confirm'
    import {mapActions,mapGetters} from 'vuex'
    import Scroll from '@/base/scroll/scroll'
    import {playlistMixin,searchMixin} from "../../common/js/mixin";

    export default {
        name:'search',
        components:{SearchBox,Suggest,SearchList,Confirm,Scroll},
        mixins:[playlistMixin,searchMixin],
        data(){
            return{
                hotKey:[],
            }
        },
        watch:{
            query(newQuery){
                if(!newQuery){
                    setTimeout(()=>{
                        this.$refs.shortcut.refresh()
                    },20)
                }
            }
        },
        computed:{
            shortcut(){
                return this.hotKey.concat(this.searchHistory)
            },
            // ...mapGetters([
            //     'searchHistory'
            // ])
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
            showConfirm(){
                this.$refs.confirm.show()
            },
            handlePlaylist(playlist){
                const bottom = playlist.length > 0?'60px':''
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            ...mapActions([
                'clearSearchHistory'
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