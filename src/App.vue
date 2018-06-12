<template>
  <div id="app">
        <MHeader></MHeader>
        <Tab></Tab>
        <keep-alive>
                <router-view/>
        </keep-alive>
        <player>
        </player>
  </div>
</template>

<script>
import MHeader from '@@/M-Header/M-Header'
import Tab from '@@/tab/tab'
import player from '@@/player/player'
export default {
  name: 'App',
  components:{MHeader,Tab,player},
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
    height: 100%;
    color: #FFFFFF;
}
</style>
