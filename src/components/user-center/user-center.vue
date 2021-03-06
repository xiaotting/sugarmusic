<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper">
                <switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></switches>
            </div>
            <div class="play-btn" ref="playBtn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll v-if="currentIndex===0" :data="favoriteList" class="list-scroll" ref="favoriteList">
                    <div class="list-inner">
                        <song-list :songs="favoriteList" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <scroll class="list-scroll" v-if="currentIndex===1" :data="playHistory" ref="playList">
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="selectSong"></song-list>
                    </div>
                </scroll>
            </div>
            <div class="no-result-wrapper" v-show="noResult">
                <no-result :title="NoResultDesc"></no-result>
            </div>
        </div>
    </transition>
</template>

<script>
    import Switches from '@/base/switches/switches'
    import {mapGetters,mapActions} from 'vuex'
    import Scroll from '@/base/scroll/scroll'
    import SongList from '@/base/song-list/song-list'
    import Song from '@/common/js/song'
    import {playlistMixin} from "../../common/js/mixin";
    import NoResult from '@/base/no-result/no-result'

    export default {
        name: "user-center",
        mixins:[playlistMixin],
        components:{Switches,Scroll,SongList,NoResult},
        computed:{
            noResult(){
                if(this.currentIndex === 0){
                    return !this.favoriteList.length
                }else{
                    return !this.playHistory.length
                }
            },
            NoResultDesc(){
                if(this.currentIndex === 0){
                    return '暂无收藏歌曲'
                }else{
                    return '您还没听过歌曲'
                }
            },
            ...mapGetters([
                'playHistory',
                'favoriteList'
            ])
        },
        data(){
            return {
                currentIndex:0,
                switches:[
                    {name:'我最喜欢的'},
                    {name:'最近听的'}
                ]
            }
        },
        methods:{
            back(){
                this.$router.back()
            },
            switchItem(index){
                this.currentIndex = index
            },
            selectSong(song){
                this.insertSong(new Song(song))
            },
            random(){
                let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
                if (list.length === 0) {
                    return
                }
                list = list.map((song)=>{
                    return new Song(song)
                })
                this.randomPlay({
                    list
                })
            },
            handlePlaylist(playlist){
                const bottom = playlist.length > 0?'60px':''
                this.$refs.listWrapper.style.bottom = bottom
                this.$refs.favoriteList && this.$refs.favoriteList.refresh()
                this.$refs.playList && this.$refs.playList.refresh()
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        }
    }
</script>

<style scoped lang="scss">
.user-center{
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #222;
    &.slide-enter-active, &.slide-leave-active{
        transition: all 0.3s
    }
    &.slide-enter, &.slide-leave-to{
        transform: translate3d(100%, 0, 0)
    }
    .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
            display: block;
            padding: 10px;
            font-size: 22px;
            color: #ffcd32;
        }
    }
    .switches-wrapper{
        margin: 10px 0 30px 0
    }
    .play-btn{
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid  rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.5);
        border-radius: 100px;
        font-size: 0;
        .icon-play{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: 16px;
        }
        .text{
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
        }
    }
    .list-wrapper{
        position: absolute;
        top:110px;
        bottom: 0;
        width:100%;
        .list-scroll{
            height:100%;
            overflow: hidden;
            .list-inner{
                padding:20px 30px;
            }
        }
    }
    .no-result-wrapper{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>