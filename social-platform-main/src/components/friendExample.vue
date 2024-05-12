<template>
    <div class="modal" v-show="isVisible" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <header class="modal-header">
          <h2>一个模态框</h2>
        </header>
        <div class="modal-body">
          <slot>
            
          </slot>
        </div>
        <footer class="modal-footer">
          <slot name="footer">      
            <button class="left-button" @click="closeModal">关闭模态框</button>
          </slot>
        </footer>
      </div>
    </div>
  </template>  
      
  <script>

  export default {
    name: "friendModal",
    data() {
      return {
        
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
    
    methods: {
      closeModal() {
        this.$emit("showModal", false);
      },
    },
  };
</script>  
      
<style lang="scss">

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
    width: 45vw; /* 占据屏幕宽度的45% */
    position: relative; /* 为了确保关闭按钮的定位 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  </style>