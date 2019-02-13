<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import MusicList from "index/components/music-list/music-list.vue";
  import { mapGetters } from 'vuex';
  import { getSongList } from 'index/api/recommend.js';
  import { ERR_OK } from 'index/api/config.js';
  import { createSong } from 'index/js/songFactory.js';
  import { processSongUrl } from 'index/api/handlesongurl';

  export default {
    name: 'ReDesc',
    data() {
      return {
        songs: []
      };
    },
    computed: {
      title() {
        console.log(this.disc);
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
      ...mapGetters(['disc'])
    },
    methods: {
      async _getSongList() {
        if (!this.disc.dissid) {
          this.$router.back();
          return;
        }
        let res = await getSongList(this.disc.dissid);
        if (res.code === ERR_OK) {
          this.songs = await processSongUrl(this._normalizeSongs(res.cdlist[0].songlist));
        }
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          if (item.songid && item.albummid) {
            ret.push(createSong(item));
          }
        });
        return ret;
      }
    },
    created() {
      this._getSongList();
    },
    components: {
      MusicList
    },
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
