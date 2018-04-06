<template>
	<div class="recommend">
		<div class="recommend-content">
			<div class="slider-wrapper" v-if="recommends.length">
				<slider>
					<div v-for="item in recommends">
						<a :href="item.linkUrl"><img :src="item.picUrl" alt="" /></a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import {getRecommend} from '@/api/recommend'
	import Slider from '@/base/slider/slider'
	import {ERR_OK} from '@/api/config'
	export default {
		mounted(){
			this._getRecommend();
		},
		components:{Slider},
		data(){
			return{
				recommends:[],
			}
		},
		methods:{
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code === ERR_OK){
						this.recommends=res.data.slider;
					}
				})
			}
		}
	}
</script>

<style>
</style>