<template>
  <scroll class="list-view" :data="data" :listenScroll="listenScroll" :probeType="probeType" @scroll="_scroll"
          ref="listView">
    <ul>
      <li v-for="(group,gIndex) in data" :key="gIndex" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index) in group.items" @click="selectItem(item)" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" :key="index" class="item" :class="{'current':index==currentIndex}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from './../scroll/scroll.vue';
  import loading from './../loading/loading.vue';
  import { getData } from 'public/js/dom.js';

  const ANCHOR_HEIGHT = 18;
  const TITLE_HEIGHT = 30;
  export default {
    name: 'list-view',
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        listHeight: [],
        scrollY: -1,
        currentIndex: 0,
        probeType: 3,
        listenScroll: true,
        diff: -1,
        fixedTop: 0
      }
    },
    components: {
      Scroll, loading
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        // 当滚动到顶部 newY>0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        // 当中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        // 滚动到底部，切-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    methods: {
      refresh() {
        this.$refs.listView.refresh();
      },
      selectItem(item) {
        this.$emit('select', item);
      },
      _scroll(pos) {
        this.scrollY = pos.y;
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1 ) / ANCHOR_HEIGHT | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return;
        }
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        this.scrollY = -this.listHeight[index];
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight() {
        this.listHeight = [];
        let list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        list.forEach(item => {
          height += item.clientHeight;
          this.listHeight.push(height);
        });
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = [];
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable.styl";
  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 20px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
