<script setup>
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { excCouponAPI } from "../request/coupon";
import store from "../store/store";

const props = defineProps({
  itemData: Object,
  getCoupon: Object,
});
const stroe = useStore();
const excCoupon = async () => {
  const res = await excCouponAPI(
    store.state.currentUser.userId,
    props.itemData.id
  );
  if (res.data.data == 1) {
    message.info("兑换成功");
  }
  props.getCoupon();
};
</script>
<template>
  <div>
    <a-card bordered hoverable style="position: relative">
      <span style="position: absolute; bottom: 1px; right: 1px"
        >还剩最后{{ props.itemData.couponNum }}个</span
      >
      <template #cover>
        <img
          alt="example"
          style="height: 200px"
          :src="props.itemData.couponImg"
        />
      </template>
      <a-card-meta :title="props.itemData.text">
        <template #description
          ><div>
            <span style="color: red">{{ props.itemData.couponVal }}点</span>
          </div>
          <div style="margin-top: 10px">
            <a-button @click="excCoupon">兑换</a-button>
          </div></template
        >
      </a-card-meta>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
@import "../style.scss";

.item {
  @include themify($themes) {
    -webkit-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    -moz-box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    box-shadow: -14px 8px 55px -27px rgba(0, 0, 0, 0.37);
    border-radius: 20px;
    background-color: themed("bg");
    color: themed("textColor");

    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    // margin: auto;
    margin-top: 20px;
    // margin-left: 20px;
    padding: 20px;

    button {
      position: relative;
      // top: 30px;
      // float: right;
      // right: 20px;
      border: none;
      margin: auto;
      margin-top: 0px;
      margin-right: 5%;
      // background-color: red;
      // color: white;
      cursor: pointer;
      // padding: 5px;
      width: 100px;
      height: 50px;
      border-radius: 24px;
      background: #ffffff;
      box-shadow: 13px 13px 30px #bababa, -13px -13px 30px #ffffff;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 20px;

      .itemPic {
        height: 50px;
        width: 50px;
        object-fit: cover;
        border-radius: 5%;
      }

      .itemName {
        display: flex;
        flex-direction: column;

        font-size: 16px;
        color: black;
        margin: 0;
      }
    }

    .right {
      display: flex;
      gap: 20px;
      align-items: center;

      .itemPrice {
        display: flex;
        flex-direction: column;
        align-items: center;
        // gap: 5px;
        width: 50px;

        color: black;
        margin: 0;
      }
    }
  }
}
</style>
