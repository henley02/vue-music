<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bgImage="singer.avatar"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from 'index/api/singer';
  import { processSongUrl } from 'index/api/handlesongurl';
  import { ERR_OK } from 'index/api/config.js';
  import { createSong } from 'index/js/songFactory.js';
  import musicList from 'index/components/music-list/music-list';

  export default {
    name: 'singer-detail',
    data() {
      return {
        songs: []
      };
    },
    components: {
      musicList
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      /*
       * 获取歌手详情
       */
      async _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }

        let res = await getSingerDetail(this.$route.params.id);
        if (res.code === ERR_OK) {
          if (res.data.list.length == 0) {
            return;
          }
          this.songs = await processSongUrl(this._normalizeSong(res.data.list));
        }
      },
      _normalizeSong(list) {
        let ret = [];
        list.forEach((item) => {
          let { musicData } = item;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    created() {
      this._getSingerDetail();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
