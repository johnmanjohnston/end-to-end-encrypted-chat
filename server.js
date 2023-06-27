const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http)

var rooms = {};

io.on("connection", (socket) => {
    console.log(`Incoming connection from ${socket.id}`);
    
    socket.on("join", (roomname) => {
        socket.join(roomname);
        rooms[socket.id] = roomname;
        console.log(`${socket.id} joined ${roomname}`);

        io.to(roomname).emit("msg", `Info: ${socket.id} joined ${roomname}`)
    });

    socket.on("msg", (data) => {
        console.log("Incoming message...");
        console.log(data)

        const roomname = rooms[socket.id];
        io.to(roomname).emit("msg", `${socket.id}: ${data}`)
    });
});


http.listen(3000, () => {
    console.log("Running on http://localhost:3000");
})