const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http)
const crypto = require("crypto");

var rooms = {};
var keys = {};

var keyPairs = {};
var publicKeys = {};

io.on("connection", (socket) => {
    console.log(`Incoming connection from ${socket.id}`);
    
    socket.on("join", ({ ROOM, publicKey }) => {
        socket.join(ROOM);
        rooms[socket.id] = ROOM;
        publicKeys[socket.id] = publicKey;
        keys[socket.id] = crypto.randomBytes(32).toString("hex");
        console.log(`${socket.id} joined ${ROOM}`);

        io.to(socket.id).emit("public-key-transfer", publicKey)
        console.log(publicKey)
        // io.to(ROOM).emit("msg", `Info: ${socket.id} joined ${ROOM}`)
    });

    socket.on("msg", (data) => {
        const roomname = rooms[socket.id];
        io.to(roomname).emit("msg", data)
        console.log("Incoming data: " + data)
    });
});

app.get("/getkey/:sender", (req, res) => {
    var k = req.params.sender;
    k = keys[k];

    if (k) {
        return res.status(200).send({ key: k });
    }

    return res.status(404).end();
});

http.listen(3000, () => {
    console.log("Running on http://localhost:3000");
})