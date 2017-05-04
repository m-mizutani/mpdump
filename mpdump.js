const http = require('http');
const net = require('net');
const app = require('./app');
const msgpack = require('msgpack');
const WebSocketServer = require('websocket').server;

class MPDump {
  constructor() {
    const self = this;
    self._app = app;
    self._wsList = [];
  }

  createHTTPServer(port) {
    const self = this;
    self._app.set('port', port);
    self._httpServer = http.createServer(self._app);
    self._httpServer.listen(port);

    self._wsServer = new WebSocketServer({
      httpServer: self._httpServer,
      autoAcceptConnections: false,
    });

    self._wsServer.on('request', (request) => {
      const conn = request.accept('echo-protocol', request.origin);
      console.log(`${new Date()} Connection accepted.`);
      self._wsList.push(conn);
    });

    return self._httpServer;
  }

  createMsgpackServer(port) {
    const self = this;
    self._msgServer = net.createServer((conn) => {
      const ms = new msgpack.Stream(conn);
      ms.addListener('msg', (msg) => {
        console.log(msg);

        self._wsList.forEach((ws) => {
          ws.sendUTF(JSON.stringify(msg));
        });
      });
    }).listen(port);
  }

}

module.exports = MPDump;
