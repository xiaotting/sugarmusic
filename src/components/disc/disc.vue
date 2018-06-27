<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from '@@/music-list/music-list'
    import {mapGetters} from 'vuex'
    import {getSongList} from "../../api/recommend"
    import {createSong, isValidMusic, processSongsUrl} from "../../common/js/song"
    import {ERR_OK} from '@/api/config'
    export default {
        name: "disc",
        components:{MusicList},
        data(){
            return{
                songs:[]
            }
        },
        created(){
            this._getSongList()
        },
        computed:{
            title(){
                return this.disc.dissname
            },
            bgImage(){
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        methods:{
            _getSongList(){
                if(!this.disc.dissid){
                    this.$router.push('/recommend')
                    return
                }
                getSongList(this.disc.dissid).then((res)=>{
                    if(res.code === ERR_OK){
                        processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
                            this.songs = songs
                        })
                    }
                })
            },
            _normalizeSongs(list){
                let ret = []
                list.forEach((musicData)=>{
                    if (isValidMusic(musicData)) {
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        }
    }
</script>

<style scoped lang="scss">
.slide-enter-active,.slide-leave-active{
    transition: all 0.3s;
}
.slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
}
</style>