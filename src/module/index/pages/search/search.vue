<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @keyword="onKeywordChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!keyword" ref="shortcutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="changeKeyword(item.k)" class="item" v-for="(item,index) in hotkey" :key="index">{{item.k}}
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="changeKeyword" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>

    </div>
    <div ref="searchResult" class="search-result" v-show="keyword">
      <suggest ref="suggest" :keyword="keyword" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>
<script type="text/ecmascript-6">
  import { getHotKey } from 'index/api/search.js';
  import { ERR_OK } from "index/api/config";
  import { playListMixin } from 'index/js/mixin.js';
  import { mapActions, mapGetters } from 'vuex';
  import Suggest from "index/components/suggest/suggest.vue";
  import SearchBox from "index/components/search-box/search-box.vue";
  import SearchList from "index/components/search-list/search-list.vue";
  import Confirm from "index/components/confirm/confirm.vue";
  import Scroll from "index/components/scroll/scroll.vue";

  export default {
    components: {
      Scroll,
      Confirm,
      SearchList,
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
    watch: {
      keyword(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20);
        }
      }
    },
    mixins: [playListMixin],
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory);
      },
      ...mapGetters(['searchHistory'])
    },
    methods: {
      /**
       * 迷你播放器弹出后 列表位置调整
       * @param playList
       */
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh();

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      saveSearch() {
        this.saveSearchHistory(this.keyword);
      },
      blurInput() {
        this.$refs.searchBox.blur();
      },
      onKeywordChange(val) {
        this.keyword = val;
      },
      changeKeyword(item) {
        this.$refs.searchBox.setKeyword(item);
      },
      async _getHotKey() {
        let res = await getHotKey();
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.splice(0, 10);
        }
      },
      ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
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
