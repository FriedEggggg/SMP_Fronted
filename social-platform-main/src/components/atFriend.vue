<template>
    <div class="atFriend">
        <ul class="friends" style="background-color: white;">  
            <li v-for="friend in followingList" :key="friend.userId" class="friend">  
                <div class="friend-details">  
                    <img :src="friend.profilePic" alt="Profile Picture" @click="at(friend)"/>  
                    <span class="nickname" @click="at(friend)">{{ friend.nickname }}</span>  
                </div>  
            </li>
        </ul>  
    </div>
</template>

<script>
import { getFollowedUsers } from '../request/friend';
export default {
    name: 'atFriend',
    data() {
        return {
            followingList: [],
        }
    },
    methods: {
        at(friend){
            this.$emit("atFriend", friend);
        }
    },
    mounted() {
      getFollowedUsers()
          .then(res => {
              this.followingList = res.data.data;
          })
    }
}
</script>

<style lang="scss">
.friends {
    display: flex;
    list-style-type: none;   
    padding: 0; 
    margin-top: 10px;
    margin-bottom: 0;
}  
  
.friend {  
    display: block; 
    margin-right: 10px; 
    width: 70px;
}  
.friend-details {  
    display: flex;  
    flex-direction: column; /* 使子元素上下排列 */  
    align-items: center; /* 使子元素在垂直方向上居中对齐 */  
    
    cursor: pointer;
    img {  
        width: 30px;
        height: 30px;
        vertical-align: top;   
        border-radius: 50%;
        object-fit: cover;
    }  
    span {  
        display: inline-block;

    }
}  

</style>