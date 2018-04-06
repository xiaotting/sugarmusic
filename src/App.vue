<template>
  <div id="app">
  		<MHeader></MHeader>
  		<Tab></Tab>
  		<keep-alive>
  				<router-view/>
  		</keep-alive>
    	
  </div>
</template>

<script>
import MHeader from '@@/M-Header/M-Header'
import Tab from '@@/tab/tab'
export default {
  name: 'App',
  components:{MHeader,Tab},
}
</script>

<style>
body{
	margin: 0px;
	background: #131212;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:#fff;
}
</style>
