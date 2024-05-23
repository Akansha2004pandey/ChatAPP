const path=require("path");
const http=require('http');
const express=require("express");
const app=express();
const server=http.createServer(app);
const socketio=require('socket.io');
const io=socketio(server);
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');
require('dotenv').config();

const botname='ChatCord Bot';
const PORT=3000 || process.env.PORT;

//Set static folder 
app.use(express.static(path.join(__dirname,"public")));
// run when client connects
io.on('connection',socket=>{
    socket.on('JoinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
    
        socket.join(user.room);
        socket.emit('message',formatMessage(botname,'welcome to chatChord'));
        socket.broadcast.to(user.room).emit('message' ,formatMessage(user.username,`${user.username} has joined the room `));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(room)
        })
    })

   //this will emit to single user or single client that is connecting

  
   
   
   //Listen for chat message
   socket.on('chatMessage',(msg)=>{
       const user=getCurrentUser(socket.id);
       io.to(user.room).emit('message',formatMessage(user.username,msg));
   })
   //runs when client disconnects
   socket.on('disconnect',()=>{
    const user=userLeave(socket.id);
    
    if(user){
        io.to(user.room).emit('message',formatMessage(botname,`A ${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    }
   
    
  })
   //
   //io.emit()
   //used to send message to all the clients when it connects;
   //it will broadcast to everybody except the user that is connecting.

   
    
})
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})