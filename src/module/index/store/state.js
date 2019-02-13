import { playMode } from 'index/js/config.js';
import { loadSearch } from 'index/js/cache.js';

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch()
};

export default state;
