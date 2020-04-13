function throttle(callback, wait = 200) {
  var now = 0;
  return function(...params) {
    if (Date.now() - now > wait) {
      now = Date.now();
      callback.apply(this, params);
    }
  }
}

function debounce(callback, wait = 200) {
  var timeout;
  return function(...params) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, params);
    }, wait);
  }
}