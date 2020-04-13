function PromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(promises)) {
      const { length } = promises;
      const count = 0;
      const resolvedEvent = [];
      promises.forEach(promise => {
        promise
          .then(res => {
            resolvedEvent.push(res);
            count++;
            if (count === length) {
              resolve(resolvedEvent);
            }
          })
          .catch(e => {
            reject(e);
          })
      })
    } else {
      reject(new Error('need array'));
    }
  })
}

export default PromiseAll;