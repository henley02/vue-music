<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="sliderList.length>0">
          <slider>
            <div v-for="(item,index) in sliderList">
              <a :href="item.linkUrl" :key="index">
                <img :src="item.picUrl" @load="loadImage"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item,index) in discList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60"/>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <div class="desc" v-html="item.dissname"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="isLoading">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import { getRecommend, getDiscList } from 'index/api/recommend.js';
  import { ERR_OK } from 'index/api/config.js';
  import slider from './../../components/slider/slider.vue';
  import scroll from './../../components/scroll/scroll.vue';
  import loading from './../../components/loading/loading.vue';
  import { playListMixin } from 'index/js/mixin.js';
  import { mapMutations } from 'vuex';

  export default {
    name: 'recommend',
    data() {
      return {
        isLoading: true,
        sliderList: [],
        discList: [],
        checkLoaded: false
      };
    },
    mixins: [playListMixin],
    components: {
      slider, scroll, loading
    },
    methods: {
      /**
       * 迷你播放器弹出后 列表位置调整
       * @param playList
       */
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      async getDiscList() {
        let res = await getDiscList();
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
          this.isLoading = false;
        }
      },
      async init() {
        let res = await getRecommend();
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider;
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    created() {
      this.init();
      this.getDiscList();
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
