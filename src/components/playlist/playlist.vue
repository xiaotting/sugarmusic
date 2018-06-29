<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon"></i>
                        <span class="text"></span>
                        <span class="clear">
                        <i class="icon-clear"></i>
                    </span>
                    </h1>
                </div>
                <scroll class="list-content" :data="sequenceList" ref="listContent">
                    <ul>
                        <li class="item" v-for="(item,index) in sequenceList" :key="index" @click="selectItem(item,index)" ref="listItem">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like"><i class="icon-not-favorite"></i></span>
                            <span class="delete"><i class="icon-delete"></i></span>
                        </li>
                    </ul>
                </scroll>
                <div class="list-operate">
                    <div class="add">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'
    import {playMode} from "../../common/js/config";
    import Scroll from '@/base/scroll/scroll'
    export default {
        name: "playlist",
        components:{Scroll},
        data(){
            return{
                showFlag:false
            }
        },
        computed:{
            ...mapGetters([
                'sequenceList',
                'currentSong',
                'playlist',
                'mode',
            ])
        },
        watch:{
            currentSong(newSong,oldSong){
                if(!this.showFlag || newSong.id === oldSong){
                    return
                }
                this.scrollToCurrent(newSong)
            }
        },
        methods:{
            show(){
                this.showFlag = true
                setTimeout(()=>{
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                },20)
            },
            hide(){
                this.showFlag = false
            },
            getCurrentIcon(item){
                if(this.currentSong.id === item.id){
                    return 'icon-play'
                }
                return ''
            },
            selectItem(item,index){
                if(this.mode === playMode.random){
                    index = this.playlist.findIndex((song)=>{
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(current){
                const index = this.sequenceList.findIndex((song)=>{
                    return current.id === song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
            },
            ...mapMutations({
                setCurrentIndex:'SET_CURRENT_INDEX',
                setPlayingState:'SET_PLAYING_STATE'
            })
        }
    }
</script>

<style scoped lang="scss">
.playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.3);
    &.list-fade-enter-active,&.list-fade-leave-active{
        transition: opacity 0.3s;
        .list-wrapper{
            transition: all 0.3s;
        }
    }
    &.list-fade-enter,&.list-fade-leave-to{
        opacity: 0;
        .list-wrapper{
            transform: translate3d(0,100%,0);
        }
    }
    .list-wrapper{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #333;
        .list-header{
            position: relative;
            padding: 20px 30px 10px 20px;
            .title{
                display: flex;
                align-items: center;
                .icon{
                    margin-right: 10px;
                    font-size: 30px;
                    color: rgba(255, 205, 49, 0.5);
                }
                .text{
                    flex: 1;
                    font-size: 14px;
                    color:rgba(255, 255, 255, 0.3);
                }
                .clear{
                    .icon-clear{
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.3);
                    }
                }
            }
        }
        .list-content{
            max-height: 240px;
            overflow: hidden;
            .item{
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;
                &.list-enter-active, &.list-leave-active{
                    transition: all 0.1s
                }
                &.list-enter, &.list-leave-to{
                    height: 0
                }
                .current{
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: 12px;
                    color: rgba(255, 205, 49, 0.5);
                }
                .text{
                    flex: 1;
                    white-space: nowrap;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.3);
                }
                .like{
                    margin-right: 15px;
                    font-size: 12px;
                    color: #ffcd32;
                    .icon-favorite{
                        color: #d93f30
                    }
                }
                .delete{
                    font-size: 12px;
                    color: #ffcd32;
                }
            }
        }
        .list-operate{
            width: 140px;
            margin: 20px auto 30px auto;
            .add{
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 100px;
                color: rgba(255, 255, 255, 0.5);
                .icon-add{
                    margin-right: 5px;
                    font-size: 10px;
                }
                .text{
                    font-size: 12px;
                }
            }
        }
        .list-close{
            text-align: center;
            line-height: 50px;
            background: #222;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>