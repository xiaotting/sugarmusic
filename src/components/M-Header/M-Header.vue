<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">Sugar music</h1>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped="scoped">
.m-header{
	width:100%;
	height:44px;
	background: #131212;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	&>.icon{background: url(../../common/image/default/default.png) no-repeat center center; width:30px;height:32px;background-size: 100%;}
	&>.text{color:#f75314;font-size: 18px; font-weight: bold; margin-left: 8px;}
}
</style>