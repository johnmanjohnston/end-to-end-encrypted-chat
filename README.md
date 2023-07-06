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

# Demo
On running `client.js`, you'll be prompted to enter a room name.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/1488d505-d320-430c-a094-afb3e3668065)

After entering a room name, you'll be assigned a username, which is your socket ID
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/eb91ea9a-381b-43f9-900b-61008cbceb04)

We can also see the users joining the server.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/298a4946-225a-4fda-8c84-6bb276d890d0)

After another client joins the same room, the clients' public keys are exchanged
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/40479b70-bec1-4c67-b385-b1b3b1e71d83)

Users can then have a lovely conversation about whatever they please.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/072a2ffb-f682-4743-8d21-bf9385ea3815)

All the data being sent over to the server is encrypted using state-of-the-art, end-to-end encryption, so even if the users are being spied on, the data can't be decrypted without the user's private key.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/0af6f423-7380-4fd4-889b-fa48333cbc19)

After a user leaves (by entering `.exit`), the other user in the room will be notified.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/83d4efee-e8f6-4aaa-bd3b-297eef28b946)

As users leave, we can see them leaving on the server.
![image](https://github.com/johnmanjohnston/socket-room-chat/assets/97091148/89250b16-7d07-42bf-a1a8-7f7c923684d2)

