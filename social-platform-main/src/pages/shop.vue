<template>
  <div className="shop">
    <div v-if="Business" class="header">
      <a-button
        class="newBotton"
        @click="
          () => {
            open = !open;
          }
        "
        >新增优惠卷</a-button
      >
    </div>
    <a-modal v-model:visible="open" footer="" title="新增优惠卷">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="描述"
          name="desc"
          :rules="[{ required: true, message: '输入描述' }]"
        >
          <a-textarea v-model:value="formState.desc" />
        </a-form-item>

        <a-form-item
          label="数量"
          name="num"
          :rules="[{ type: 'number', min: 1 }]"
        >
          <a-input-number v-model:value="formState.num" />
        </a-form-item>
        <a-form-item
          label="面值"
          name="val"
          :rules="[{ type: 'number', min: 1 }]"
        >
          <a-input-number v-model:value="formState.val" />
        </a-form-item>

        <a-form-item
          label="图片"
          name="fileList"
          :rules="[{ required: true, message: '填入图片' }]"
        >
          <a-upload
            v-model:fileList="formState.fileList"
            list-type="picture-card"
            name="file"
            :multiple="true"
            :customRequest="customUpload"
            @remove="
              () => {
                formState.fileList.pop();
                return true;
              }
            "
          >
            <div v-if="formState.fileList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <div className="itemList">
      <ul>
        <li v-for="item in itemData">
          <shopItemVue :getCoupon="getCoupon" :itemData="item" />
        </li>
      </ul>
      <div
        v-if="itemData.length === 0"
        style="display: flex; align-items: center; justify-content: center"
      >
        暂无可兑换的优惠卷
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import shopItemVue from "../components/shopItem.vue";
import instance from "../request";
import { getCouponAPI, saveCouponAPI } from "../request/coupon";
import { isBusiness } from "../request/request";
const Business = ref(false);
const formState = reactive({
  desc: "",
  val: 0,
  num: 0,
  fileList: [],
});
const customUpload = (e) => {
  const formData = new FormData();
  formData.append("img", e.file);
  // uploadApi 你的二次封装上传接口
  instance
    .post("http://localhost:9000/cor/smp//api/applet/upload", formData)
    .then((res) => {
      // 调用实例的成功方法通知组件该文件上传成功
      formState.fileList.push(res.data.data.url);
      e.onSuccess(res.data.data.url, e);
    })
    .catch((err) => {
      // 调用实例的失败方法通知组件该文件上传失败
      e.onError(err);
    });
};

const onFinish = async (values) => {
  let res = await saveCouponAPI(
    store.state.currentUser.userId,
    formState.desc,
    formState.num,
    formState.fileList[0].response,
    formState.val
  );
  formState.num = 0;
  formState.val = 0;
  formState.fileList = [];
  res = await getCoupon();
  open.value = false;
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const store = useStore();
const open = ref(false);
const itemData = ref([
  // {
  //   id: null,
  //   userId: null,
  //   couponNum: 5,
  //   couponImg: "http://dummyimage.com/400x400",
  //   couponVal: 1,
  // },
]);
const getCoupon = async () => {
  const res = await getCouponAPI(store.state.currentUser.userId);
  itemData.value = res.data.data;
};

onMounted(async () => {
  getCoupon();
  const res = await isBusiness();
  if (res.data.data === 1) Business.value = true;
  else Business.value = false;
});
</script>
<style lang="scss">
@import "../style.scss";

.shop {
  .header {
    padding-top: 10px;
    display: flex;
    flex-direction: row-reverse;
  }
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
