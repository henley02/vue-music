export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param func 实际要执行的函数
 * @param delay 延迟时间，也就是阈值，单位是毫秒（ms）
 * @returns {Function} 返回一个“去弹跳”了的函数
 */
export function debounce(fn, delay) {
  // 定时器，用来 setTimeout
  let timer;
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function (...args) {
    if (timer) {
      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer);
    }
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
