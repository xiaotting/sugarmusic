<template>
	<div class="recommend" ref="recommend">
		<scroll ref="scroll" class="recommend-content" :data="discList">
			<div>
				<div v-if="recommends.length" class="slider-wrapper">
			        <div class="slider-content">
			            <slider ref="slider">
			              	<div v-for="item in recommends">
			                	<a :href="item.linkUrl">
			                  		<img  :src="item.picUrl" @load="loadImage">
			                	</a>
			              	</div>
			            </slider>
			        </div>
			    </div>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul ref="rec">
						<li class="item" v-for="item in discList">
							<div class="icon">
								<img v-lazy="item.imgurl" alt="" />
							</div>
							<div class="text">
								<h2 class="desc">{{item.dissname}}</h2>
								<p class="name">{{item.creator.name}}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</scroll>
	</div>
</template>

<script type="text/javascript">
	import {getRecommend,getDiscList} from '@/api/recommend'
	import Slider from '@/base/slider/slider'
	import {ERR_OK} from '@/api/config'
	import scroll from '@/base/scroll/scroll'
    import {playlistMixin} from '@/common/js/mixin'
    export default {
        mixins:[playlistMixin],
        created(){
			this._getRecommend();
			this._getDiscList()
		},
		activated() {
		    setTimeout(() => {
		        this.$refs.slider && this.$refs.slider.refresh()
		    }, 20)
		},
		components:{Slider,scroll},
		data(){
			return{
				recommends:[],
				discList:[],
			}
		},
		methods:{
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code === ERR_OK){
						this.recommends=res.data.slider;
					}
				})
			},
			_getDiscList() {
		        getDiscList().then((res) => {
		          	if (res.code === ERR_OK) {
		            	this.discList = res.data.list;
		          	}
		        })
		    },
		    loadImage() {
		        if (!this.checkloaded) {
		          	this.checkloaded = true
		          	setTimeout(() => {
		            	this.$refs.scroll.refresh()
		          	}, 20)
		        }
		    },
            handlePlaylist(playlist){
                const bottom = playlist.length >0 ?'60px':''
                this.$refs.rec.style.marginBottom = bottom
            },
		}
	}
</script>

<style lang='scss' scoped="scoped">
.recommend{
	position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: hidden;
}
.recommend-content{
	height: 100%;
	overflow: hidden;
	.recommend-list{
	width: 100%;
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
        &>ul{
            width: 100%;
            .list-title{
                color:#f75314
            }
            .item{
                display: flex;
                align-item:center;
                margin: 10px 10px 0 20px;
                .icon{
                    width: 60px;
                    img{
                        width: 100%;
                    }
                }
                .text{
                    line-height: 30px;
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    margin-left: 20px;
                    width: calc(100% - 110px);
                    .desc{
                        color:#FFFFFF;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .name{
                        color:#666666;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}


</style>
