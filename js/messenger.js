// messenger.js

/*global window*/

"use strict";

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
    this.subscribers.forEach(function (subscriber) {
        if (subscriber.channel === channel) {
            subscriber.callback(data);
        }
    });
};

Messenger.prototype.subscribe = function (channel, win, cb) {
    this.subscribers.push({
        "channel": channel,
        "callback": cb,
        "window": win
    });
    if (this.state[channel]) {
        cb(this.state[channel]);
    }
};

Messenger.prototype.unsubscribe = function (win) {
    this.subscribers = this.subscribers.filter(function (subscriber) {
        return subscriber.window !== win;
    });
};

window.messenger = window.top.messenger || new Messenger();

window.onbeforeunload = function () {
    window.messenger.unsubscribe(window);
};
