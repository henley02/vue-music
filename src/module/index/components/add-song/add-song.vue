<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" ref="searchBox" @keyword="onKeywordChange"></search-box>
      </div>
      <div class="shortcut" v-show="!keyword">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex===0" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" :data="searchHistory"
                  class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="changeKeyword"
                           @delete="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="keyword">
        <suggest ref="suggest" :keyword="keyword" :showSinger="showSinger" @listScroll="blurInput"
                 @select="saveSearch"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex';
  import Song from 'index/js/songFactory.js';
  import { searchMixin } from 'index/js/mixin.js';

  import SearchBox from "../search-box/search-box.vue";
  import Suggest from "../suggest/suggest.vue";
  import Switches from "../switches/switches.vue";
  import Scroll from "../scroll/scroll.vue";
  import SongList from "../song-list/song-list.vue";
  import SearchList from "../search-list/search-list.vue";
  import TopTip from "../top-tip/top-tip.vue";

  export default {
    mixins: [searchMixin],
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    components: {
      TopTip,
      SearchList,
      SongList,
      Scroll,
      Switches,
      Suggest,
      SearchBox
    },
    name: 'add-song',
    data() {
      return {
        showFlag: false,
        showSinger: false,
        switches: [
          { name: '最近播放' },
          { name: '搜索历史' }
        ],
        currentIndex: 0
      };
    },
    methods: {
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song));
          this.showTip();
        }
      },
      showTip() {
        this.$refs.topTip.show();
      },
      switchItem(index) {
        this.currentIndex = index;
      },
      show() {
        this.showFlag = true;
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh();
          } else if (this.currentIndex === 1) {
            this.$refs.searchList.refresh();
          }
        }, 20);
      },
      hide() {
        this.showFlag = false;
      },
      selectSuggest() {
        this.saveSearch();
        this.showTip();
      },
      ...mapActions([
        'insertSong'
      ])
    },
    created() {
    },
    mounted() {
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  @import "~public/stylus/mixin"
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text

</style>
