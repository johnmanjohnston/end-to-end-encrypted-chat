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
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/652b3e85-bef8-457b-a66f-a2cc89c5feed)

After entering a room name, you'll be assigned a username, which is your socket ID
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/8a9d9ea2-3e23-4c1c-ab22-9ef78e12cffe)

We can also see the users joining the server.
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/645aaac9-8b33-4ac8-bafb-415ae6f2d103)

After another client joins the same room, the clients' public keys are exchanged
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/49e9be8a-f234-46ad-b395-85e8dbb4018a)

Users can then have a lovely conversation about whatever they please.
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/f8ada704-7487-4438-a571-5e186fa0ac9c)

All the data being sent over to the server is encrypted using state-of-the-art, end-to-end encryption, so even if the users are being spied on, the data can't be decrypted without the user's private key.
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/34e353c1-2368-43a3-8200-ba3dca3e9eff)

After a user leaves (by entering `.exit`), the other user in the room will be notified.
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/ca1ecd89-37c6-4263-b0ab-b32b3c8bc2b6)

As users leave, we can see them leaving on the server.
![image](https://github.com/johnmanjohnston/end-to-end-encrypted-chat/assets/97091148/1a4a254a-e1e6-457c-b5e7-efc36d548316)

