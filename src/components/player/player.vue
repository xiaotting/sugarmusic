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
            <div class="middle">
                <div class="middle-l">
                    <div class="cd-wraper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img :src="currentSong.image" class="image">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="operators">
                    <div class="icon i-left">
                        <i class="icon-sequence"></i>
                    </div>
                    <div class="icon i-left">
                        <i class="icon-prev"></i>
                    </div>
                    <div class="icon i-center">
                        <i :class="playIcon" @click="toggleplaying"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon-next"></i>
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
                <i :class="miniIcon" @click.stop="toggleplaying"></i>
            </div>
            <div class="control">
                <i class="icon-playlist"></i>
            </div>
        </div>
        </transition>
	    <audio :src="currentSong.url" ref="audio">
	    	
	    </audio>
    </div>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import { prefixStyle } from '@/common/js/dom'
    export default {
        name: "player",
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
            ...mapGetters([
                'fullScreen',
                'playlist',
                'currentSong',
                'playing'
            ])
        },
        watch:{
        	currentSong(){
        		this.$nextTick(()=>{
        			this.$refs.audio.play()
        		})
        		
        	},
        	playing(newPlaying){
        		this.$nextTick(()=>{
        			const audio = this.$refs.audio
        			newPlaying ? audio.play():audio.pause()
        		})
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
            	this.setPlayingState(!this.playing)
            },
            ...mapMutations({
                setFullScreen:'SET_FULL_SCREEN',
                setPlayingState:'SET_PLAYING_STATE'
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
                        border: 10px solid hsla(0,0%,100%,.1);
                    }
                }
            }
        }
    }
    &>.bottom{
        position:absolute;
        bottom:50px;
        width:100%;
        &>.operators{
            display: flex;
            align-items: center;
            &>.icon{
                flex: 1;color:#ffcd32;
                i{font-size: 30px}
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
        &>.icon-play-mini,.icon-pause-mini{
            font-size: 30px;
            color: rgba(255,205,49,.5);
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
    	},
    	100%{
    		transform: rotate(0deg);
    	}
    }
}
</style>