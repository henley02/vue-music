import * as types from './mutation-type';
import { playMode } from 'index/js/config.js';
import { shuffle } from 'index/js/util.js';

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

export const saveSearchHistory = function ({ commit }, query) {
  
}