import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: 'index',
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        isShow: false
      },
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      meta: {
        labelName: '推荐'
      },
      component(resolve) {
        require(['./../pages/recommend/recommend.vue'], resolve);
      },
      children: [
        {
          path: ':id',
          component(resolve) {
            require(['./../pages/recommend/children/desc/desc.vue'], resolve);
          }
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      meta: {
        labelName: '歌手'
      },
      component(resolve) {
        require(['./../pages/singer/singer.vue'], resolve);
      },
      children: [
        {
          path: ':id',
          component(resolve) {
            require(['./../pages/singer/children/detail/detail.vue'], resolve);
          }
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      meta: {
        labelName: '排行'
      },
      component(resolve) {
        require(['./../pages/rank/rank.vue'], resolve);
      },
      children: [
        {
          name: 'TopList',
          path: ':id',
          component(resolve) {
            require(['./../pages/rank/children/top-list/top-list.vue'], resolve);
          }
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      meta: {
        labelName: '搜索'
      },
      component(resolve) {
        require(['./../pages/search/search.vue'], resolve);
      }
    },
    {
      path: '/user',
      name: 'User',
      meta: {
        isShow: false
      },
      component(resolve) {
        require(['./../pages/user-center/user-center.vue'], resolve);
      }
    }
  ]
});
