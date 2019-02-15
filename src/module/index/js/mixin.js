import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'index/js/config.js';
import { shuffle } from 'index/js/util.js';

export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode() {
      let str = '';
      if (this.mode === playMode.sequence) {
        str = 'icon-sequence';
      } else if (this.mode === playMode.loop) {
        str = 'icon-loop';
      } else {
        str = 'icon-random';
      }
      return str;
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'playList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => item.id === this.currentSong.id);
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
};

export const searchMixin = {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  data() {
    return {
      keyword: '',
      refreshDelay: 120
    }
  },
  methods: {
    onKeywordChange(val) {
      this.keyword = val;
    },
    saveSearch() {
      this.saveSearchHistory(this.keyword);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    changeKeyword(item) {
      this.$refs.searchBox.setKeyword(item);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }

}
