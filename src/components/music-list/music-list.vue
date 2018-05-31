<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" ref="playBtn" v-show="songs.length>0">
                    <i class="icon-play"></i>
                    <span class="text">随机播放歌曲</span>
                </div>
            </div>
            <div class="filter">

            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll
            :data="songs"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            class="list"
            ref="list"
            @scroll="scroll"
        >
            <div class="song-list-wrapper">
                <song-list :songs="songs">

                </song-list>
            </div>
        </scroll>
    </div>
</template>

<script>
    import Scroll from '@/base/scroll/scroll'
    import SongList from '@/base/song-list/song-list'
    import {prefixStyle} from "../../common/js/dom";

    const RESERVER_HEIGHT = 40
    const transform = prefixStyle('transform')
    export default {
        name: "music-list",
        components:{Scroll,SongList},
        props:{
            bgImage:{
                type:String,
                default:''
            },
            songs:{
                type:Array,
                default:[]
            },
            title:{
                type:String,
                default:''
            }
        },
        watch:{
            scrollY(newY){
                let tranlateY  = Math.max(this.minTranslateY,newY)
                let zIndex = 0
                let scale = 1
                this.$refs.layer.style[transform] = `translate3d(0,${tranlateY}px,0)`
                const percent = Math.abs(newY / this.imageHeight)
                if(newY >0 ){
                    scale = 1 + percent
                    zIndex = 10
                }
                if(newY <this.minTranslateY){
                    zIndex =  10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${RESERVER_HEIGHT}px`
                    this.$refs.playBtn.style.display = 'none'
                }else{
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = ''
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style[transform] = `scale(${scale})`
            }
        },
        data(){
            return{
                scrollY:0
            }
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + RESERVER_HEIGHT
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods:{
            back(){
                this.$router.back()
            },
            scroll(pos){
                this.scrollY = pos.y
            }
        },
        computed: {
            bgStyle() {
                return `background-image:url(${this.bgImage})`
            }
        },
    }
</script>

<style scoped lang="scss">
.music-list{
    position: fixed;
    z-index: 100;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:#131212;
    &>.back{
        z-index: 50;
        position: absolute;
        top:10px;
        left:16px;
        &>.icon-back{
            display: block;
            height: 10px;
            width: 10px;
            border: 3px solid #f39a00;
            border-top:3px solid transparent;
            border-right:3px solid transparent;
            transform: rotate(45deg);
        }
    }
    &>.title{
        position: absolute;
        top:10px;
        left:45%;
        z-index: 40;
        font-size: 18px;
    }
    &>.bg-image{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        &>.play-wrapper{
            position: absolute;
            bottom:20px;
            width:100%;
            z-index: 50;
            &>.play{
                box-sizing: border-box;
                width: 135px;
                border-radius: 100px;
                border: 1px solid #f39a00;
                color:#f39a00;
                text-align: center;
                margin: 0 auto;
                padding: 7px 0;
                font-size: 0px;
                &>.text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 12px;
                }
                &>.icon-play{
                    display:inline-block;
                    vertical-align:middle;
                    width:15px;
                    height:15px;
                    border-radius: 50%;
                    border: 1px solid #f39a00;
                    margin-right: 6px;
                }
            }
        }
        &>.filter{
            position: absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:rgba(7,17,27,0.4)
        }
    }
    &>.list{
        position:absolute;
        top:0;
        bottom:0;
        width:100%;
        background:#131212;
        &>.song-list-wrapper{
            padding:20px 30px;
        }
    }
    &>.bg-layer{
        position: relative;
        height: 100%;
        background: #131212;
    }
}
</style>