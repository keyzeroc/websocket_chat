const WebSocketServer = require('websocket').server;
const http = require('http');
const { readAllMessages, writeNewMessage } = require('./lib.js');

const clients = {}

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', async (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  const messageHistory = await readAllMessages();
  const payload = {
    'method': 'connect',
    messages: messageHistory
  }
  connection.send(JSON.stringify(payload));

  console.log(Object.keys(clients));

  connection.on('message', function (message) {
    const userPayload = JSON.parse(message.utf8Data);

    if (userPayload.method === "chooseUsername") {
      if (!userPayload.username) return;

      clients[userPayload.username] = {
        connection
      };
    }

    if (userPayload.method === "sendMessage") {
      if (!userPayload.message) return;
      writeNewMessage(userPayload.message);
      // send new message to all clients
      for (const key in clients) {
        //don't send message to original sender
        if (key !== userPayload.message.username) {
          const payload = {
            method: 'newMessage',
            message: userPayload.message
          }
          console.log("***** " + key + " *****");
          clients[key]?.connection.send(JSON.stringify(payload));
        }
      }
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });

});