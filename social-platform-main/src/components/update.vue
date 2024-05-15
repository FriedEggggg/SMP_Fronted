<template>
    <div class="update">
        <div class="wrapper">
            <h1>更新你的个人信息</h1>
            <div className="files">
                <label htmlFor="cover">
                    <span>封面</span>
                    <div class="imgContainer">
                        <img :src="computedCover" />
                    </div>
                </label>
                <input type="file" id="cover" :style="{ display: `none` }" @change="(e) => cover = e.target.files[0]" />
                <label htmlFor="profile">
                    <span>头像</span>
                    <div class="imgContainer">
                        <img :src="computedProfile" />
                    </div>
                </label>
                <input type="file" id="profile" :style="{ display: `none` }" @change="(e) => profile = e.target.files[0]" />
            </div>

            <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @finish="finishHandler">
                <a-form-item label="昵称">
                    <a-input v-model:value="formState.nickname" />
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item label="城市">
                    <a-input v-model:value="formState.userLocation" />
                </a-form-item>
                <a-form-item label="语言类型">
                    <a-input v-model:value="formState.userLang" />
                </a-form-item>

                <a-form-item label="人格标签">
                    <a-select v-model:value="this.personality">
                        <!-- "formState.personality" -->
                        <option value="INTJ">INTJ</option>
                        <option value="INTP">INTP</option>
                        <option value="ENTJ">ENTJ</option>
                        <option value="ENTP">ENTP</option>
                        <option value="INFJ">INFJ</option>
                        <option value="INFP">INFP</option>
                        <option value="ENFJ">ENFJ</option>
                        <option value="ENFP">ENFP</option>
                        <option value="ISTJ">ISTJ</option>
                        <option value="ISFJ">ISFJ</option>
                        <option value="ESTJ">ESTJ</option>
                        <option value="ESFJ">ESFJ</option>
                        <option value="ISTP">ISTP</option>
                        <option value="ISFP">ISFP</option>
                        <option value="ESTP">ESTP</option>
                        <option value="ESFP">ESFP</option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <div class="btn">
                        <a-button type="primary" htmlType="submit">
                            更新
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
import { upload } from "../request/request";
import { updateProfile, getProfileData } from '../request/profile';
import { getProfileData2, getProfileData3 } from '../request/profile';
export default {
    props: ["setOpenUpdate", "user", "updateUser"],
    data() {
        return {
            formState: {
                ...this.user
            },
            cover: null,
            profile: null,
            personality: null
        }
    },
    mounted() {
        this.ChangeId() // 在mounted中调用方法
    },
    computed: {
        computedCover() {
            return this.cover ? URL.createObjectURL(this.cover) : this.formState.coverPic
        },
        computedProfile() {
            return this.profile ? URL.createObjectURL(this.profile) : this.formState.profilePic
        }
    },
    methods: {
        async ChangeId() {
            try {
                //console.log(this.user.roleId)
                const res = await getProfileData2(this.user.roleId);
                // 在这里处理response，例如解析JSON数据  
                this.personality = res.data.data;
                //console.log(this.personality); // 打印从服务器获取的数据  
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        },
        async finishHandler() {
            let coverUrl = this.computedCover;
            let profileUrl = this.computedProfile;

            const formData = new FormData();

            if (this.cover) {
                formData.append("img", this.cover);
                const res = await upload(formData);
                coverUrl = res.data.data.url;
            }

            if (this.profile) {
                formData.append("img", this.profile);
                const res = await upload(formData);
                profileUrl = res.data.data.url;
            }

            const res = await getProfileData3(this.personality);
            this.formState.roleId = res.data.data;
            this.formState.coverPic = coverUrl;
            this.formState.profilePic = profileUrl;
            console.log(this.formState);
            updateProfile(this.formState).then(async () => {
                const res = await getProfileData(this.user.userId);
                this.updateUser(res.data.data);
                this.$store.commit('curUserUpdate', res.data.data);
                this.setOpenUpdate(false);
            })

        }

    }
}

</script>

<style lang="scss" scoped>
@import "../style.scss";

.update {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 800px;


    .wrapper {
        width: 800px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding-left: 100px;


        h1 {
            color: lightgrey;
            text-align: center;
            padding-right: 150px;
        }

        .btn {
            display: flex;
            justify-content: center;
            padding-left: 200px;
        }

        .files {
            display: flex;
            justify-content: center;
            padding-right: 200px;
            flex-wrap: wrap;
            gap: 100px;
        }

        label {
            display: flex;
            flex-direction: column;
            gap: 10px;
            color: gray;
            font-size: 14px;

            .imgContainer {
                img {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                }

                .icon {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    font-size: 30px;
                    color: lightgray;
                    cursor: pointer;
                }
            }
        }

    }
}
</style>
