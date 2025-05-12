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
    if (commands[arguments[0]] != undefined) {
        commands[arguments.shift()](arguments);
    }
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

io.on('connection', socket => {
    socket.on("changeUserID", newID => {
        socket.custom.userID = newID;
    })
    
    socket.on("message", (message) => {
        if (message.reciever == "all") {
            console.log("MESSAGE RECIEVED");
            console.log(message.body+" "+message.reciever);
            io.emit("message", {
                body: body,
                reciever: reciever,
                sender: socket.custom.userID
            });
        }
    });
    console.log('CLIENT HAS CONNECTED');
})

const port = 3000;

server.listen(port, () => {console.log("SERVER STARTED");});
