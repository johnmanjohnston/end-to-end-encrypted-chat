# end-to-end-encryted-chat

A basic utility to transfer text, using end-to-end encryption.
The utility is built using socket.io, to connect clients to the server and transfer text, and uses Node.js for the server.

# Usage
You can start the server, by using the following:
```shell
node server.js
```
The server should then start running on `http://localhost:3000`

Then, to connect as a client, you can run
```shell    
node client.js
```

You'll then be prompted to enter a room name, then your username will be assigned as your socket ID. 
After another user connects to the same room, both users' public keys will be stored and sent to each other, which are used to
encrypt messages. 

To leave the room, enter `.exit`.
