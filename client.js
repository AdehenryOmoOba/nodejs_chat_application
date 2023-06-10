const net = require("node:net");
const readline = require("node:readline/promises");
const getIPAddress = require("./getIPAddress");

const PORT = 8080;

// AWS server public IP
// const ipV4Address = "13.41.196.23";

const ipV4Address = getIPAddress();

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function moveCursor(x, y) {
  return new Promise((resolve, _) => {
    process.stdout.moveCursor(x, y, () => {
      resolve();
    });
  });
}

function clearLine(direction) {
  return new Promise((resolve, _) => {
    process.stdout.clearLine(direction, () => {
      resolve();
    });
  });
}

console.log();
console.log("welcome to Liahona chat room 🗨️");

let userName;

const socket = net.createConnection(
  { host: ipV4Address, port: PORT },
  async () => {
    async function insertChat(prompt, name = null) {
      let response = await readLine.question(`${prompt} >>> `);
      await moveCursor(0, -1);
      await clearLine(0);
      if (name) {
        userName = response.trim();
        socket.write(`userName-${response.trim()}`);
      } else {
        socket.write(`[${userName}]: ${response}`);
      }
    }

    console.log();
    await insertChat("What is your name?", "username");

    socket.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(data.toString("utf-8"));
      console.log();
      insertChat("Enter your message");
    });
  }
);

socket.on("end", () => {
  console.log("Server connection ended.");
});

socket.on("error", () => {
  console.log("Server connection ended.");
});
