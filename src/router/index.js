import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import Rank from '@@/rank/rank'
import Recommend from '@@/recommend/recommend'
import Search from '@@/search/search'
import Singer from '@@/singer/singer'
import SingerDetail from '@@/singer-detail/singer-detail'
Vue.use(Router)

export default new Router({
  	routes: [
  		{
			path:'/',
			redirect:'/recommend'
		},
		{
			path:'/rank',
			component:Rank
		},
		{
			path:'/recommend',
			component:Recommend
		},
		{
			path:'/search',
			component:Search
		},
		{
			path:'/singer',
			component:Singer,
            children:[
                {
                    path:':id',
                    component:SingerDetail,
                }
            ]
		}
  	]
})
