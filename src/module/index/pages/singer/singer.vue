<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import { getSingerList } from 'index/api/singer';
  import { ERR_OK } from 'index/api/config.js';
  import Singer from 'index/js/singerFactory.js';
  import ListView from 'index/components/list-view/list-view.vue';
  import { mapMutations } from 'vuex';
  import { playListMixin } from 'index/js/mixin.js';

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热门';
  export default {
    name: 'Singer',
    mixins: [playListMixin],
    data() {
      return {
        singers: []
      };
    },
    methods: {
      /**
       * 迷你播放器弹出后 列表位置调整
       * @param playList
       */
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      selectSinger(singer) {
        this.setSinger(singer);
        this.$router.push({
          path: `/singer/${singer.id}`
        });
      },
      _normalizeSinger(list) {
        let map = {
          host: {
            title: HOT_NAME,
            items: [],
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.host.items.push(new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name }));
          }
          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name }));
        });
        // 处理数据
        let hot = [];
        let ret = [];
        for (let key in map) {
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      },
      async _getSingerList() {
        let res = await getSingerList();
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
      })
    },
    components: {
      ListView
    },
    created() {
      this._getSingerList();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed;
    top: 88px
    bottom: 0;
    width: 100%
</style>
