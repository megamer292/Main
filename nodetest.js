const http = require('http');
const socketio = require('socket.io');


var myText = "<button>YOOOOOO</button>";
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(myText);
});

io = new socketio.Server(server);

console.log(id);

io.on('connection', client=>{
  console.log('CLIENT HAS CONNECTED');
})

const port = 3000;

server.listen(port, () => {console.log("SERVER STARTED");});
