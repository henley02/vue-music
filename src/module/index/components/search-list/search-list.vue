<template>
  <div class="search-list" v-show="searches.length">
    <transition-group tag="ul" name="list">
      <li class="search-item" v-for="(item,index) in searches" @click="selectItem(item)" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'search-list',
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    data() {
      return {};
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      deleteOne(item) {
        this.$emit('delete', item);
      }
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s linear
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
