<template>
  <scroll class="suggest"
          :data="result"
          :pullup="true"
          :beforeScroll="true"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-data title="抱歉,暂无搜索结果"></no-data>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import { getSearchResult } from 'index/api/search';
  import { ERR_OK } from "index/api/config";
  import { processSongUrl } from 'index/api/handlesongurl';
  import { createSong } from 'index/js/songFactory.js';
  import Scroll from 'index/components/scroll/scroll.vue';
  import Loading from "index/components/loading/loading.vue";
  import Singer from 'index/js/singerFactory.js';
  import { mapMutations, mapActions } from 'vuex';
  import NoData from "index/components/no-data/no-data.vue";

  const TYPE_SINGER = 'singer';
  export default {
    components: {
      NoData,
      Loading,
      Scroll
    },
    name: 'suggest',
    props: {
      keyword: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      keyword(newVal) {
        this._getSearchResult();
      }
    },
    data() {
      return {
        page: 1,
        perpage: 20,
        result: [],
        hasMore: true
      };
    },
    methods: {
      listScroll() {
        this.$emit('listScroll');
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) { // 歌手
          const singer = new Singer({ id: item.singermid, name: item.singername });
          this.setSinger(singer);
          this.$router.push({ path: `/singer/${singer.id}` });
        } else {
          this.insertSong(item);
        }
        this.$emit('select', item);
      },
      searchMore() { // 下拉加载更多的数据
        if (!this.hasMore) {
          return;
        }
        this.page++;
        this._search();
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      async _search() {
        let res = await getSearchResult(this.keyword, this.page, this.showSinger, this.perpage);
        if (res.code === ERR_OK) {
          let ret = await this._normalizeSearch(res.data);
          this.result = this.result.concat(ret);
          this._checkMore(res.data);
        }
      },
      _getSearchResult() {
        this.page = 1;
        this.result = [];
        this.hasMore = true;
        this.$refs.suggest.scrollTo(0, 0);
        this._search();
      },
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * this.perpage) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      async _normalizeSearch(data) {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
        }
        if (data.song) {
          let songList = await processSongUrl(this._normalizeSong(data.song.list));
          ret = ret.concat(songList);
        }
        console.log('-----');
        console.log(ret);
        return ret;
      },
      /**
       * 格式化歌曲列表
       * @param listt
       * @private
       */
      _normalizeSong(list) {
        let ret = [];
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
      }),
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
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
