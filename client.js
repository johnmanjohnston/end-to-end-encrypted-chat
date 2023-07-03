const io = require("socket.io-client");
const socket = io("http://localhost:3000");
const readline = require("readline");
const crypto = require("crypto");
const axios = require("axios");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var privateKey = null;
var publicKey = null;
var recieverPublicKey = null;
var roomPublicKeys = null;
var otherSocketId = null;

function generateClientKeys() {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        "rsa",
        {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        },
        (err, pubKey, pvtKey) => {
          if (err) {
            reject(err);
          } else {
            publicKey = pubKey;
            privateKey = pvtKey;
            resolve();
          }
        }
      );
    });
}

socket.on("msg", async (data) => {
    const message = data;

    try {
        var decrypted = crypto.privateDecrypt(privateKey, message);
        decrypted = decrypted.toString();
        console.log(`${otherSocketId}: ${decrypted}`);
    } catch (e) {
        console.log("Recieved a message. Couldn't decrypt.");
    }
});

socket.on("public-key-transfer", (data) => {
    roomPublicKeys = data;

    for (var id in roomPublicKeys) {
        if (id == socket.id) {
          continue;
        } else {

          recieverPublicKey = roomPublicKeys[id]
          otherSocketId = id;
          console.log("Info: Recieved other client's public key\n");
        }
    }
});

socket.on("user-disconnect", (userSocketID) => {
	console.log(`\nInfo: ${userSocketID} disconnected.\n`);
	recieverPublicKey = null;
	roomPublicKeys = null;
	otherSocketId = null;
});

socket.on("room-full", (data) => {
	console.log(`${data} is full`);
	process.exit(0);
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

        console.log(`${socket.id}: ${message}`)

        if (!recieverPublicKey) {
            console.log("Did not recieve reciever's public key");
            promptUser();
        }

        var encryptedMessage = null;
        encryptedMessage = crypto.publicEncrypt(recieverPublicKey, Buffer.from(message));

        // console.log(encryptedMessage);

        socket.emit("msg", encryptedMessage);
        promptUser();
    });
}

rl.question("Room name: ", (roomname) => {
    ROOM = roomname;
    
    generateClientKeys();   
    setTimeout(() => {
        socket.emit("join", { ROOM, publicKey });
        console.log(`You are ${socket.id}`)
        promptUser();
    }, 5000)
})
