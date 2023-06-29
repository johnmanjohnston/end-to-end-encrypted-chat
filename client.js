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

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
  
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

async function getKey(sender) {
    var s = null;
    
    await axios.get(`http://localhost:3000/getkey/${sender}`).then((data) => {
        s = data.data.key
    }).catch( (e) => {} );

    return s;
}

socket.on("msg", async (data) => {
    const message = data;

    // console.log(privateKey)

    try {
        var decrypted = crypto.privateDecrypt(privateKey, message);
        decrypted = decrypted.toString();
        console.log(`decrypt: ` + decrypted);
    } catch (e) {
        console.log("Recieved a message. Couldn't decrypt.");
    }
});

socket.on("public-key-transfer", (data) => {
    roomPublicKeys = data;

    console.log(roomPublicKeys);

    for (var id in roomPublicKeys) {
        if (id == socket.id) {
          console.log(`${id} is my socket ID: ${socket.id}`); 
          continue;
        }

        console.log(`My socket id is ${socket.id}, but I've detected ${id}`)
        recieverPublicKey = roomPublicKeys[id]
    }
});

var ROOM = "";

function promptUser() {
    rl.question("", (message) => {
        if (message == ".exit") {
            rl.close();
            process.exit(0);
        }
        
        //readline.moveCursor(process.stdout, 0, -1);
        //readline.clearLine(process.stdout, 0);

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
        // console.log(`My public key: ${publicKey}`)
        socket.emit("join", { ROOM, publicKey });
        promptUser();
    }, 5000)
})
