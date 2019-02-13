src/module/index/api/rank.js
<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import MusicList from "index/components/music-list/music-list.vue";
  import { mapGetters } from 'vuex';
  import { getMusicList } from 'index/api/rank.js';
  import { processSongUrl } from 'index/api/handlesongurl';
  import { ERR_OK } from "index/api/config";
  import { createSong } from 'index/js/songFactory.js';

  export default {
    name: 'top-list',
    data() {
      return {
        songs: []
      };
    },
    computed: {
      title() {
        return this.topList.topTitle;
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image;
        } else {
          return '';
        }
      },
      ...mapGetters(['topList'])
    },
    methods: {
      async _getMusicList() {
        let res = await getMusicList(this.topList.id);
        if (res.code === ERR_OK) {
          this.songs = await processSongUrl(this._normalizeSongs(res.songlist));
        }
        console.log(this.songs);
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          if (item.data.songid && item.data.albummid) {
            ret.push(createSong(item.data));
          }
        });
        return ret;
      }
    },
    created() {
      if (!this.topList.id) {
        this.$router.back();
        return;
      }
      this._getMusicList();
    },
    components: {
      MusicList
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
