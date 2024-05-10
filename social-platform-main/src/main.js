import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import BrowsingHistory from "./pages/BrowsingHistory.vue";
import Chat from "./pages/chat.vue";
import Friends from "./pages/friends.vue";
import Home from "./pages/home.vue";
import Layout from "./pages/layout.vue";
import Login from "./pages/login.vue";
import Post from "./pages/Post.vue";
import Profile from "./pages/profile.vue";
import Rank from "./pages/Rank.vue";
import Register from "./pages/register.vue";
import SearchResult from "./pages/SearchResult.vue";
import shop from "./pages/shop.vue";
import Star from "./pages/Star.vue";
import store from "./store/store";
import "./style.scss";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: Home,
      },
      {
        path: "/post/:postId",
        component: Post,
      },
      {
        path: "/profile/:userId",
        component: Profile,
      },
      {
        path: "/friends/:userId",
        component: Friends,
      },
      {
        path: "/shop",
        component: shop,
      },
      {
        path: "/chat/:userId",
        component: Chat,
      },
      {
        path: "/history",
        component: BrowsingHistory,
      },
      {
        path: "/search/:query",
        component: SearchResult,
      },
      {
        path: "/star",
        component: Star,
      },
      {
        path: "/rank",
        component: Rank,
      },
    ],
  },
  { name: "login", path: "/login/:username?", component: Login },
  { name: "register", path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const currentUser = store.state.currentUser;

  // 如果未登录则重定向到登录
  if (currentUser === null && to.name !== "login" && to.name !== "register") {
    console.log("test");
    return { name: "login" };
  }
});

createApp(App).use(router).use(Antd).use(store).mount("#app");
