var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var currentTopic = "No topic has been selected yet";
console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("Client connection established");
  if (currentTopic === "No topic has been selected yet") {
    socket.send("*** " + currentTopic + " ***");
  } else {
    socket.send("*** The topic is currently '" + currentTopic + "' ***");
  }

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    if (data.substring(0, 7) === "/topic ") {
      console.log("Success!");
      data = data.slice(7);
      currentTopic = data;
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send("*** The topic is now '" + data + "' ***");
      });
    } else {
      console.log("Message Received: " + data);
      messages.push(data);
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }


  });
});
