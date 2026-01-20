let timerId = null;

self.onmessage = (e) => {
  if (e.data === 'start') {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      self.postMessage('tick');
    }, 1000);
  } else if (e.data === 'stop' || e.data === 'pause') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
