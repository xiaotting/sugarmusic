<template>
    <dl id="css_illinfo">
        <dt>病例信息</dt>
        <template>
            <dd>
                <ul>
                    <li>
                        <div>
                            <label>照片上传：</label>
                            <ul>
                                <li>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/c9de08b428f27da74e2e6a78ecb8f52a" alt=""></span>
                                        <p>侧面像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/c9de08b428f27da74e2e6a78ecb8f52a" alt=""></span>
                                        <p>正面像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/c9de08b428f27da74e2e6a78ecb8f52a" alt=""></span>
                                        <p>微笑像</p>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/c9de08b428f27da74e2e6a78ecb8f52a" alt=""></span>
                                        <p>45°侧面像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/c9de08b428f27da74e2e6a78ecb8f52a" alt=""></span>
                                        <p>上牙列像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/e5ffd4bc6847789f3aee9f8f1f8ce6b1" alt=""></span>
                                        <p>下牙列像</p>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/e5ffd4bc6847789f3aee9f8f1f8ce6b1" alt=""></span>
                                        <p>口内右侧位像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/b8c59942583795d9e816bba2988e98b4" alt=""></span>
                                        <p>口内正位像</p>
                                    </div>
                                    <div>
                                        <span><img src="https://orthodontics.oss-cn-hangzhou.aliyuncs.com/image/6a56f0d08d3b579293195cc4493fe78c" alt=""></span>
                                        <p>口内左侧像</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <label>其他照片：</label>
                            <ul>
                                <li>
                                    <span v-for="(item,i) in recommends" :key="i">
                                        <img :src="item.picUrl" alt="">
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div>
                            <label>x光上传：</label>
                            <div>
                                <span v-for="(item,i) in recommends" :key="i">
                                    <img :src="item.picUrl" alt="">
                                </span>
                            </div>
                        </div>
                        <div>
                            <label>其他x光上传：</label>
                            <div>
                                <span v-for="(item,i) in recommends" :key="i">
                                    <img :src="item.picUrl" alt="">
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </dd>
        </template>
    </dl>
</template>

<script type="text/javascript">
import {getRecommend,getDiscList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
export default {
    data(){
        return{
            recommends:[],
        }
    },
    mounted(){
        this._getRecommend()
    },
    methods:{
        _getRecommend(){
            getRecommend().then((res)=>{
                if(res.code === ERR_OK){
                    this.recommends=res.data.slider;
                }
            })
        },
    },
}

</script>

<style lang="scss" scoped>
    #css_illinfo{
        &>dd{
            border: 1px solid #dedede;margin-top: 20px;padding: 0px;
            &>ul{
                width: 100%;
                &>li{
                    margin:0px;
                    border: 0px;
                    display: flex;
                    padding:0 20px;
                    position: relative;
                    &:first-of-type{
                        padding: 0 20px 30px 20px;
                        display: flex;
                        flex-direction: column;
                        &>div{
                            display: flex;
                            flex-direction:column;
                            margin-top: 30px;
                            &>label{
                                color: #696969;
                                margin-bottom: 15px;
                            }
                            &:first-of-type{
                                &>ul{
                                    display: flex;
                                    flex-direction: column;
                                    &>li{
                                        margin-top: 10px;
                                        margin-left:0px;
                                        padding: 0px;
                                        border: 0px;
                                        width: 560px;
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: space-between;
                                        &:first-of-type{
                                            margin-top: 0px;
                                        }
                                        &>div{
                                            display: flex;
                                            flex-direction: column;
                                            align-items: center;
                                            &>span{
                                                width: 180px;
                                                height:108px;
                                                overflow: hidden;
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                background:#eee;
                                                border:1px solid #d6dae7;
                                                img{max-width: 180px;max-height: 108px}
                                            }
                                            &>p{
                                                line-height: 40px;
                                                color:#333;
                                            }
                                        }
                                    }
                                }
                            }
                            &:last-of-type{
                                &>ul{
                                    &>li{
                                        display: flex;
                                        flex-wrap: wrap;
                                        &>span{
                                            margin: 10px 10px 0 0;
                                            padding: 0px;
                                            width: 180px;
                                            height:108px;
                                            overflow: hidden;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            background:#eee;
                                            border:1px solid #d6dae7;
                                            img{max-height: 108px;max-width: 180px;}
                                            &:nth-of-type(3n){
                                                margin-right: 0px;
                                            }
                                            &:nth-of-type(-n+3){
                                                margin-top: 0px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        &:before{
                            content: '';
                            width: calc(100% - 40px);
                            border: 1px dashed #dedede;
                            position: absolute;
                            bottom: 0px;
                        }
                    }
                    &:last-of-type{
                        padding-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        &>div{
                            display: flex;
                            flex-direction: column;
                            margin-top: 30px;
                            &>label{
                                color: #696969;
                                margin-bottom: 15px;
                            }
                            &>div{
                                display: flex;
                                width: 560px;
                                max-width: 560px;
                                flex-wrap: wrap;
                                &>span{
                                    margin: 10px 10px 0 0;
                                    padding: 0px;
                                    width: 180px;
                                    height:108px;
                                    overflow: hidden;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    background:#eee;
                                    border:1px solid #d6dae7;
                                    img{max-height: 108px;max-width: 180px;}
                                    &:nth-of-type(3n){
                                        margin-right: 0px;
                                    }
                                    &:nth-of-type(-n+3){
                                        margin-top: 0px;
                                    }
                                }
                            }
                        }
                        &:before{
                            content: '';
                            width: calc(100% - 40px);
                            border: 1px dashed #dedede;
                            position: absolute;
                            bottom: 0px;
                        }
                    }
                }
            }
        }
    }
</style>