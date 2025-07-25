const https = require('https');
const socketio = require('socket.io');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const options = {
    key: fs.readFileSync("cert-key.pem"),
    cert: fs.readFileSync("fullchain.pem"),
};



const rl = readline.createInterface({ input, output });
var returningUsers = JSON.parse(fs.readFileSync("returningUsers.json"));
const commands = {
    "code": (arguments) => {
        if (arguments[0] === "server") {
            arguments.shift();
            eval(arguments.join(' '));
        }
        else if (arguments[0] === "client") {
            if(arguments[1] === "all") {
                arguments = arguments.slice(2);
                io.emit('code', arguments.join(' '));
            }
        }
    },
    "client": (arguments) => {
        if (arguments[0] == "rename")  {
            arguments.shift();
        }
    },
    "exit": () => {
        io.close();
        setTimeout(() => {
            server.close(serverClosing);
        }, 250);
    }
}

rl.on("line", data => {
    const arguments = data.split(" ");
    if (commands[arguments[0]] != undefined) {
        commands[arguments.shift()](arguments);
    }
});

var myText = fs.readFileSync('index.html');


const server = https.createServer(options, (req, res) => {
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

    socket.custom = {
        userID: undefined,
        person: undefined
    };

    if (returningUsers[socket.handshake.address] != undefined) {
        socket.custom = returningUsers[socket.handshake.address];
        socket.emit('setUserID', socket.custom.userID);
    }
    
    socket.on("changeUserID", newID => {
        if (newID.trim() != '') {
            console.log(socket.custom.userID+" has renamed to "+newID)
            socket.custom.userID = newID.trim();
        }
    })
    
    socket.on("message", (message) => {
        if (message.reciever == "all") {
            console.log("From "+socket.custom.userID+" to "+message.reciever+": "+message.body);
            io.emit("message", {
                body: message.body,
                reciever: message.reciever,
                sender: socket.custom.userID
            });
        }
    });

    socket.on("showIDs", (data) => { 
        socket.emit("showIDs");
    })

    socket.on("disconnecting", (reason) => {
        console.log(socket.custom.userID+" ("+socket.custom.person+")"+" has disconnected")
        returningUsers[socket.handshake.address] = socket.custom;
    });
    
    console.log(socket.custom.userID +" ("+socket.custom.person+")" + ' HAS CONNECTED FROM ' + socket.handshake.address);
});

const port = 3000;

server.listen(port, () => {console.log("SERVER STARTED");});

function serverClosing() {
    fs.writeFileSync("returningUsers.json", JSON.stringify(returningUsers));
    console.log("SERVER CLOSING");
}
