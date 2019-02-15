import * as types from './mutation-type';
import { playMode } from 'index/js/config.js';
import { shuffle } from 'index/js/util.js';
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'index/js/cache.js'

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id);
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

/**
 * 插入歌曲
 * @param commit
 * @param state
 * @param song
 */
export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playList[currentIndex];
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song);
  // 因为是插入歌曲，所以索引要+1
  currentIndex++;
  // 插入这首歌到当前索引的位置
  playList.splice(currentIndex, 0, song);
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice(fpIndex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

/**
 * 删除歌曲
 * @param commit
 * @param state
 * @param song
 */
export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playList, song);
  playList.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);
  if (currentIndex > pIndex || currentIndex == playList.length) {
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  const playingState = playList.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
}

/**
 * 清空播放列表
 * @param commit
 */
export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
}

/**
 * 添加一个搜索历史
 * @param commit
 * @param query
 */
export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

/**
 * 删除一个搜索历史
 * @param commit
 * @param query
 */
export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

/**
 * 清空所有的搜索记录
 * @param commit
 */
export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
}

/**
 * 保存播放记录
 * @param commit
 * @param song
 */
export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
}

/**
 * 保存收藏歌曲
 * @param commit
 * @param song
 */
export const saveFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}

/**
 * 删除某个收藏歌曲
 * @param commit
 * @param song
 */
export const deleteFavoriteList = function ({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}
