function MyPromise(callback) {
  this.value = '';
  this.status = 'pending';
  this.resolveEvent = [];

  function resolve(value) {
    if (this.status === 'pending') {
      this.value = value;
      this.status = 'resolved';
      this.resolveEvent.forEach(item => {
        item(value);
      });
    }
  }

  function reject(err) {
    if (this.status === 'pending') {
      this.value = value;
      this.status = 'rejected';
      this.rejectEvent.forEach(item => {
        item(value);
      })
    }
  }
  
  try {
    MyPromise(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

MyPromise.prototype.then = function (onFullFilled, onRejected) {
  if (this.status === 'resolved') {
    onFullFilled && onFullFilled(this.value);
  } else if (this.status === 'rejected') {
    onRejected && onRejected(this.value);
  } else {
    onFullFilled && this.resolveEvent.push(onFullFilled);
    onRejected && this.rejectEvent.push(onRejected);
  }
}

export default MyPromise;