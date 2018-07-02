<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">Sugar music</h1>
        <router-link to="/user" class="mine" tag="div">
            <i class="icon-mine"></i>
        </router-link>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped="scoped">
.m-header{
    position: relative;
    height: 44px;
    text-align: center;
    color: #ffcd32;
    font-size: 0;
	&>.icon{
        background: url(../../common/image/default/default.png) no-repeat;
        display: inline-block;
        vertical-align: top;
        margin-top: 6px;
        width: 30px;
        height: 32px;
        margin-right: 9px;
        background-size: 30px 32px
    }
	&>.text{
        display: inline-block;
        vertical-align: top;
        line-height: 44px;
        font-size: 18px;
    }
    &>.mine{
        position: absolute;
        top: 0;
        right: 0;
        .icon-mine{
            display: block;
            padding: 12px;
            font-size: 20px;
            color: #ffcd32;
        }
    }
}
</style>