const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http)

var rooms = {};
var publicKeys = {};
var roomNameWithPublicKeys = {};

io.on("connection", (socket) => {
    console.log(`Incoming connection from ${socket.id}`);
    
    socket.on("join", ({ ROOM, publicKey }) => {
        if (!roomNameWithPublicKeys[ROOM]) {
            roomNameWithPublicKeys[ROOM] = {};
        }
        var roomUserCount = Object.keys(roomNameWithPublicKeys[ROOM]).length;
        
        if (roomUserCount == 2) {
            io.to(socket.id).emit("room-full", ROOM);
            return;
        }

        socket.join(ROOM);
        rooms[socket.id] = ROOM;
        publicKeys[socket.id] = publicKey;
        console.log(`${socket.id} joined ${ROOM}`);

        roomNameWithPublicKeys[ROOM][socket.id] = publicKey;

        if (Object.keys(roomNameWithPublicKeys[ROOM]).length > 1) {
            io.to(ROOM).emit("public-key-transfer", roomNameWithPublicKeys[ROOM])
        }
    });

    socket.on("disconnect", () => {
        console.log(`Disconnection from ${socket.id}`)
        var roomname = rooms[socket.id];

        io.to(roomname).emit("user-disconnect", socket.id);

        delete rooms[socket.id];
        delete publicKeys[socket.id];
        try {
            delete roomNameWithPublicKeys[roomname][socket.id]
        } catch {}
    });

    socket.on("msg", (data) => {
        const roomname = rooms[socket.id];
        socket.broadcast.to(roomname).emit("msg", data);
        console.log("Incoming data: " + data)
    });
});

http.listen(3000, () => {
    console.log("Running on http://localhost:3000");
})