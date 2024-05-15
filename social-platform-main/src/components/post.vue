<template>
    <div className="post" ref="post">
        <div className="container">
            <div className="user">
                <div className="user-info">
                    <img :src="post.profilePic" />
                    <div className="details">
                        <router-link :to="`/profile/${post.userId}`">
                            <span className='name'>{{ post.name }}</span>
                        </router-link>
                        <span className='date'>
                            {{ post.date }}
                        </span>
                    </div>
                </div>
                <a-dropdown placement="bottom" v-if="post.userId === currentUser.userId">
                    <div class="more">
                        <EllipsisOutlined />
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <div class="delete" @click="deleteHandler">
                                    删除
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div className="content">
                <p>{{ post.content }}</p>
                <router-link v-if="post.friendId!=0" :to="`/profile/${post.friendId}`">
                    <span >@{{ friendName }}</span>
                </router-link>
                <img :src="post.img" alt="" />    
                <div class="loc">
                    <img v-if="post.location" :src="Loc" alt="Loc" />
                    <span v-if="post.location" display:block>{{ post.location }}</span>
                </div>            
            </div>
            <div className="info">
                <div className="item" @click="likeHandler">
                    <heart-outlined v-if="isLike" :style="{ color: 'red' }" />
                    <heart-outlined v-else />
                    <span>
                        {{ likeNum }} 点赞
                    </span>
                </div>
                <div className="item" @click="() => openComment = !openComment">
                    <i className="iconfont comments">&#xe6ad;</i>
                    <span>
                        {{ commentNum }} 评论
                    </span>
                </div>
                <div className="item" @click="starHandler">
                    <star-filled v-if="post.isStaring" :style="{ color: `red` }" />
                    <star-outlined v-else />
                    <span>
                        收藏
                    </span>
                </div>
                <div className="item" @click="showModal">
                    <ShareAltOutlined/>
                    <span>
                        分享
                    </span>
                </div>
            </div>
            <div class="share">
                <!-- <a-button type="primary" @click="showModal">Open Modal</a-button> -->
                <a-modal :visible="open" title="我的好友" @ok="handleOk" @cancel="handleCancel" class="share-box" cancel-text="取消" ok-text="确认">
                    <div class="search-box">
                        <a-input-search placeholder="搜索好友..." enter-button @search="onSearch" />
                    </div>
                    <div class="list">
                        <div class="friend-item" v-for="friend in searchFriendList" :key="friend.id">
                            <div class="image"><a-avatar :src="friend.profilePic" /></div>
                            <div class="nickname">{{friend.nickname}}</div>
                            <div class="share-btn" @click="shareToFriend(friend.userId)">
                                <a-button type="primary" v-if="!shareTmp[friend.userId]">分享</a-button>
                                <a-button type="primary" disabled v-else>已分享</a-button>
                            </div>
                        </div>
                    </div>
                </a-modal>
            </div>
            <Comment v-if="openComment" :postId="post.postId" @send="sendHandler" :userId="post.userId"
                @delete="deleteCommentHandler" />
        </div>
    </div>
</template>

<script>
import Comment from './comment.vue';
import {
    EllipsisOutlined, HeartOutlined, ShareAltOutlined,
    StarOutlined, StarFilled
} from '@ant-design/icons-vue';
import { like, cancelLike, deletePost, getAllPost, getPostByUserId } from '../request/post';
import { addHistory } from '../request/history';
import { star, cancelStar } from '../request/post';
import { getProfileData } from '../request/profile';
import { mapState } from 'vuex';
import { getFollowedUsers } from '../request/friend';
import { sendMessage } from '../request/chat';
import Loc from "../assets/location.png";

export default {
    props: ['post'],
    data() {
        return {
            openComment: false,
            likeNum: this.post.likeNum || 0,
            isLike: this.post.isLike,
            commentNum: this.post.commentNum,
            open:false,
            isShared:true,
            friendList:[],
            searchFriendList:[],
            shareTmp:{},
            Loc,
            friendInfo: "",
            friendName: ""
        }
    },
    computed: {
        ...mapState({
            currentUser: state => state.currentUser
        })
    },
    async created() {  
        if (this.post.friendId !== 0) {  
            try {  
                this.friendInfo = await getProfileData(this.post.friendId);   
                this.friendName = this.friendInfo.data.data.nickname
                console.log(this.friendInfo);  
            } catch (error) {  
                console.error('Error fetching friend info:', error);  
            }  
        }  
    },  
    methods: {
        likeHandler() {
            if (this.isLike) {
                this.likeNum -= 1;
                cancelLike(this.post.postId)
            } else {
                this.likeNum += 1;
                like(this.post.postId)
            }
            this.isLike = !this.isLike;
        },
        async deleteHandler() {
            await deletePost(this.post.postId);
            let res;
            console.log(this.$route.path.includes("profile"));
            if (this.$route.path.includes("profile")) {
                res = await getPostByUserId(this.$store.state.currentUser.userId);
            } else {
                res = await getAllPost();
            }

            this.$store.commit("setHomePosts", res.data.data);
        },
        sendHandler() {
            this.commentNum++;
        },
        deleteCommentHandler() {
            this.commentNum--;
        },
        starHandler() {
            if (this.post.isStaring) {
                this.post.isStaring = false;
                cancelStar(this.post.postId);
            } else {
                this.post.isStaring = true;
                star(this.post.postId).then(res => {
                    console.log(res);
                });
            }
        },
        onSearch(searchKey){
            console.log(searchKey)
            if(searchKey.trim()==""){
                this.searchFriendList = [...this.friendList]
                return
            }
            this.searchFriendList.length = 0
            console.log(this.friendList);
            this.friendList.forEach(friend=>{
                console.log(friend.nickname,friend.nickname.indexOf(searchKey));
                if(friend.nickname.indexOf(searchKey)!=-1){
                    this.searchFriendList.push(friend)
                }
            })
        },
        showModal(){
            this.open = true;
            this.shareTmp = {}
        },
        handleOk(){
            this.open = false;
        },
        handleCancel(){
            this.open = false;
            this.isShared = true;
        },
        async shareToFriend(id) {
            this.shareTmp[id]=true
            //todo 分享实现
            let {data} = await sendMessage(id,"$%^&*??share---"+this.post.postId)
            if(data.code==1)console.log("分享成功！");
        },
        async getFiendList() {
            let {data} = await getFollowedUsers()
            if(data.code==1){
                this.friendList = data.data
                this.searchFriendList = [...this.friendList]
            }
        }
    },
    components: {
        Comment,
        EllipsisOutlined,
        HeartOutlined,
        ShareAltOutlined,
        StarOutlined,
        StarFilled
    },
    mounted() {
        this.getFiendList()
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 当元素进入视口范围时触发
                    addHistory(this.post.postId);
                }
            });
        });
        observer.observe(this.$refs.post);        
    },
}
</script>

<style lang="scss">
@import '../style.scss';

@font-face {
    font-family: 'iconfont';
    /* Project id 3591478 */
    src: url('//at.alicdn.com/t/c/font_3591478_qgl1ezx8v2r.woff2?t=1679556339249') format('woff2'),
        url('//at.alicdn.com/t/c/font_3591478_qgl1ezx8v2r.woff?t=1679556339249') format('woff'),
        url('//at.alicdn.com/t/c/font_3591478_qgl1ezx8v2r.ttf?t=1679556339249') format('truetype');
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}

.post {
    @include themify($themes) {
        -webkit-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
        -moz-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
        box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
        border-radius: 20px;
        background-color: themed("bg");
        color: themed("textColor");


        a {
            color: inherit;
        }

        .container {
            padding: 20px;

            .user {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;

                .user-info {
                    display: flex;
                    gap: 20px;

                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    .details {
                        display: flex;
                        flex-direction: column;

                        .name {
                            font-weight: 500;
                        }

                        .date {
                            font-size: 12px;
                        }
                    }
                }

                .more {
                    width: 20px;
                    height: 20px;
                    font-size: 20px;
                    cursor: pointer;
                }

                .delete {
                    height: 30px;
                    line-height: 30px;
                    width: 40px;
                    color: #999;
                }

                button {
                    position: absolute;
                    top: 30px;
                    right: 0;
                    border: none;
                    background-color: red;
                    color: white;
                    cursor: pointer;
                    padding: 5px;
                }
            }

            .content {
                margin: 20px 0;

                img {
                    width: 100%;
                    max-height: 500px;
                    object-fit: contain;
                    margin-top: 20px;
                }
                .loc{
                    margin-top: 5px;
                    img {
                        width: 22px;
                        height: 22px;
                        margin-right: 5px;
                    }
                    span{
                        position: absolute;
                        border: 10px;
                        margin-top: 18px;
                    }
                }
            }

            .info {
                display: flex;
                align-items: center;
                gap: 20px;

                .item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-size: 14px;
                }
            }
           
        }

    }
}
.list {
    height: 100%;
    width: 100%;
    .friend-item {
        position: relative;
        display: flex;
        height: 43px;
        width: 100%;
        margin-bottom: 10px;
        margin-top: 10px;
        padding-top: 10px;
        .nickname {
            margin-left: 20px;
        }
    }
    .share-btn {
        cursor: pointer;
        position: absolute;
        right: 0;
        
    }
}
::v-deep(.ant-btn-primary) {
    color: #caa6ff!important;
    size: 200px;
}
</style>