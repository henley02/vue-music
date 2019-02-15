import { playMode } from 'index/js/config.js';
import { loadSearch, loadPlay, loadFavorite } from 'index/js/cache.js';

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
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
};

export default state;
