<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @keyword="onKeywordChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!keyword">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="changeKeyword(item)" class="item" v-for="(item,index) in hotkey" :key="index">{{item.k}}</li>
          </ul>
        </div>
      </div>

    </div>
    <div class="search-result" v-show="keyword">
      <suggest :keyword="keyword" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import SearchBox from "index/components/search-box/search-box.vue";
  import { getHotKey } from 'index/api/search.js';
  import { ERR_OK } from "index/api/config";
  import Suggest from "index/components/suggest/suggest.vue";

  export default {
    components: {
      Suggest,
      SearchBox
    },
    name: 'search',
    data() {
      return {
        keyword: '',
        hotkey: [],
      };
    },
    methods: {
      saveSearch(val) {

      },
      blurInput() {
        this.$refs.searchBox.blur();
      },
      onKeywordChange(val) {
        this.keyword = val;
      },
      changeKeyword(item) {
        this.$refs.searchBox.setKeyword(item.k);
      },
      async _getHotKey() {
        let res = await getHotKey();
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.splice(0, 10);
        }
      }
    },
    created() {
      this._getHotKey();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  @import "~public/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
