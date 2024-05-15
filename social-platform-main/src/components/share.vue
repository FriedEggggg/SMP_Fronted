<template>
    <div className="share">
        <div className="container">
            <div className="top">
                <div className="left">
                    <img :src="currentUser.profilePic" alt="" />
                    <input type="text" :placeholder="`${currentUser.nickname}, 你有什么新鲜事?`" v-model="content" />
                </div>
                <div class="at" style="margin-right: 10px;">
                    <span v-if="friendName">@{{ friendName }}</span>
                </div>
                <div className="right">
                    <img v-if="imageUrl" className="file" alt="file" :src="imageUrl" />
                </div>
            </div>
            <div class="middle">
                <div class="loc">
                    <img v-if="location" :src="Loc" alt="Loc" />
                    <span v-if="location">{{ location }}</span>
                </div>
            </div><hr />
            <div className=" bottom">
                <div className="left">
                    <input type="file" id="file" :style="{ display: `none` }" @change="changeHandler" />
                    <label htmlFor="file">
                        <div className="item">
                            <img :src="Image" alt="Image" />
                            <span>添加图片</span>
                        </div>
                    </label>
                    <label for="location">
                        <div className="item" >
                            <img :src="Map" alt="Map" />
                            <button type="button" @click="showModal = true">添加定位</button>
                        </div> 
                        <!-- 调用map模态框 -->
                        <mapModal :visible.sync="showModal" @mapModal="closeModal" @mapLocation="addLocation">                             
                        </mapModal>
                    </label>
                    <div className="item">
                        <img :src="Friend" alt="Friend" />
                        <button type="button" @click="showFriModal = !showFriModal">@好友</button>
                    </div>              
                </div>
                <div className="right">
                    <a-button type="primary" @click="shareHandler" :disabled="!content">
                        发表
                    </a-button>
                </div>
                    <a-button  @click="clear">重置</a-button>
            </div>
            <atFriend v-if="showFriModal" @atFriend="addFriend"></atFriend>
        </div>
    </div>
</template>

<script>
import Image from "../assets/img.png";
import Map from "../assets/map.png";
import Friend from "../assets/friend.png";
import Loc from "../assets/location.png";
import { upload } from '../request/request';
import { share, getAllPost } from "../request/post";
import mapModal from './mapModal.vue';
import atFriend from "./atFriend.vue";
import { mapState } from 'vuex';

export default {
    name: 'share',
    components: {
        mapModal,
        atFriend  
    },   
    data() {
        return {
            Image,
            Map,
            Friend,
            Loc,
            file: "",
            imageUrl: "",
            content: "",
            location: "",
            showModal: false,
            friendId:"0",
            friendName:"",
            showFriModal: false,
        }
    },
    computed: {
        ...mapState({
            currentUser: state => state.currentUser
        })
        
    },
    methods: {
        changeHandler(e) {
            this.file = e.target.files[0];
            this.imageUrl = URL.createObjectURL(this.file);
        },
        async shareHandler() {
            const formData = new FormData();
            formData.append('desc', this.content);
            let res;
            if (this.file) {
                formData.append('img', this.file);
                res = await upload(formData);
                this.imageUrl = res.data.data.url;
            }
                        formData.append('location', this.location); 
            formData.set('friendId', this.friendId);
            formData.set('img', this.imageUrl);
            console.log("imageUrl:"+this.imageUrl);
            await share(formData);
            res = await getAllPost();
            this.$store.commit("setHomePosts", res.data.data);
            this.clear()
        },
        clear(){
            this.content = ""
            this.imageUrl = ""
            this.location = ""
            this.friendId = "0"
            this.friendName = ""
        },
        closeModal(data){
            this.showModal = data
        },
        addLocation(data){
            this.location = data
        },
        addFriend(data){
            this.friendId = data.userId
            this.friendName = data.nickname
            this.showFriModal = false
        },
    }
}
</script>

<style lang="scss">
@import "../style.scss";

.share {
    @include themify($themes) {
        -webkit-box-shadow: 0px 0px 25px -10px rgba(0, 0, 0, 0.38);
        -moz-box-shadow: 0px 0px 25px -10px rgba(0, 0, 0, 0.38);
        box-shadow: 0px 0px 25px -10px rgba(0, 0, 0, 0.38);
        border-radius: 20px;
        background-color: themed("bg");
        color: themed("textColor");
        margin-bottom: 20px;

        .container {
            padding: 20px;

            .top {
                display: flex;
                align-items: center;

                .left {
                    display: flex;
                    flex: 3;
                    align-items: center;

                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    input {
                        border: none;
                        outline: none;
                        padding: 20px 10px;
                        background-color: transparent;
                        width: 60%;
                        color: themed("textColor");
                    }
                }

                .right {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;

                    .file {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 0px;
                    }
                }
            }

            .middle{
                font-size: 13px;
                color: gray;
                margin: 10px 0px;
                img {
                        width: 25px;
                        height: 25px;
                        margin-right: 3px;
                }

            }

            hr {
                margin: 20px 0px;
                border: none;
                height: 0.5px;
                background-color: themed("border");
            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left {
                    display: flex;
                    align-items: center;
                    gap: 20px;

                    .item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        cursor: pointer;

                        img {
                            height: 25px;
                        }

                        span {
                            font-size: 12px;
                            color: gray;
                        }

                        button {
                            font-size: 12px;
                            color: gray;
                            border-style: none;
                            background-color: white;                            
                            cursor: pointer;
                            padding: 1px;
                        }
                    }
                }

                .right {
                    button {
                        border: none;
                        padding: 5px;
                        color: white;
                        cursor: pointer;
                        background-color: #5271ff;
                        border-radius: 3px;
                        width: 60px;
                        margin-left: 30px;
                    }
                }
            }
        }
    }
}
</style>