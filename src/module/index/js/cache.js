import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

/**
 * 添加单个数据
 * @param query
 * @returns {*}
 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 找出所有的数据
 * @returns {*}
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

/**
 * 删除某一项
 * @param query
 * @returns {*}
 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

/**
 * 从数组中删除
 * @param arr 数组
 * @param compare 比较函数
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

/**
 * 往数组中插入
 * @param arr 数组
 * @param val 插入的值
 * @param compare 比较函数
 * @param maxLen 数组最大值
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
