// messenger.js

window.messenger = window.top.messenger || new Messenger();

window.onbeforeunload = function () {
  window.messenger.unsubscribe(window);
}

function Messenger() {
  this.state = {};
  this.subscribers = [];
}

Messenger.prototype.publish = function (channel, message) {
  if (message.state) {
    this.state[channel] = message.state;
    this.notify(channel, this.state[channel]);
  } else if (message.eventData) {
    this.notify(channel, message.eventData);
  } 
};

Messenger.prototype.notify = function (channel, data) {
  this.subscribers.forEach(function(subscriber) {
    if (subscriber.channel == channel) {
      subscriber.callback(data);
    }
  });
};

Messenger.prototype.subscribe = function (channel, cbwindow, cb) {
  this.subscribers.push({
    "channel": channel,
    "callback": cb,
    "window": cbwindow
  });
  if (this.state[channel]) {
    cb(this.state[channel]);
  }
};

Messenger.prototype.unsubscribe = function (cbwindow) {
  var updatedSubscribers = [];
  this.subscribers.forEach(function (subscriber) {
    if (subscriber.window !== cbwindow) {
      updatedSubscribers.push(subscriber);
    }
  });
  this.subscribers = updatedSubscribers;
};
