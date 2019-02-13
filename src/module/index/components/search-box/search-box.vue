<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" :placeholder="placeholder" v-model="keyword" ref="keyword"/>
    <i class="icon-dismiss" v-show="keyword" @click="clear()"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import { debounce } from 'index/js/util.js';

  export default {
    name: 'search-box',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        keyword: ''
      };
    },
    methods: {
      blur() {
        this.$refs.keyword.blur();
      },
      clear() {
        this.keyword = '';
      },
      setKeyword(val) {
        this.keyword = val;
      }
    },
    created() {
      this.$watch('keyword', debounce((newVal) => {
        this.$emit('keyword', newVal);
      }, 200));
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
