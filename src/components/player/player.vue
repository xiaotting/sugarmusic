<template>
    <div class="player" v-show="playlist.length>0">
        <transition
            name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img :src="currentSong.image" width="100%" height="100%">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
                 @touchstart.prevent = "middleTouchStart"
                 @touchmove.prevent = "middleTouchMove"
                 @touchend = "middleTouchEnd"
            >
                <div class="middle-l" ref="middleL">
                    <div class="cd-wraper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img :src="currentSong.image" class="image">
                        </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                        <div class="playing-lyric">{{playingLyric}}</div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p ref="lyricLine"
                               class="text"
                               :class="currentLineNum === index?'current':''"
                               v-for="(line,index) in currentLyric.lines" :key="index"
                            >{{line.txt}}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                    <span class="dot" :class="{'active':currentShow === 'lyric'}">></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange = "onProgressBarChange"></progress-bar>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode">
                        <i :class="iconMode"></i>
                    </div>
                    <div class="icon i-left" :class="disableCls">
                        <i class="icon-prev" @click="prev"></i>
                    </div>
                    <div class="icon i-center" :class="disableCls">
                        <i :class="playIcon" @click="toggleplaying"></i>
                    </div>
                    <div class="icon i-right" :class="disableCls">
                        <i class="icon-next" @click="next"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon-not-favorite"></i>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
                <div class="imgWrapper" :class="cdCls">
                    <img width="40" height="40" :src="currentSong.image">
                </div>
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
                <ProgressCircle :percent="percent">
                    <i :class="miniIcon" @click.stop="toggleplaying" class="icon-mini"></i>
                </ProgressCircle>
            </div>
            <div class="control" @click.stop="showPlaylist">
                <i class="icon-playlist"></i>
            </div>
        </div>
        </transition>
        <playlist ref="playlist"></playlist>
	    <audio
            :src="currentSong.url"
            ref="audio"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end"
        >
	    </audio>
    </div>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import { prefixStyle } from '@/common/js/dom'
    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')
    import ProgressBar from '@/base/progress-bar/progress-bar'
    import ProgressCircle from '@/base/progress-circle/progress-circle'
    import {playMode} from "../../common/js/config";
    import Lyric from 'lyric-parser';
    import Scroll from '@/base/scroll/scroll'
    import playlist from '@@/playlist/playlist'
    import { playerMixin } from '@/common/js/mixin'
    export default {
        name: "player",
        components:{ProgressBar,ProgressCircle,Scroll,playlist},
        mixins: [playerMixin],
        data(){
            return{
                songReady:false,
                currentTime:0,
                currentLyric:null,
                currentLineNum:0,
                currentShow:'cd',
                playingLyric:""
            }
        },
        computed:{
        	cdCls(){
        		return this.playing ? 'play':'play pause'
        	},
        	playIcon(){
        		return this.playing ? 'icon-pause':'icon-play'
        	},
        	miniIcon(){
        		return this.playing ? 'icon-pause-mini':'icon-play-mini'
        	},
            
            disableCls(){
                return this.songReady ? '':'disable'
            },
            percent(){
        	    return this.currentTime / this.currentSong.duration
            },
            ...mapGetters([
                'fullScreen',
                'playing',
                'currentIndex',
            ])
        },
        created(){
            this.touch = {}
        },
        watch:{
        	currentSong(newSong,oldSong){
                if(!newSong.id){
                    return
                }
                if(newSong.id === oldSong.id){
        	        return
                }
                if(this.currentLyric){
                    this.currentLyric.stop()
                }
        		this.$nextTick(()=>{
        			this.$refs.audio.play()
                    this.getLyric()
        		})
        	},
        	playing(newPlaying){
        		setTimeout(()=>{
        			const audio = this.$refs.audio
        			newPlaying ? audio.play():audio.pause()
        		},1000)
        	}
        },
        methods:{
            back(){
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            enter(el, done) {
		        const {x, y, scale} = this._getPosAndScale()
		
		        let animation = {
		          	0: {
		            	transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
		          	},
		          	60: {
		            	transform: `translate3d(0,0,0) scale(1.1)`
		          	},
		          	100: {
		            	transform: `translate3d(0,0,0) scale(1)`
		          	}
		        }
		
		        animations.registerAnimation({
		          	name: 'move',
		          	animation,
		          	presets: {
		            	duration: 400,
		            	easing: 'linear'
		          	}
		        })

        		animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      		},
	      	afterEnter() {
	        	animations.unregisterAnimation('move')
	        	this.$refs.cdWrapper.style.animation = ''
	      	},
	      	leave(el, done) {
	        	this.$refs.cdWrapper.style.transition = 'all 0.4s'
	        	const {x, y, scale} = this._getPosAndScale()
	        	this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
	        	const timer = setTimeout(done, 400)
	        	this.$refs.cdWrapper.addEventListener('transitionend', () => {
	          	clearTimeout(timer)
	          	done()
	        	})
	      	},
	      	afterLeave() {
	        	this.$refs.cdWrapper.style.transition = ''
	        	this.$refs.cdWrapper.style[transform] = ''
	      	},
            _getPosAndScale() {
		        const targetWidth = 40
		        const paddingLeft = 40
		        const paddingBottom = 30
		        const paddingTop = 80
		        const width = window.innerWidth * 0.8
		        const scale = targetWidth / width
		        const x = -(window.innerWidth / 2 - paddingLeft)
		        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
		        return {
		          	x,
		          	y,
		          	scale
		        }
		    },
            toggleplaying(){
                if(!this.songReady){
                    return
                }
            	this.setPlayingState(!this.playing)
                if(this.currentLyric){
                    this.currentLyric.togglePlay()
                }
            },
            prev(){
                if(!this.songReady){
                    return
                }
                if(this.playlist.length ===1){
                    this.loop()
                }else{
                    let index = this.currentIndex - 1
                    if(index === -1){
                        index = this.playlist.length - 1
                    }
                    this.setCurrentIndex(index)
                    if(!this.playing){
                        this.toggleplaying()
                    }
                }
                this.songReady = false
            },
            next(){
                if(!this.songReady){
                    return
                }
                if(this.playlist.length ===1){
                    this.loop()
                }else{
                    let index = this.currentIndex + 1
                    if(index === this.playlist.length){
                        index = 0
                    }
                    this.setCurrentIndex(index)
                    if(!this.playing){
                        this.toggleplaying()
                    }
                }
                this.songReady = false
            },
            end(){
                if(this.mode === playMode.loop ){
                    this.loop()
                }else{
                    this.next()
                }
            },
            loop(){
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                if(this.currentLyric){
                    this.currentLyric.seek(0)
                }
            },
            ready(){
              this.songReady = true
            },
            error(){
                this.songReady = true
            },
            updateTime(e){
                this.currentTime = e.target.currentTime
            },
            format(interval){
                interval =  interval | 0
                const minute = interval / 60 | 0
                const second = this._pad(interval % 60)
                return `${minute}:${second}`
            },
            _pad(num, n = 2){
                let len = num.toString().length
                while(len<n){
                    num = '0' + num
                    len ++
                }
                return num
            },
            onProgressBarChange(percent){
                const currentTime = this.currentSong.duration * percent
                this.$refs.audio.currentTime = currentTime
                if(!this.playing){
                    this.toggleplaying()
                }
                if(this.currentLyric){
                    this.currentLyric.seek(currentTime * 1000)
                }
            },
            
            getLyric(){
                this.currentSong.getLyric().then((lyric)=>{
                    this.currentLyric = new Lyric(lyric,this.handleLyric)
                    if(this.playing){
                        this.currentLyric.play()
                    }
                }).catch(()=>{
                    this.currentLyric = null
                    this.playingLyric = ''
                    this.currentLineNum = 0
                })
            },
            handleLyric({lineNum,txt}){
                this.currentLineNum = lineNum
                if(lineNum > 5){
                    let lineEl = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(lineEl,1000)
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000)
                }
                this.playingLyric = txt;
            },
            middleTouchStart(e){
                this.touch.initiated = true
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
            },
            middleTouchMove(e){
                if(!this.touch.initiated){
                    return
                }
                const touch = e.touches[0]
                const deltaX = touch.pageX -this.touch.startX
                const deltaY = touch.pageY -this.touch.startY
                if(Math.abs(deltaY) > Math.abs(deltaX)){
                    return
                }
                const left = this.currentShow === 'cd' ? 0:-window.innerWidth
                const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left + deltaX))
                this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = 0
                this.$refs.middleL.style.opacity = 1- this.touch.percent
                this.$refs.middleL.style[transitionDuration] = 0
            },
            middleTouchEnd(){
                let offsetWidth
                let opacity
                if(this.currentShow === 'cd'){
                    if(this.touch.percent > 0.1){
                        offsetWidth = -window.innerWidth
                        opacity = 0
                        this.currentShow = 'lyric'
                    }else{
                        offsetWidth = 0
                        opacity = 1
                    }
                }else{
                    if(this.percent < 0.9){
                        offsetWidth = 0
                        this.currentShow = 'cd'
                        opacity = 1
                    }else{
                        offsetWidth = -window.innerWidth
                        opacity = 0
                    }
                }
                const time = 300
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
                this.$refs.middleL.style.opacity = opacity
                this.$refs.middleL.style[transitionDuration] = `${time}ms`
            },
            showPlaylist(){
                this.$refs.playlist.show();
            },
            ...mapMutations({
                setFullScreen:'SET_FULL_SCREEN',
            })
        }
    }
</script>

<style scoped lang="scss">
.normal-player{
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    background: #131212;
    z-index:150;
    &>.background{
        position:absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
    }
    &>.top{
        position: relative;
        margin-bottom: 25px;
        &>.back{
            position: absolute;
            top:0;
            left:6px;
            z-index: 50;
            &>.icon-back{
                display: block;
                padding: 9px;
                font-size: 22px;
                color: #ffcd32;
                transform: rotate(-90deg);
            }
        }
        &>.title{
            width: 70%;
            margin:0 auto;
            line-height: 40px;
            text-align: center;
        }
        &>.subtitle{
            line-height: 20px;
            text-align: center;
            font-size: 14px;
            color: #fff;
        }
    }
    &>.middle{
        position: fixed;
        top:80px;
        bottom:170px;
        width:100%;
        white-space: nowrap;
        font-size: 0;
        &>.middle-l{
            display: inline-block;
            vertical-align: top;
            position: relative;
            width: 100%;
            height:0;
            padding-top: 80%;
            &>.cd-wraper{
                position: absolute;
                left:10%;
                top:0;
                width: 80%;
                box-sizing: border-box;
                height: 100%;
                &>.cd{
                    width: 100%;
                    height:100%;
                    border-radius:50%;
                    &.play{
                    	animation: rotate 20s linear infinite;
                    }
                    &.pause{
                    	animation-play-state: paused;
                    }
                    &>.image{
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border-radius: 50%;
                        border: 10px solid rgba(255, 255, 255, 0.1)
                    }
                }
                &>.playing-lyric-wrapper{
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric{
                        height: 20px;
                        line-height: 20px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5)
                    }
                }
            }
            &>.playing-lyric-wrapper{
                width: 80%;
                margin: 30px auto 0 auto;
                overflow: hidden;
                text-align: center;
                .playing-lyric{
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #fff;
                }
            }
        }
        &>.middle-r{
            display: inline-block;
            vertical-align: top;
            width: 100%;
            height: 100%;
            overflow: hidden;
            &>.lyric-wrapper{
                width: 80%;
                margin: 0 auto;
                overflow: hidden;
                text-align: center;
                .text{
                    line-height: 32px;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 14px;
                    &.current{color:#fff}
                }
                .pure-music{
                    padding-top: 50%;
                    line-height: 32px;
                    color:rgba(255, 255, 255, 0.5);
                    font-size: 14px;
                }
            }
        }
    }
    &>.bottom{
        position:absolute;
        bottom:50px;
        width:100%;
        &>.dot-wrapper{
            text-align: center;
            font-size: 0;
            .dot{
                display: inline-block;
                vertical-align: middle;
                margin: 0 4px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                &.active{
                    width: 20px;
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.8);
                }
            }
        }
        &>.progress-wrapper{
            display: flex;
            align-items: center;
            width: 80%;
            margin: 0px auto;
            padding:10px 0;
            &>.time{
                color:#fff;
                font-size: 12px;
                flex: 0 0 30px;
                width:30px;
                &.time-l{
                    text-align: left;
                }
                &.time-r{
                    text-align: right;
                }
            }
            &>.progress-bar-wrapper{flex:1;}
        }
        &>.operators{
            display: flex;
            align-items: center;
            &>.icon{
                flex: 1;color:#ffcd32;
                i{font-size: 30px}
                &.disable{color: #666}
            }
            &>.i-left{
                text-align:right;
            }
            &>.i-center{
                text-align:center;
                i{font-size:40px;}
            }
            &>.i-right{
                text-align:left;
            }
        }
    }
    &.normal-enter-active,&.normal-leave-active{
        transition: all 0.4s;
        .top,.bottom{
            transition: all 0.4s cubic-bezier(0.86,0.18,0.81,1.32);
        }
    }
    &.normal-enter,&.normal-leave-to{
        opacity: 0;
        .top{
            transform: translate3d(0,-100px,0);
        }
        .bottom{
            transform: translate3d(0,100px,0);
        }
    }
}
.mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
    &>.icon{
        flex:0 0 40px;
        width:40px;
        height: 40px;
        padding:0 10px 0 20px;
        &>.imgWrapper{
            height: 100%;
            width:100%;
            &.play{
            	animation: rotate 20s linear infinite;
            }
            &.pause{
            	animation-play-state: paused;
            }
            img{
                border-radius: 50%;
            }
        }
    }
    &>.text{
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex: 1;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        &>.name{
            margin-bottom: 2px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
            color: #fff;
        }
        &>.desc{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 12px;
            color: hsla(0,0%,100%,.3);
        }
    }
    &>.control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        &>.icon-playlist{
            font-size: 30px;
            color: rgba(255,205,49,.5);
        }
        .icon-play-mini,.icon-pause-mini{
            font-size: 30px;
            color: rgba(255,205,49,.5);
        }
        .icon-mini{
            position: absolute;
            left: 0;
            top:0;
            font-size: 32px;
        }
    }
    &.mini-enter-active,&.mini-leave-active{
        transition: all 0.4s;
    }
    &.mini-enter,&.mini-leave-to{
        opacity: 0;
    }
    @keyframes rotate {
    	0%{
    		transform: rotate(360deg);
    	}
    	100%{
    		transform: rotate(0deg);
    	}
    }
}
</style>