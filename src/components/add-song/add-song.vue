<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide()">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box placeholder="搜索歌曲" @query="onQueryChange" ref="searchBox"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
                <div class="list-wrapper">
                    <scroll v-if="currentIndex===0" :data="playHistory" class="list-scroll" ref="songList">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory" ref="searchList" :refreshDelay="refreshDelay">
                        <div class="list-inner">
                            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :showSinger="showSinger" :query="query" @select="selectSuggest" ref="suggest" @listScroll="blurInput"></suggest>
            </div>
            <top-tip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">1首歌曲已经添加到播放队列</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>

<script>
    import SearchBox from '@/base/search-box/search-box'
    import Suggest from '@@/suggest/suggest'
    import Switches from "@/base/switches/switches"
    import {searchMixin} from "@/common/js/mixin"
    import Scroll from '@/base/scroll/scroll'
    import {mapGetters,mapActions} from 'vuex'
    import SongList from '@/base/song-list/song-list'
    import Song from '@/common/js/song'
    import SearchList from "@/base/search-list/search-list"
    import TopTip from '@/base/top-tip/top-tip'
    export default {
        name: "add-song",
        components:{SearchBox,Suggest,Switches,Scroll,SongList,SearchList,TopTip},
        mixins:[searchMixin],
        props:{

        },
        computed:{
            ...mapGetters([
                'playHistory'
            ])
        },
        data(){
            return {
                showFlag:false,
                showSinger:false,
                currentIndex:0,
                switches:[
                    {name:'最近播放'},
                    {name:'搜索历史'}
                ]
            }
        },
        methods:{
            show(){
                this.showFlag = true;
                setTimeout(()=>{
                    if(this.currentIndex === 0){
                        this.$refs.songList.refresh()
                    }else{
                        this.$refs.searchList.refresh()
                    }
                })
            },
            hide(){
                this.showFlag = false;
            },
            switchItem(index){
                this.currentIndex = index
            },
            selectSuggest(){
                this.saveSearch()
                this.showTip()
            },
            selectSong(song,index){
                if (index !== 0) {
                    this.insertSong(new Song(song))
                    this.showTip()
                }
            },
            showTip(){
                this.$refs.topTip.show()
            },
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>

<style scoped lang="scss">
.add-song{
    position:fixed;
    top:0;
    bottom: 0;
    width:100%;
    z-index: 200;
    background: #222;
    &.slide-enter-active,&.slide-leave-active{
        transition:all 0.3s
    }
    &.slide-enter,&.slide-leave-to{
        transform: translate3d(100%,0,0);
    }
    .header{
        position: relative;
        height: 44px;
        text-align: center;
        .title{
            line-height: 44px;
            font-size: 18px;
            color: #fff;
        }
        .close{
            position:absolute;
            top:0;
            right:8px;
            .icon-close{
                display: block;
                padding:12px;
                font-size: 20px;
                color:#ffcd32;
            }
        }
    }
    .search-box-wrapper{
        margin: 20px;
    }
    .shortcut{
        .list-wrapper{
            position: absolute;
            top: 165px;
            bottom: 0;
            width: 100%;
            .list-scroll{
                height: 100%;
                overflow: hidden;
                .list-inner{
                    padding:20px 30px;
                }
            }
        }
    }
    .search-result{
        position: fixed;
        top: 124px;
        bottom: 0;
        width: 100%;
    }
    .tip-title{
        text-align: center;
        padding: 18px 0;
        font-size: 0;
        .icon-ok{
            font-size: 14px;
            color: #ffcd32;
            margin-right: 4px;
        }
        .text{
            font-size: 14px;
            color: #fff;
        }
    }
}
</style>