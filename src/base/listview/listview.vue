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
                    <li v-for="(item,index) in group.items" class="list-group-item" :key="index">
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
    export default {
        name: "listview",
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
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target,'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e){
                console.log(e)
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
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateheight()
                },20)
            },
            scrollY(newY){
                const listHeight = this.listHeight
                for (let i=0; i<listHeight;i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i+1]
                    if(!height2 || (-newY > height1 && -newY < height2)){
                        this.currentIndex = i
                        return
                    }
                }
                this.currentIndex = 0
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
            top:26px;
            right: 0px;
            display: flex;
            line-height: 24px;
            z-index: 30;
        }
    }
</style>
