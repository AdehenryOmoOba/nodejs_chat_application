const http = require("node:http");

const PORT = 8080;

const data = { status: "success", message: "Hello world!" };

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
});

server.listen(PORT, () => {
  console.log(`Server listening on port in port ${PORT}...`);
});
