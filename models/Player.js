const crypto = require("crypto");

module.exports = class Player {
  id = null;
  name = null;
  client = null;
  game = null;
  leaveTimeout = null;
  actions = {};

  constructor(client = null) {
    this.id = crypto.randomBytes(7).toString('hex');
    this.client = client;

    if(this.client) this.client.on('message', this.recieve);
  }

  send(action, data) {
    this.client.send(JSON.stringify({
      action,
      data
    }));
  }

  recieve(msg){
    const { action, data } = JSON.parse(msg);

    if(typeof this.actions[action] === 'function') {
      this.actions[action](data);
    }
  }

  ask(options, callback, timeout = 15000) {
    this.send('ASK', { options });

    this.actions['RESPOND'] = rsp => {
      const { answer } = rsp;
      delete this.actions['RESPOND'];
      if(options.indexOf(answer) === -1) rsp = null;
      callback(answer);
    }

    setTimeout(() => {
      delete this.actions['RESPOND'];
      callback(null);
    }, timeout);
  }


  // Time window for user to come back after leaving
  leaving(fn, timeCount) {
    this.leaveTimeout = setTimeout(function(){
      this.leaveTimeout = null;

      // Callback to execute when player return is timed out
      // like remove them from games or rooms
      fn();
    }, timeCount)
  }

  returning(client) {
    this.setClient(client);

    clearTimeout(this.leaveTimeout);
    this.leaveTimeout = null;
  }
}