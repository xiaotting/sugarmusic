<template>
    <scroll class="suggest"
            ref="suggest"
            :data="result"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd = "searchMore"
            @beforeScroll = "listScroll"
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
    import {search} from "../../api/search";
    import {ERR_OK} from "../../api/config";
    import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song';
    import Scroll from '@/base/scroll/scroll'
    import Loading from '@/base/loading/loading'
    import NoResult from '@/base/no-result/no-result'
    import Singer from '@/common/js/singer/'
    import {mapMutations,mapActions} from 'vuex'
    const TYPE_SINGER = 'singer'
    const perpage = 20
    export default {
        name: "suggest",
        components:{Scroll,Loading,NoResult},
        props:{
            query:{
                type:String,
                default:''
            },
            showSinger:{
                type:Boolean,
                default:true
            },
        },
        watch:{
            query(){
                this.search()
            }
        },
        data(){
            return{
                page:1,
                result:[],
                pullup:true,
                hasMore:true,
                beforeScroll:true
            }
        },
        methods:{
            search() {
                this.page = 1
                this.hasMore = true
                this.$refs.suggest.scrollTo(0, 0)
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                  console.log(res)
                    if (res.code === ERR_OK) {
                        this._genResult(res.data).then((result) => {
                            this.result = result
                        })
                        this._checkMore(res.data)
                    }
                })
            },
            searchMore() {
                if (!this.hasMore) {
                    return
                }
                this.page++
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this._genResult(res.data).then((result) => {
                            this.result = this.result.concat(result)
                        })
                        this._checkMore(res.data)
                    }
                })
            },
            _checkMore(data) {
                const song = data.song
                if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
                    this.hasMore = false
                }
            },
            _genResult(data) {
              console.log(data)
                let ret = []
                if (data.zhida && data.zhida.singerid && this.page === 1) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}})
                }
                return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
                    ret = ret.concat(songs)
                    return ret
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((musicData) => {
                    if (isValidMusic(musicData)) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            getIconCls(item) {
                if (item.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                } else {
                    return `${item.name}-${item.singer}`
                }
            },
            selectItem(item){
                if(item.type === TYPE_SINGER){
                    const singer = new Singer({
                        id:item.singermid,
                        name:item.singername
                    })
                    this.$router.push({
                        path:`/search/${singer.id}`
                    })
                    this.setSinger(singer)
                }else{
                    this.insertSong(item)
                }
                this.$emit('select')
            },
            listScroll(){
                this.$emit('listScroll')
            },
            refresh(){
                this.$refs.suggest.refresh()
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>

<style scoped lang="scss">
.suggest{
    height:100%;
    overflow:hidden;
    .suggest-list{
        padding:0 30px;
        .suggest-item{
            display: flex;
            align-items: center;
            padding-bottom: 20px;
        }
        .icon{
            flex:0 0 30px;
            width:30px;
            [class^="icon-"]{
                font-size:14px;
                color:rgba(255, 255, 255, 0.3);
            }
        }
        .name{
            flex:1;
            font-size:14px;
            overflow:hidden;
            .text{
                white-space: nowrap;
                color:rgba(255, 255, 255, 0.3);
            }
        }
    }
    .no-result-wrapper{
        position:absolute;
        width:100%;
        top:50%;
        transform: translateY(-50%);
    }

}
</style>