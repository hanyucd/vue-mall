<template>
  <div>
    <article class="md-modal modal-msg md-modal-transition" :class="{ 'md-show': mdShow }">
      <div class="md-modal-inner">
        <section class="md-top">
          <button class="md-close" @click="closeModal">关闭</button>
        </section>
        <section class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </section>
      </div>
    </article>
    <article class="md-overlay" v-if="mdShow" @click="closeModal"></article>
  </div>
</template>

<script>
  export default {
    props: {
      mdShow: Boolean,
      default: false
    },
    methods: {
      /**
       * 关闭模态框
       */
      closeModal() {
        this.$emit('close');
      }
    }
  }
</script>