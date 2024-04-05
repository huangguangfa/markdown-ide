<template>
  <div class="vue-markdown-preview">
    <div class="vue-markdown-preview_control">
      <img :src="moreImg" alt="more" @click="show = !show">
      <span class="vue-markdown-preview__copy"
        :class="{ 'copy-success': isCopy }"
        @click="copy">
        {{ isCopy ? '复制成功 ｡^‿^｡' : '复制代码'}}
      </span>
    </div>
    <div v-show="show" v-html="hlCode"></div>
  </div>
</template>

<script>
  import moreImg from '../../../images/more.png'
  import { copyTextToClipboard } from '../../../utils'
  export default {
    props: {
      code: String,
      hlCode: String
    },
    data() {
      return {
        moreImg,
        show: true,
        isCopy: false
      }
    },
    methods: {
      copy() {
        const { code } = this.$props
        code && copyTextToClipboard(code)
        this.isCopy = true
        setTimeout(() => {
          this.isCopy = false
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  .vue-markdown-preview{
    &_control{
      display: flex;
      user-select: none;
      height: 28px;
      align-items: center;
      justify-content: space-between;
      background-color: rgb(248, 248, 248);
      border-bottom: 1px solid #ecebeb;
      padding: 0 10px;
      img{
        width: 12px;
        height: 12px;
        background-color: transparent;
        cursor: pointer;
      }
    }
    &__copy{
      font-size: 12px;
      margin: 0 10px;
      opacity: 0.7;
      cursor: pointer;
    }
    .copy-success{
      color: #67c23a;
    }
  }
</style>
