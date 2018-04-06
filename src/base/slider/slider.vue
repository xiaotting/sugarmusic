<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot>
				
			</slot>
		</div>
		<div class="dots">
			 <span class="dot" v-for="(item,index) in dots" :class="currentPageIndex == index?'active':''"></span>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import {addClass} from '@/common/js/dom'
	export default{
		props:{
			loop:{
				type:Boolean,
				default:true
			},
			autoPlay:{
				type:Boolean,
				default:true
			},
			interval:{
				type:Number,
				default:4000
			}
		},
		mounted(){
			setTimeout(()=>{
				this._setSliderWidth()
				this._initDots()
				this._initSlider()
				if(this.autoPlay){
					this._play()
				}
			},20)
			
			window.addEventListener('resize',()=>{
				if(!this.slider){
					return
				}
				this._setSliderWidth(true)
				this.slider.refresh()
			})
		},
		data(){
			return{
				dots:[],
				currentPageIndex:0,
			}
		},
		methods:{
			_setSliderWidth(isResize){
				this.children = this.$refs.sliderGroup.children
				let width = 0
				let sliderWidth = this.$refs.slider.clientWidth
				for(let i=0;i<this.children.length;i++){
					let child = this.children[i]
					addClass(child,'slider-item')
					child.style.width = sliderWidth + 'px'
					width += sliderWidth
				}
				if(this.loop && !isResize){
					width += 2*sliderWidth
				}
				this.$refs.sliderGroup.style.width = width + 'px'
			},
			_initDots(){
				this.dots = new Array(this.children.length)
			},
			_initSlider(){
				this.slider = new BScroll(this.$refs.slider,{
					scrollX:true,
					scrollY:false,
					momentum:false,
					snap:true,
					snapLoop:this.loop,
					snapThreshold:0.3,
					snapSpeed:400,
					click:true
				})
				
				this.slider.on('scrollEnd',()=>{
					let pageIndex = this.slider.getCurrentPage().pageX
//					if(this.loop){
//						pageIndex -=1
//					}
					this.currentPageIndex = pageIndex
					if(this.autoPlay){
						clearTimeout(this.timer)
						this._play()
					}
				})
			},
			_play(){
				let pageIndex = this.currentPageIndex +1
//				if(this.loop){
//					pageIndex += 1
//				}
				this.timer = setTimeout(()=>{
					this.slider.goToPage(pageIndex,0,400)
				},this.interval)
			}
		},
		destroyed(){
			clearTimeout(this.timer)
		}
	}
</script>

<style lang="scss" scoped="scoped">
.slider{
	position: relative;
	.slider-group{
		display: flex;	
		.slider-item{
			img{width: 100%;}
		}	
	}
	.dots{
		position:absolute;
		display: flex;
		width: 100%;
		justify-content: center;
		align-items:center;
		bottom:10px;
		.dot{
			display: block;
			width:8px;
			height: 8px;
			border-radius: 50%;
			background: #fff;
			margin-left: 8px;
			&.active{
				width:15px;
				border-radius: 10px;
			}
		}
	}
}
	
	
</style>