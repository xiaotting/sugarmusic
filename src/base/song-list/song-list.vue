<template>
    <div class="song-list">
        <ul>
            <li v-for="(song,index) in songs" class="item" @click="selectItem(song,index)" :key="index">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "song-list",
        props:{
            songs:{
                type:Array,
                default:[]
            }
        },
        methods:{
            selectItem(item,index){
                this.$emit('select',item,index)
            },
            getDesc(song){
                return `${song.singer}·${song.album}`
            }
        }
    }
</script>

<style scoped lang="scss">
.song-list{
    margin-bottom: 40px;
    .item{
        display: flex;
        align-item:center;
        box-sizing: border-box;
        height:64px;
        font-size:14px;
        &>.content{
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            &>.name{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #fff;
            }
            &>.desc{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 4px;
                color: #999;
            }
        }
    }
}
</style>