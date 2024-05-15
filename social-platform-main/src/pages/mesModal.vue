<template>
  <div class="modal" v-show="isVisible" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-body">
        <slot>
          <p>添加内容</p>
        </slot>
      </div>
      <footer class="modal-footer">
        <slot name="footer">
          <div style="float: right;padding-top: 10px;">
            <button class="right-button" @click="closeModal">确定</button>
          </div>
        </slot>
      </footer>
    </div>
  </div>
</template>  
      
<script>
import Update from '../components/update.vue';

export default {
  name: "Modal",
  data() {
    return {
      personality: null
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isVisible() {
      return this.visible;
    },

  },
  components: {
    Update
  },
  methods: {
    closeModal() {
      this.$emit("masModal", false);
    },
  },
};
</script>  
      
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 45vw;
  /* 占据屏幕宽度的45% */
  position: relative;
  /* 为了确保关闭按钮的定位 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
</style>