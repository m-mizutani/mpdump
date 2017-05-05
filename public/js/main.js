// eslint-disable func-names

(function () {
  const url = `ws://${location.host}/`;
  console.log(url);

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
      console.log(msg);

      app.events.unshift(msg);
      while (app.events.length > 50) {
        app.events.pop();
      }
    };
  }

  openSocket();
}());
