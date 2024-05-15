<template>
    <div class='register'>
        <div class='card'>
            <div class='left'>
                <h1>Hello World.</h1>
                <!-- <p>
                    生活封锁了我们，只要我们的心不死，生活便永远不是一汪死水，而我们，依然会绽放最美的姿态。
                </p> -->
                <span style="padding: 0px;">不知道自己的MBTI类型？
                    <a href='https://www.16personalities.com/ch'>点击测试</a>
                </span>
                <div>
                    <span style="position: absolute">或扫码测试</span>
                    <span>
                        <img :src="testPic" style="padding-left:100px;padding-top:0;height:150px;width:250px">
                    </span>
                </div>
                    <router-link to='/login'>
                            <button>返回登录</button>
                        </router-link>
                
            </div>
            <div class="right">
                <h1>注册</h1>
                <form>
                    <input type="text" placeholder='用户名' name='username' v-model="inputs.username" />
                    <input type="email" placeholder='电子邮箱' name='email' v-model="inputs.email" />
                    <input type="password" placeholder="密码" name='password' v-model="inputs.password" />
                    <input type="text" placeholder='昵称' name='nickname' v-model="inputs.nickname" />
                    <!-- <input type="text" placeholder='MBTI' name='mbti' v-model="this.personality" /> -->
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
                    <a-button type="primary" :loading="isLoading" @click="registerHandler">注册</a-button>
                    <p v-if="err" class="err">
                        {{ err }}
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { register } from '../request/request'
export default {
    name: 'register',
    data() {
        return {
            inputs: {
                username: '',
                email: '',
                password: '',
                nickname: '',
                roleId:0
            },
            isLoading: false,
            err: '',
            personality:'',
            testPic:'http://8.137.16.7:9000/youmore/452d7d2c-2629-41e7-a825-25d41884da49.png'
        }
    },
    methods: {
        async registerHandler() {
            if (this.checkInputs() === "disqualification") return;
            this.isLoading = true;
            const res = await register(this.inputs);
            const { code } = res.data;
            if (code === 1) {
                this.isLoading = false;
                this.$router.push(`/login/${this.inputs.username}`);
            } else {
                console.log(res);
                this.err = res;
            }
        },
        async Change(){
            if(this.personality == 'INTJ'){
                this.inputs.roleId = 1;
            }else if(this.personality == 'INTP'){
                this.inputs.roleId = 2;
            }else if (this.personality == 'ENTJ') {
                this.inputs.roleId = 3;
            } else if (this.personality == 'ENTP') {
                this.inputs.roleId = 4;
            } else if (this.personality == 'INFJ') {
                this.inputs.roleId = 5;
            } else if (this.personality == 'INFP') {
                this.inputs.roleId = 6;
            } else if (this.personality == 'ENFJ') {
                this.inputs.roleId = 7;
            } else if (this.personality == 'ENFP') {
                this.inputs.roleId = 8;
            } else if (this.personality == 'ISTJ') {
                this.inputs.roleId = 9;
            } else if (this.personality == 'ISFJ') {
                this.inputs.roleId = 10;
            } else if (this.personality == 'ESTJ') {
                this.inputs.roleId = 11;
            } else if (this.personality == 'ESFJ') {
                this.inputs.roleId = 12;
            } else if (this.personality == 'ISTP') {
                this.inputs.roleId = 13;
            } else if (this.personality == 'ISFP') {
                this.inputs.roleId = 14;
            } else if (this.personality == 'ESTP') {
                this.inputs.roleId = 15;
            } else if (this.personality == 'ESFP') {
                this.inputs.roleId = 16;
            } else {
                this.inputs.roleId = 0;
            }
            console.log(this.inputs.roleId);
        },
        async checkInputs() {
            await this.Change();
            const inputs = this.inputs;
            console.log(inputs);
            for (let key in inputs) {
                if (inputs[key] === "") {
                    this.err = "The form has blank space";
                    return "disqualification";
                }
            }
            const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!reg.test(inputs.email)) {
                this.err = "email format error";
                return "disqualification";
            }

            const len = inputs.password.length
            if (len < 6 || len > 20) {
                this.err = "The password length should be between 6 and 20";
                return "disqualification";
            }
        }
    }
}
</script>

<style lang="scss">
.register {
    // height: 100vh;
    // background-color: rgb(193, 190, 255);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* 背景渐变色 - 原理2 */
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    /* 背景尺寸 - 原理3 */
    background-size: 600% 600%;
    /* 循环动画 - 原理4 */
    animation: gradientBG 5s ease infinite;

    @keyframes gradientBG {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }

    .card {
        display: flex;
        flex-direction: row-reverse;
        width: 50%;
        min-height: 600px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;

        .left {
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 30px;
            background: linear-gradient(rgba(39, 11, 96, .5), rgba(39, 11, 96, .5)), url("https://i.328888.xyz/2023/03/20/P9BtZ.jpeg") center;
            background-size: cover;
            padding: 50px;
            color: white;

            h1 {
                font-size: 100px;
                line-height: 100px;
            }

            span {
                font-size: 14px;
            }

            button {
                width: 50%;
                padding: 10px;
                border: none;
                border-color: #fff;
                color: rebeccapurple;
                font-weight: bold;
                cursor: pointer;
            }
        }

        .right {
            display: flex;
            justify-content: center;
            flex: 1;
            padding: 50px;
            flex-direction: column;
            gap: 50px;

            h1 {
                color: #555;
            }

            form {
                display: flex;
                flex-direction: column;
                gap: 30px;

                input {
                    border: none;
                    border-bottom: 1px solid lightgray;
                    padding: 20px 10px;
                }
            }
        }
    }
}
</style>