<template>
  <div class="tab">
    <router-link class="tab-item" tag="div" :to="{name: item.name, query: $route.query}" replace
                 v-for="(item,index) in tabList" active-class="active" :key="index" :exact="true">
      <span class="tab-link">{{item.meta.labelName}}</span>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'tab',
    data() {
      return {
        tabList: []
      };
    },
    created() {
      this.tabList = this.$router.options.routes.filter(item => !item.isShow);
    }
  };
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~public/stylus/variable.styl";
  .tab
    display: flex
    height 44px
    line-height 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
