// eslint-disable func-names
console.log(location);
(function () {
  const url = `ws://${location.host}/`;
  console.log(url);

  const header = new Vue({ // eslint-disable-line no-unused-vars
    el: '#header',
    data: {
      hostname: location.hostname,
    },
  });
  const app = new Vue({
    el: '#msg-feed',
    data: {
      events: [],
    },
  });

  function openSocket() {
    const ws = new WebSocket(url, ['echo-protocol', 'soap', 'xmpp']);

    ws.onopen = function () {
      console.log((new Date()).toISOString(), 'connected');
    };

    ws.onclose = function () {
      console.log((new Date()).toISOString(), 'reconnecting...');
      setTimeout(openSocket, 3000);
    };

    // Log errors
    ws.onerror = function (error) {
      console.log(`WebSocket Error ${error}`);
    };

    // Log messages from the server
    ws.onmessage = function (e) {
      const msg = JSON.parse(e.data);
      const dt = new Date();
      dt.setTime(msg.ts * 1000);
      msg.datetime = dt.toLocaleString();
      // console.log(msg);

      app.events.unshift(msg);
      while (app.events.length > 50) {
        app.events.pop();
      }
    };
  }

  openSocket();
}());
