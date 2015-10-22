// messenger.js
"use strict";

(function () {

    /*global window*/

    window.messenger = window.top.messenger || {

        state: {},

        subscribers: [],

        publish: function (channel, message) {
            if (message.state) {
                this.state[channel] = message.state;
                this.notifySubscribers(channel, this.state[channel]);
            } else if (message.eventData) {
                this.notifySubscribers(channel, message.eventData);
            }
        },

        notifySubscribers: function (channel, data) {
            function inChannel(subscriber) {
                return subscriber.channel === channel;
            }
            function notify(subscriber) {
                subscriber.callback(data);
            }
            this.subscribers.filter(inChannel).forEach(notify);
        },

        subscribe: function (channel, win, cb) {
            this.subscribers.push({
                "channel": channel,
                "callback": cb,
                "window": win
            });
            if (this.state[channel]) {
                cb(this.state[channel]);
            }
        },

        unsubscribe: function (win) {
            function notInWindow(subscriber) {
                return subscriber.window !== win;
            }
            this.subscribers = this.subscribers.filter(notInWindow);
        }
    };


    window.onbeforeunload = function () {
        window.messenger.unsubscribe(window);
    };

}());
