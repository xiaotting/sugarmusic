<template>
    <div class="search-list" v-show="searches.length">
        <transition-group name="list" tag="ul">
            <li class="search-item" v-for="(item,index) in searches" :key="item" @click="selectItem(item)">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: "search-list",
        props:{
            searches:{
                type:Array,
                default:[]
            }
        },
        created(){
        },
        methods:{
            selectItem(item){
                this.$emit('select',item)
            },
            deleteOne(item){
                this.$emit('delete',item)
            }
        }
    }
</script>

<style scoped lang="scss">
.search-list{
    .search-item{
        display: flex;
        align-items: center;
        height: 40px;
        overflow: hidden;
        &.list-enter-active,&.list-leave-active{
            transition: all 0.1s;
        }
        &.list-enter,&.list-leave-to{
            height:0;
        }
        .text{
            flex: 1;
            color:rgba(255, 255, 255, 0.5);
        }
        .icon{
            /*extend-click();*/
            .icon-delete{
                font-size: 12px;
                color:rgba(255, 255, 255, 0.3)
            }
        }
    }
}
</style>