<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="topList" ref="toplist">
            <ul>
                <li class="item" v-for="(item,i) in topList" :key="i" @click="selectItem(item)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname }} - {{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/javascript">
import {getTopList} from "../../api/rank"
import {ERR_OK} from '@/api/config'
import  Scroll from '@/base/scroll/scroll'
import {playlistMixin} from '@/common/js/mixin'
import {mapMutations} from 'vuex'

export default {
    components:{Scroll},
    mixins:[playlistMixin],
    created(){
       this._getTopList()
   },
    data(){
       return{
           topList:[],
       }
    },
    methods:{
        _getTopList(){
            getTopList().then((res)=>{
                if(res.code === ERR_OK){
                    this.topList = res.data.topList
                }
            })
        },
        selectItem(item){
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.setTopList(item)
        },
        handlePlaylist(playlist){
            const bottom = playlist.length >0 ?'60px':''
            this.$refs.rank.style.bottom = bottom
            this.$refs.toplist.refresh()
        },
        ...mapMutations({
            setTopList:'SET_TOP_LIST'
        })
    }
}

</script>

<style lang="scss" scoped>
.rank{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    &>.toplist{
        height:100%;
        overflow: hidden;
        .item{
            display: flex;
            margin: 0 20px;
            padding-top: 20px;
            height: 100px;
            &:last-child{
                padding-bottom: 20px;
            }
            .icon{
                flex: 0 0 100px;
                width: 100px;
                height: 100px;
            }
            .songlist{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 20px;
                height: 100px;
                overflow: hidden;
                background: #333;
                color: rgba(255, 255, 255, 0.3);
                font-size: 12px;
                .song{
                    line-height: 26px;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>