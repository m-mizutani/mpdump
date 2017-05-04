(function() {
  const url = `ws://${location.host}/`;
  console.log(url);

  const app = new Vue({
    el: '#event-feed',
    data: {
      events: [],
    },
  });

  function openSocket() {
    const ws = new WebSocket(url,['echo-protocol','soap', 'xmpp']);

    ws.onopen = function() {
      console.log((new Date).toISOString(), 'connected');
    };

    ws.onclose = function() {
      console.log((new Date).toISOString(), 'reconnecting...');
      setTimeout(openSocket, 3000);
    };

    // Log errors
    ws.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    ws.onmessage = function (e) {
      const ev = JSON.parse(e.data);
      const obj = Object.assign({ tag: ev[0], timestamp: ev[1] }, ev[2]);
      console.log(obj);

      app.events.unshift(obj);
      while (app.events.length > 50) {
        app.events.pop();
      }
    };
  }

  openSocket();

})();
