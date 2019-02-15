import { playMode } from 'index/js/config.js';
import { loadSearch, loadPlay } from 'index/js/cache.js';

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
  searchHistory: loadSearch(),
  playHistory: loadPlay()
};

export default state;
