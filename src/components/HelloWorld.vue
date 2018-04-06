<template>
  <div class="hello">
	   <ul class="tabs">
	   		<li>首页</li>
	   		<li>我的</li>
	   		<li>购物车</li>
	   </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
*{
	margin: 0px;
	padding:0px;
}
	.tabs{
		display: flex;
		height:80px;
		width:100%;
		list-style: none;
		justify-content: space-between;
		li{
			color:#f00;
			font-size: 18px;
			font-weight: bold;
		}
	}
</style>
