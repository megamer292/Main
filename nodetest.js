const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
var myText = fs.readFileSync('index.html');


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(myText);
});

io = new socketio.Server(server);

io.on('connection', client=>{
  console.log('CLIENT HAS CONNECTED');
})

const port = 3000;

server.listen(port, () => {console.log("SERVER STARTED");});
