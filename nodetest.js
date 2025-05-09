const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const commands = {
    "code": (arguments) => {
        if (arguments[0] === "server") {
            eval(arguments.join(' '));
        }
        else if (arguments[0] === "client") {
            if(arguments[1] === "all") {
                arguments = arguments.slice(2);
                io.emit('code', arguments.join(' '));
            }
        }
    }
}

rl.on("line", data => {
    const arguments = data.split(" ");
    commands[arguments.shift()](arguments);
});

var myText = fs.readFileSync('index.html');


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(myText);
});

io = new socketio.Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', client=>{
  console.log('CLIENT HAS CONNECTED');
})

const port = 3000;

server.listen(port, () => {console.log("SERVER STARTED");});
