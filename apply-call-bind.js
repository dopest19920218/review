Function.prototype.myApply = function(context = window, ...params) {
  const fn = Symbol();
  context[fn] = this;
  const result = context.fn(params);
  delete context.fn;
  return result;
}

Function.prototype.myCall = function(context = window, ...params) {
  const fn = Symbol();
  context[fn] = this;
  const result = context.fn(...params);
  delete context.fn;
  return result;
}

Function.prototype.myBind = function(context = window, ...params) {
  const _this = this;
  return function (...rest) {
    return _this.apply(context, [...params, ...rest]);
  }
}