<template>
  <div class="home">
    <share />
    <posts />
    <div class="home_score">test</div>
  </div>
</template>

<script>
import Posts from "../components/posts.vue";
import Share from "../components/share.vue";

export default {
  name: "home",
  components: {
    Share,
    Posts,
  },
};
</script>

<style lang="scss" scoped>
@import "../style.scss";

.home {
  .home_score {
    background-color: red;
    width: 100%;
    height: 100px;
  }
  @include themify($themes) {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 20px 70px;
    background-color: themed("bgSoft");
    min-height: 100vh;

    @include mobile {
      padding: 10px;
    }

    @include tablet {
      padding: 20px;
    }
  }
}
</style>
