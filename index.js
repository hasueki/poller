const { EventEmitter } = require('events');
const pauseable = require('pauseable');

module.exports = class Poller extends EventEmitter {
  constructor(options) {
    super();
    this.interval = options?.interval || 1000;
    this.callback = (err, data) => {
      if (!this.poll?.isPaused()) {
        // Error event
        if (err) {
          this.emit('error', err);
        }
        // Poll event
        this.emit('poll', data);
      }
    };
  }

  start(func) {
    setTimeout(() => {
      // Initial request
      func(this.callback);
      // Start polling
      this.poll = pauseable.setInterval(() => {
        // Don't call if paused
        if (!this.poll.isPaused()) {
          func(this.callback);
        }
      }, this.interval);
      // Start event
      this.emit('start');
    });
  }

  clear() {
    this.poll.clear();
    // Clear event
    this.emit('clear');
  }

  pause() {
    this.poll.pause();
    // Pause event
    this.emit('pause');
  }

  resume() {
    this.poll.resume();
    // Resume event
    this.emit('resume');
  }
}