const io = require("socket.io-client");
const socket = io("http://localhost:3000");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

socket.on("msg", (data) => {
    console.log(data)
});

var ROOM = "";

function promptUser() {
    rl.question("", (message) => {
        if (message == ".exit") {
            rl.close();
            process.exit(0);
        }
        
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);

        socket.emit("msg", message);
        promptUser();
    });
}

rl.question("Room name: ", (roomname) => {
    ROOM = roomname;
    socket.emit("join", ROOM);

    promptUser();
})
