const path=require("path");
const http=require('http');
const express=require("express");
const app=express();
const server=http.createServer(app);
const socketio=require('socket.io');
const io=socketio(server);
const formatMessage=require('./utils/messages');


const botname='ChatCord Bot';
const PORT=3000 || process.env.PORT;

//Set static folder 
app.use(express.static(path.join(__dirname,"public")));
// run when client connects
io.on('connection',socket=>{
    console.log('new web socket connection');
   //this will emit to single user or single client that is connecting

   socket.emit('message',formatMessage(botname,'welcome to chatChord'));
   socket.broadcast.emit('message' ,"a user has joined the chat");
   //runs when client disconnects
   socket.on('disconnect',()=>{
     io.emit('message',formatMessage(botname,'A user has left the chat'));
   })
   //Listen for chat message
   socket.on('chatMessage',(msg)=>{
       io.emit('message',formatMessage('User',msg));
   })
   //
   //io.emit()
   //used to send message to all the clients when it connects;
   //it will broadcast to everybody except the user that is connecting.

   
    
})
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})