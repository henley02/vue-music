<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="topList">
      <ul>
        <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,songIndex) in item.songList" :key="songIndex">
              <span>{{songIndex + 1}}</span>
              <span>{{song.songname}}--{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="topList.length==0">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import { getTopList } from 'index/api/rank.js';
  import { ERR_OK } from "index/api/config";
  import Scroll from 'index/components/scroll/scroll.vue';
  import loading from 'index/components/loading/loading.vue';
  import { playListMixin } from 'index/js/mixin.js';
  import { mapMutations } from 'vuex';

  export default {
    name: 'rank',
    data() {
      return {
        topList: []
      };
    },
    mixins: [playListMixin],
    methods: {
      /**
       * 迷你播放器弹出后 列表位置调整
       * @param playList
       */
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.topList.refresh();
      },
      selectItem(item) {
        this.setTopList(item);
        this.$router.push({ path: `/rank/${item.id}` });
      },
      async _getTopList() {
        let res = await getTopList();
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    created() {
      this._getTopList();
    },
    components: {
      Scroll,
      loading
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  @import "~public/stylus/mixin"
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap();
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
