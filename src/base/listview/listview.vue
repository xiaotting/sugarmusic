<template>
    <Scroll class="listview"
            :data="data"
            ref="listview"
            :listenScroll = "listenScroll"
            :probeType = "probeType"
            @scroll = "scroll"
    >
        <ul>
            <li v-for="(group,index) in data" class="list-group" :key="index" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item,index) in group.items" class="list-group-item" :key="index" @click="selectItem(item)">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">
                            {{item.name}}
                        </span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop="onShortcutTouchMove">
            <ul>
                <li v-for="(item,index) in shortcutList" class="item" :key="index" :data-index="index" :class="{'current':currentIndex === index}">{{item}}</li>
            </ul>
        </div>
    </Scroll>
</template>

<script>
    import Scroll from  '../../base/scroll/scroll'
    import {getData} from '../../common/js/dom'
    const ANCHOR_HEIGHT = 24
    import {playlistMixin} from '@/common/js/mixin'
    export default {
        name: "listview",
        mixins:[playlistMixin],
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        created(){
            this.touch = {}
            this.listenScroll = true
            this.probeType = 3
            this.listHeight = []
        },
        components:{
            Scroll
        },
        computed:{
            shortcutList(){
                return this.data.map((group)=>{
                    return group.title.substr(0,1)
                })
            }
        },
        data(){
            return{
                scrollY: -1,
                currentIndex:0,
            }
        },
        methods:{
            selectItem(item){
                this.$emit('select',item)
            },
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target,'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this._scrollTo(anchorIndex)
            },
            scroll(pos){
                this.scrollY = pos.y;
            },
            _scrollTo(index){
                if(!index && index !==0){
                    return
                }
                if(index<0){
                    index = 0
                }else if(index > this.listHeight.length -2){
                    index = this.listHeight.length -2
                }
                this.scrollY = -this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
            },
            _calculateheight(){
                this.listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for(let i=0;i<list.length;i++){
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            handlePlaylist(playlist){
                const bottom = playlist.length >0 ?'60px':''
                this.$refs.listview.$el.style.bottom = bottom
                this.$refs.listview.refresh()
            },
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateheight()
                },20)
            },
            scrollY(newY){
                const listHeight = this.listHeight
                // 当滚动到顶部  newY>0
                if(newY>0){
                    this.currentIndex = 0
                }
                // 在中间部分滚动
                for (let i=0; i<listHeight.length-1;i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i+1]
                    if(-newY >=height1 && -newY < height2){
                        this.currentIndex = i
                        return
                    }
                }
                // 当滚动到底部
                this.currentIndex = listHeight.length -2
            }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="scss">
    .listview{
        height: 100%;
        position: relative;
        padding: 0px 20px;
        overflow: hidden;
        .list-group{
            .list-group-title{
                margin: 20px 0 10px 0;
                line-height: 30px;
                background: rgba(255,255,255,0.1);
            }
            .list-group-item{
                height: 70px;
                display: flex;
                align-items: center;
                .avatar{
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 30px;
                    img{
                        width: 100%;
                    }
                }
                .name{
                    color:#999;
                }

            }
        }
        .list-shortcut{
            position: absolute;
            z-index: 30;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            padding: 20px 0;
            border-radius: 10px;
            text-align: center;
            background: rgba(0,0,0,0.7);
            font-family: Helvetica;
            font-size: 14px;
            .item{
                padding: 3px;
                line-height: 1;
                color: hsla(0,0%,100%,.5);
                font-size: 12px;
            }
            .current{
                color:#f39a00;
            }
        }
    }
</style>
