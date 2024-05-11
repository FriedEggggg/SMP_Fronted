<template>
  <a-modal v-model:visible="open" title="Basic Modal">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
  <div className="shop">
    <div className="itemList">
      <ul>
        <li>
          <shopItemVue :itemData="itemData" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import shopItemVue from "../components/shopItem.vue";
const open = ref(false);
const itemData = ref({
  src: "../assets/img.png",
  name: "test",
  itemPrice: 15,
});
// export default {
//   name: "shop",
//   components: {
//     shopItemVue,
//   },
// };
</script>
<style lang="scss">
@import "../style.scss";

.shop {
  @include themify($themes) {
    // -webkit-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    // -moz-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    // box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    // border-radius: 20px;
    background-color: themed("bgSoft");
    // color: themed("textColor");

    /* background-color: themed('bgSoft'); */
    height: 100%;

    .itemList {
      padding: 4px;
      ul {
        list-style: none;
      }
    }
  }
}
</style>
