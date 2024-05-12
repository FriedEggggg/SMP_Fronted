<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import instance from "../request";
import { saveBusinessAPI } from "../request/request";

const open = ref(false);
defineExpose({
  switch: () => (open.value = !open.value),
});
const formState = reactive({
  idCardL: [],
  idCardR: [],
  name: "",
  phone: "",
});
const store = useStore();
const onFinish = async (values) => {
  const res = await saveBusinessAPI(
    store.state.currentUser.userId,
    formState.name,
    formState.phone,
    formState.idCardR[0].response,
    formState.idCardL[0].response
  );
  console.log(res);
  formState.idCardL = [];
  formState.idCardR = [];
  formState.name = "";
  formState.phone = "";
  open.value = false;
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const customUploadL = (e) => {
  const formData = new FormData();
  formData.append("img", e.file);
  // uploadApi 你的二次封装上传接口
  instance
    .post("http://localhost:9000/cor/smp//api/applet/upload", formData)
    .then((res) => {
      // 调用实例的成功方法通知组件该文件上传成功
      //   formState.idCardL[0] = res.data.data.url;
      e.onSuccess(res.data.data.url, e);
    })
    .catch((err) => {
      // 调用实例的失败方法通知组件该文件上传失败
      e.onError(err);
    });
};
const customUploadR = (e) => {
  const formData = new FormData();
  formData.append("img", e.file);
  // uploadApi 你的二次封装上传接口
  instance
    .post("http://localhost:9000/cor/smp//api/applet/upload", formData)
    .then((res) => {
      // 调用实例的成功方法通知组件该文件上传成功
      //   formState.idCardR[0] = res.data.data.url;
      e.onSuccess(res.data.data.url, e);
      console.log(e);
    })
    .catch((err) => {
      // 调用实例的失败方法通知组件该文件上传失败
      e.onError(err);
    });
};
</script>
<template>
  <a-modal :footer="null" v-model:visible="open" title="商家注册">
    <a-form
      :model="formState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="姓名"
        name="name"
        :rules="[{ required: true, message: 'Please input your name!' }]"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        label="电话"
        name="phone"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item
        label="身份证正面"
        name="idCardL"
        :rules="[{ required: true, message: '填入图片' }]"
      >
        <a-upload
          v-model:fileList="formState.idCardL"
          list-type="picture-card"
          :customRequest="customUploadL"
          @remove="
            () => {
              formState.idCardL = [];
              return true;
            }
          "
        >
          <div v-if="formState.idCardL.length < 1">
            <PlusOutlined />
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="身份证反面"
        name="idCardR"
        :rules="[{ required: true, message: '填入图片' }]"
      >
        <a-upload
          v-model:file-list="formState.idCardR"
          list-type="picture-card"
          name="idCardR"
          :customRequest="customUploadR"
          @remove="
            () => {
              formState.idCardR = [];
              return true;
            }
          "
        >
          <div v-if="formState.idCardR.length < 1">
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
</template>
