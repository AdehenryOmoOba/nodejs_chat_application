const net = require("node:net");
const getIPAddress = require("./getIPAddress");

const ipV4Address = getIPAddress();

const PORT = 8080;

const clientSockets = [];

const server = net.createServer();

function broadcast(data) {
  clientSockets.forEach((clientSocket) => {
    clientSocket.write(data);
  });
}

server.on("connection", (socket) => {
  let username;

  socket.on("data", (data) => {
    let stringData = data.toString("utf-8");
    if (stringData.startsWith("userName-")) {
      username = stringData.split("-")[1].trim();
      console.log(`[${username}] is connected ✔️`);
      // Broadcast to all other sockets
      broadcast(`[${username}] joined the chat 🦹`);
      // Message to current socket
      socket.write(`You (${username}) joined the chat 🦹`);
      // Add current socket to socket list
      clientSockets.push(socket);
    } else {
      broadcast(data);
    }
  });

  socket.on("error", () => {});

  socket.on("close", () => {
    broadcast(`user [${username}] left the chat 🚫`);
    console.log(`[${username}] is disconnected ❌`);
  });
});

const serverAddress = `http://${ipV4Address}:${PORT}`;

server.listen(PORT, ipV4Address, () => {
  console.log(`Server listening on port at ${serverAddress}`);
});
