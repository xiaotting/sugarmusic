<template>
	<div class="tab">
		<router-link tag="div" to="/recommend" class="tab-item">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link tag="div" to="/singer" class="tab-item">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link tag="div" to="/rank" class="tab-item">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link tag="div" to="/search" class="tab-item">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped>
.tab{
	display: flex;
	font-size: 14px;
	height: 44px;
	line-height: 44px;
	.tab-item{
		flex:1;
		text-align: center;
		.tab-link{
			color:#fff;
			padding-bottom:5px;
		}
		&.router-link-active{
			.tab-link{
				color:#f75314;
				border-bottom: 2px solid #f75314;
			}
		}
	}
}
</style>